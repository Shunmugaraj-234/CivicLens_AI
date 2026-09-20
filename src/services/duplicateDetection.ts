import { CivicReport, IssueCategory } from '../types';

export interface DuplicateMatch {
  report: CivicReport;
  distanceMeters: number;
  similarityPercentage: number;
  matchReasons: string[];
}

// Haversine formula for calculating distance in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Searches existing open/in-progress reports within a radius (default 250m) and calculates similarity
 */
export function findDuplicateReports(
  newLat: number,
  newLng: number,
  newCategory: IssueCategory,
  newDescription: string,
  existingReports: CivicReport[],
  maxRadiusMeters: number = 250
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];

  const openReports = existingReports.filter(r => r.status !== 'RESOLVED' && r.status !== 'REJECTED');

  for (const report of openReports) {
    const distance = calculateDistanceMeters(newLat, newLng, report.location.lat, report.location.lng);

    if (distance <= maxRadiusMeters) {
      const matchReasons: string[] = [];
      let similarityScore = 0;

      // Distance score (up to 40%)
      const distanceScore = Math.max(0, 40 - (distance / maxRadiusMeters) * 40);
      similarityScore += distanceScore;
      matchReasons.push(`Located within ${distance} meters`);

      // Category match (30%)
      if (report.category === newCategory) {
        similarityScore += 30;
        matchReasons.push(`Matching category (${newCategory.replace('_', ' ')})`);
      }

      // Description keyword similarity (30%)
      if (newDescription && report.description) {
        const words1 = new Set(newDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3));
        const words2 = new Set(report.description.toLowerCase().split(/\W+/).filter(w => w.length > 3));
        
        let common = 0;
        words1.forEach(w => { if (words2.has(w)) common++; });

        const totalWords = Math.max(1, words1.size);
        const wordMatchPercent = Math.min(1, common / totalWords);
        similarityScore += wordMatchPercent * 30;
        
        if (wordMatchPercent > 0.3) {
          matchReasons.push(`High keyword similarity in problem description`);
        }
      }

      const finalPercentage = Math.min(99, Math.max(10, Math.round(similarityScore)));

      if (finalPercentage >= 50 || (distance < 50 && report.category === newCategory)) {
        matches.push({
          report,
          distanceMeters: distance,
          similarityPercentage: finalPercentage,
          matchReasons,
        });
      }
    }
  }

  // Sort by similarity percentage descending
  return matches.sort((a, b) => b.similarityPercentage - a.similarityPercentage);
}
