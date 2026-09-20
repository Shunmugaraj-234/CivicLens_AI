import { Severity, IssueCategory } from '../types';

interface PriorityParams {
  severity: Severity;
  riskScore: number;
  supportersCount: number;
  verificationsCount: number;
  duplicatesCount?: number;
  createdAt: string;
  category: IssueCategory;
  isNearSensitiveArea?: boolean; // e.g. near school, hospital
}

/**
 * Calculates a 0-100 Civic Priority Score based on multi-factor weighting:
 * Priority = Severity (35%) + Risk (25%) + Community Evidence (20%) + Time Unresolved (10%) + Sensitivity (10%)
 */
export function calculatePriorityScore(params: PriorityParams): number {
  // 1. Severity Base (0 - 35 points)
  let severityScore = 15;
  switch (params.severity) {
    case 'LOW':
      severityScore = 10;
      break;
    case 'MEDIUM':
      severityScore = 20;
      break;
    case 'HIGH':
      severityScore = 30;
      break;
    case 'CRITICAL':
      severityScore = 35;
      break;
  }

  // 2. Risk Score from AI (0 - 25 points)
  const riskContribution = (Math.min(100, Math.max(0, params.riskScore)) / 100) * 25;

  // 3. Community Evidence (0 - 20 points)
  // Upvotes + Verifications + Duplicates
  const evidenceCount = (params.supportersCount * 1.5) + (params.verificationsCount * 2) + ((params.duplicatesCount || 0) * 3);
  const communityContribution = Math.min(20, evidenceCount);

  // 4. Time Unresolved Factor (0 - 10 points)
  const hoursOld = (Date.now() - new Date(params.createdAt).getTime()) / (1000 * 60 * 60);
  // Increases priority gradually up to 72 hours
  const timeContribution = Math.min(10, (hoursOld / 72) * 10);

  // 5. Category & Sensitivity Bonus (0 - 10 points)
  let sensitivityBonus = 0;
  const criticalCategories: IssueCategory[] = ['open_manhole', 'fallen_tree', 'public_safety', 'traffic_signal', 'water_leakage'];
  if (criticalCategories.includes(params.category)) {
    sensitivityBonus += 5;
  }
  if (params.isNearSensitiveArea) {
    sensitivityBonus += 5;
  }

  const rawScore = severityScore + riskContribution + communityContribution + timeContribution + sensitivityBonus;
  return Math.min(100, Math.max(1, Math.round(rawScore)));
}

export function getPriorityLabel(score: number): { label: string; color: string; badgeBg: string } {
  if (score >= 81) {
    return { label: 'CRITICAL', color: 'text-red-500', badgeBg: 'bg-red-500/10 text-red-500 border-red-500/30' };
  } else if (score >= 61) {
    return { label: 'HIGH', color: 'text-orange-500', badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/30' };
  } else if (score >= 31) {
    return { label: 'MEDIUM', color: 'text-yellow-500', badgeBg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' };
  } else {
    return { label: 'LOW', color: 'text-emerald-500', badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' };
  }
}
