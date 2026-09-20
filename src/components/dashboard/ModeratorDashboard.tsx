import React, { useState } from 'react';
import { CivicReport, IssueStatus } from '../../types';
import { updateReportStatus } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { getPriorityLabel } from '../../services/priorityEngine';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Upload,
  UserCheck,
  Building,
  FileCheck,
  Check
} from 'lucide-react';

interface ModeratorDashboardProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  onRefresh: () => void;
}

export const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({
  reports,
  onSelectReport,
  onRefresh,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Resolution evidence form modal state
  const [resolutionModalReport, setResolutionModalReport] = useState<CivicReport | null>(null);
  const [afterImageUrl, setAfterImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  );
  const [resolutionDesc, setResolutionDesc] = useState<string>(
    'Municipal field team completed high-density asphalt filling, roller compaction, and installed safety barricade clearing.'
  );
  const [resolutionType, setResolutionType] = useState<string>('Asphalt Repair & Sanitization');

  // Sort queue strictly by Priority Score descending (0-100)
  const sortedReports = [...reports].sort((a, b) => b.priorityScore - a.priorityScore);

  const filteredQueue = sortedReports.filter(r => {
    if (selectedStatusFilter === 'ALL') return true;
    return r.status === selectedStatusFilter;
  });

  // Update Status Quick Handler
  const handleQuickStatusChange = (report: CivicReport, newStatus: IssueStatus) => {
    updateReportStatus(report.id, newStatus, user, `Status changed to ${newStatus} by Field Officer ${user.name}`);
    onRefresh();
  };

  // Submit Resolution Evidence
  const handleSubmitResolution = () => {
    if (!resolutionModalReport) return;

    updateReportStatus(
      resolutionModalReport.id,
      'RESOLVED',
      user,
      `Issue marked RESOLVED with verified before/after evidence by ${user.name}`,
      {
        beforeImageUrl: resolutionModalReport.imageUrl,
        afterImageUrl,
        description: resolutionDesc,
        resolvedAt: new Date().toISOString(),
        resolvedBy: `${user.name} (${user.area})`,
        resolutionType,
      }
    );

    setResolutionModalReport(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header operations banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5 dark:from-slate-900 dark:via-amber-950/40 dark:to-slate-900 border border-amber-300 dark:border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-md dark:shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Field Operations Queue
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Priority Operations Dashboard</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Issues automatically sorted by 0-100 Dynamic Civic Priority Score for optimal dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Filter Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-900 text-xs text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses ({reports.length})</option>
            <option value="REPORTED">Reported</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* QUEUE TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950">
          <span>Active Priority Queue ({filteredQueue.length} issues)</span>
          <span className="text-amber-600 dark:text-amber-400">Sorted by Priority Score ▼</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Priority</th>
                <th className="p-4">Report ID</th>
                <th className="p-4">Issue & Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Supporters</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredQueue.map(report => {
                const { label: priorityLabel, badgeBg } = getPriorityLabel(report.priorityScore);
                return (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Priority Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg font-black text-xs border ${badgeBg}`}>
                        {report.priorityScore}
                      </span>
                    </td>

                    {/* ID */}
                    <td className="p-4 font-bold text-sky-600 dark:text-sky-400">#{report.id}</td>

                    {/* Issue & Category */}
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.title}</div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        {report.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {report.location.address}
                    </td>

                    {/* Severity */}
                    <td className="p-4">
                      <span className={`font-extrabold ${
                        report.severity === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : report.severity === 'HIGH' ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {report.severity}
                      </span>
                    </td>

                    {/* Supporters */}
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      👍 {report.supportersCount}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700">
                        {report.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onSelectReport(report)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {report.status !== 'IN_PROGRESS' && report.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleQuickStatusChange(report, 'IN_PROGRESS')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/40 text-[11px]"
                        >
                          Start Work
                        </button>
                      )}

                      {report.status !== 'RESOLVED' && (
                        <button
                          onClick={() => setResolutionModalReport(report)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[11px] shadow-sm"
                        >
                          Mark Fixed
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESOLUTION EVIDENCE MODAL */}
      {resolutionModalReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Upload Resolution Evidence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit before & after inspection photos to resolve report #{resolutionModalReport.id}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Before Image (Reported)</label>
                <img src={resolutionModalReport.imageUrl} alt="Before" className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">After Resolution Image URL / Upload</label>
                <input
                  type="text"
                  value={afterImageUrl}
                  onChange={e => setAfterImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Resolution Work Type</label>
                <input
                  type="text"
                  value={resolutionType}
                  onChange={e => setResolutionType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Field Resolution Description</label>
                <textarea
                  rows={3}
                  value={resolutionDesc}
                  onChange={e => setResolutionDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setResolutionModalReport(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResolution}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/30"
              >
                Submit & Complete Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
