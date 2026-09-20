export type Role = 'citizen' | 'moderator' | 'admin';

export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'water_leakage'
  | 'drainage'
  | 'traffic_signal'
  | 'open_manhole'
  | 'illegal_dumping'
  | 'fallen_tree'
  | 'sidewalk_damage'
  | 'public_toilet'
  | 'noise_pollution'
  | 'air_pollution'
  | 'public_safety'
  | 'other';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus =
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  city: string;
  area: string;
  phone?: string;
  points: number;
  level: number;
  levelTitle: string;
  impactScore: number;
  badges: string[];
  isPrivateProfile?: boolean;
}

export interface AIAnalysisResult {
  category: IssueCategory;
  subcategory: string;
  severity: Severity;
  confidence: number; // 0 - 1.0 (e.g. 0.94)
  riskScore: number; // 0 - 100
  description: string;
  visibleHazards: string[];
  recommendedAction: string;
  estimatedUrgency: 'routine' | 'moderate' | 'urgent' | 'immediate';
}

export interface VerificationVote {
  id: string;
  userId: string;
  userName: string;
  type: 'STILL_EXISTS' | 'RESOLVED' | 'NOT_ACCURATE';
  timestamp: string;
  note?: string;
  evidenceUrl?: string;
}

export interface StatusHistoryEntry {
  id: string;
  previousStatus?: IssueStatus;
  newStatus: IssueStatus;
  changedBy: string;
  changedByName: string;
  timestamp: string;
  note?: string;
}

export interface ResolutionEvidence {
  beforeImageUrl: string;
  afterImageUrl: string;
  description: string;
  resolvedAt: string;
  resolvedBy: string;
  resolutionType: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  area: string;
  city: string;
}

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  subcategory: string;
  severity: Severity;
  aiSeverity: Severity;
  overrideReason?: string;
  priorityScore: number; // 0 - 100
  confidence: number;
  riskScore: number;
  visibleHazards: string[];
  recommendedAction: string;
  estimatedUrgency: 'routine' | 'moderate' | 'urgent' | 'immediate';
  location: LocationData;
  imageUrl: string;
  videoUrl?: string;
  status: IssueStatus;
  reportedBy: {
    id: string;
    name: string;
    avatar: string;
    isAnonymous?: boolean;
  };
  createdAt: string;
  updatedAt: string;
  supportersCount: number;
  supportersUserIds: string[];
  verificationsCount: number;
  verifications: VerificationVote[];
  statusHistory: StatusHistoryEntry[];
  resolutionEvidence?: ResolutionEvidence;
  commentsCount: number;
  duplicateOfId?: string;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: Role;
  text: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'STATUS_CHANGE' | 'VERIFICATION' | 'SUPPORT' | 'DUPLICATE' | 'ACHIEVEMENT';
  read: boolean;
  reportId?: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface CivicHealthMetrics {
  city: string;
  overallScore: number; // 0 - 100
  roadSafety: number;
  cleanliness: number;
  infrastructure: number;
  lighting: number;
  water: number;
  publicSafety: number;
  resolutionRate: number; // percentage
  participationScore: number;
  changeMonth: number; // e.g. +8
}

export interface AreaHealthScore {
  areaName: string;
  score: number;
  reportCount: number;
  resolutionRate: number;
  avgResolutionHours: number;
  primaryCategory: string;
}
