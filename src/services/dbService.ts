import { CivicReport, User, Comment, NotificationItem, IssueStatus, VerificationVote, ResolutionEvidence, Role } from '../types';
import { INITIAL_REPORTS, DEMO_USERS } from '../data/seedData';
import { calculatePriorityScore } from './priorityEngine';

const STORAGE_KEY_REPORTS = 'civiclens_reports_v1';
const STORAGE_KEY_USER = 'civiclens_current_user_v1';
const STORAGE_KEY_COMMENTS = 'civiclens_comments_v1';
const STORAGE_KEY_NOTIFS = 'civiclens_notifs_v1';

// Initialize default storage
export function getStoredReports(): CivicReport[] {
  const data = localStorage.getItem(STORAGE_KEY_REPORTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: CivicReport[]): void {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
}

export function getCurrentUser(): User {
  const data = localStorage.getItem(STORAGE_KEY_USER);
  if (!data) {
    const defaultUser = DEMO_USERS[0];
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEMO_USERS[0];
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

export function switchDemoRole(role: Role): User {
  const targetUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
  setCurrentUser(targetUser);
  return targetUser;
}

export function addReport(newReport: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'supportersCount' | 'supportersUserIds' | 'verificationsCount' | 'verifications' | 'statusHistory' | 'commentsCount'>): CivicReport {
  const reports = getStoredReports();
  const id = `REP-${100 + reports.length + 1}`;
  const now = new Date().toISOString();

  const report: CivicReport = {
    ...newReport,
    id,
    createdAt: now,
    updatedAt: now,
    supportersCount: 1,
    supportersUserIds: [newReport.reportedBy.id],
    verificationsCount: 0,
    verifications: [],
    commentsCount: 0,
    statusHistory: [
      {
        id: `hist-${Date.now()}`,
        newStatus: newReport.status || 'REPORTED',
        changedBy: newReport.reportedBy.id,
        changedByName: newReport.reportedBy.name,
        timestamp: now,
        note: 'Initial report filed via CivicLens AI',
      }
    ]
  };

  const updated = [report, ...reports];
  saveReports(updated);

  // Add notification
  addNotification({
    userId: newReport.reportedBy.id,
    title: 'Report Created Successfully',
    message: `Your report #${id} (${newReport.category.replace('_', ' ')}) has been published on the civic map with Priority Score ${newReport.priorityScore}/100.`,
    type: 'STATUS_CHANGE',
    reportId: id,
  });

  return report;
}

export function toggleSupportReport(reportId: string, userId: string): CivicReport | null {
  const reports = getStoredReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return null;

  const report = reports[index];
  const hasSupported = report.supportersUserIds.includes(userId);

  let newSupporters = [...report.supportersUserIds];
  if (hasSupported) {
    newSupporters = newSupporters.filter(id => id !== userId);
  } else {
    newSupporters.push(userId);
  }

  const supportersCount = newSupporters.length;

  // Recalculate Priority Score
  const priorityScore = calculatePriorityScore({
    severity: report.severity,
    riskScore: report.riskScore,
    supportersCount,
    verificationsCount: report.verificationsCount,
    createdAt: report.createdAt,
    category: report.category,
  });

  const updatedReport: CivicReport = {
    ...report,
    supportersUserIds: newSupporters,
    supportersCount,
    priorityScore,
    updatedAt: new Date().toISOString(),
  };

  reports[index] = updatedReport;
  saveReports(reports);

  return updatedReport;
}

export function addVerificationVote(
  reportId: string,
  user: User,
  voteType: 'STILL_EXISTS' | 'RESOLVED' | 'NOT_ACCURATE',
  note?: string
): CivicReport | null {
  const reports = getStoredReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return null;

  const report = reports[index];
  const now = new Date().toISOString();

  // Remove previous vote by same user if exists
  const cleanVerifications = report.verifications.filter(v => v.userId !== user.id);

  const newVote: VerificationVote = {
    id: `v-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    type: voteType,
    timestamp: now,
    note,
  };

  const verifications = [newVote, ...cleanVerifications];
  const verificationsCount = verifications.length;

  const priorityScore = calculatePriorityScore({
    severity: report.severity,
    riskScore: report.riskScore,
    supportersCount: report.supportersCount,
    verificationsCount,
    createdAt: report.createdAt,
    category: report.category,
  });

  const updatedReport: CivicReport = {
    ...report,
    verifications,
    verificationsCount,
    priorityScore,
    updatedAt: now,
  };

  reports[index] = updatedReport;
  saveReports(reports);

  return updatedReport;
}

export function updateReportStatus(
  reportId: string,
  newStatus: IssueStatus,
  user: User,
  note?: string,
  resolutionEvidence?: ResolutionEvidence
): CivicReport | null {
  const reports = getStoredReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return null;

  const report = reports[index];
  const now = new Date().toISOString();

  const historyEntry = {
    id: `hist-${Date.now()}`,
    previousStatus: report.status,
    newStatus,
    changedBy: user.id,
    changedByName: user.name,
    timestamp: now,
    note,
  };

  const updatedReport: CivicReport = {
    ...report,
    status: newStatus,
    statusHistory: [historyEntry, ...report.statusHistory],
    resolutionEvidence: resolutionEvidence || report.resolutionEvidence,
    updatedAt: now,
  };

  reports[index] = updatedReport;
  saveReports(reports);

  // Notify original reporter
  addNotification({
    userId: report.reportedBy.id,
    title: `Issue #${report.id} Status Updated`,
    message: `Your reported issue status has been updated to "${newStatus.replace('_', ' ')}" by ${user.name}.`,
    type: 'STATUS_CHANGE',
    reportId: report.id,
  });

  return updatedReport;
}

// Notifications
export function getNotifications(userId: string): NotificationItem[] {
  const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
  let notifs: NotificationItem[] = [];
  if (data) {
    try { notifs = JSON.parse(data); } catch { notifs = []; }
  }

  if (notifs.length === 0) {
    // Seed default notifications
    notifs = [
      {
        id: 'n1',
        userId: 'usr-citizen-1',
        title: 'Report Verified by Community',
        message: '17 citizens have verified your pothole report #REP-101 in Central City.',
        type: 'VERIFICATION',
        read: false,
        reportId: 'REP-101',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'n2',
        userId: 'usr-citizen-1',
        title: 'Work Order Issued!',
        message: 'Officer Priya Sharma changed status of #REP-101 to IN PROGRESS.',
        type: 'STATUS_CHANGE',
        read: false,
        reportId: 'REP-101',
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  }

  return notifs.filter(n => n.userId === userId);
}

export function addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void {
  const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
  let notifs: NotificationItem[] = data ? JSON.parse(data) : [];
  const newItem: NotificationItem = {
    ...notif,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifs = [newItem, ...notifs];
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
}

export function markNotificationAsRead(id: string): void {
  const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
  if (!data) return;
  const notifs: NotificationItem[] = JSON.parse(data);
  const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
}
