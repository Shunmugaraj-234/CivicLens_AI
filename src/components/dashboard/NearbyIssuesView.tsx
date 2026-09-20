import React from 'react';
import { CivicReport } from '../../types';
import { MapPin, AlertCircle, ArrowUpRight, Flame, ShieldAlert, CheckCircle2, Navigation } from 'lucide-react';

interface NearbyIssuesViewProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
}

export const NearbyIssuesView: React.FC<NearbyIssuesViewProps> = ({ reports, onSelectReport }) => {
  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
            <Navigation className="w-4 h-4 animate-pulse" /> Live Geolocation Radar
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Nearby Civic Issues</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time civic alerts within 5km radius of your jurisdiction.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-500" />
          <span>{reports.length} Issues Detected Nearby</span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer flex flex-col sm:flex-row gap-4 transition-all shadow-sm hover:shadow-md group"
          >
            <img
              src={report.imageUrl}
              alt={report.title}
              className="w-full sm:w-32 h-32 object-cover rounded-2xl shrink-0 border border-slate-200 dark:border-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80';
              }}
            />

            <div className="space-y-2 flex-1 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">#{report.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    report.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30' :
                    report.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                    'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                  }`}>
                    {report.severity}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-500 transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  📍 {report.location.address}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="text-amber-600 dark:text-amber-400">Priority: {report.priorityScore}/100</span>
                <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
