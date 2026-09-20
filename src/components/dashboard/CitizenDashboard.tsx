import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CivicReport, CivicHealthMetrics } from '../../types';
import { CivicScoreGauge } from '../ui/CivicScoreGauge';
import { getPriorityLabel } from '../../services/priorityEngine';
import { CITY_CIVIC_HEALTH, CIVIC_PULSE_DATA } from '../../data/seedData';
import {
  FileText,
  CheckCircle2,
  Clock,
  ThumbsUp,
  MapPin,
  Flame,
  Activity,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';

interface CitizenDashboardProps {
  reports: CivicReport[];
  onNavigate: (tab: string) => void;
  onSelectReport: (report: CivicReport) => void;
  onReportClick: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  reports,
  onNavigate,
  onSelectReport,
  onReportClick,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  const totalReports = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length;
  const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;

  const nearbyReports = reports.slice(0, 6);

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-slate-100 dark:from-slate-900 dark:via-sky-950 dark:to-indigo-950 p-6 rounded-3xl border border-sky-200 dark:border-sky-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Welcome Back, {user.name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Citizen Intelligence Overview</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Tracking local civic health, nearby open reports, and community resolution impact in {user.area}.
          </p>
        </div>

        <button
          onClick={onReportClick}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* CIVICPULSE DIGEST BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white to-sky-500/10 dark:from-amber-500/10 dark:via-slate-900 dark:to-sky-500/10 border border-amber-300 dark:border-amber-500/30 space-y-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
            <Flame className="w-5 h-5 animate-bounce text-amber-500" />
            <span>CivicPulse Digest — {user.city} Today</span>
          </div>
          <button
            onClick={() => onNavigate('civic-pulse')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1"
          >
            <span>View Full Intelligence Pulse</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          "{CIVIC_PULSE_DATA.aiSummary}"
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">New Reports (24h)</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-base">{CIVIC_PULSE_DATA.newIssues24h}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Resolved (24h)</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">{CIVIC_PULSE_DATA.resolved24h}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Critical Hazards</span>
            <span className="font-extrabold text-red-600 dark:text-red-400 text-base">{CIVIC_PULSE_DATA.criticalCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Road Trend</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-base">{CIVIC_PULSE_DATA.roadIssueTrend}</span>
          </div>
        </div>
      </div>

      {/* TOP STAT CARDS + CIVIC IMPACT GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Total Reports Logged</span>
              <FileText className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{totalReports}</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12 this week
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Resolved Issues</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">84.5% resolution rate</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>In Progress / Assigned</span>
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Active work orders</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>Community Contributions</span>
              <ThumbsUp className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{user.points}</div>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">Civic XP Points</span>
          </div>
        </div>

        {/* Right Civic Impact Score Gauge */}
        <div className="lg:col-span-5">
          <CivicScoreGauge
            score={user.impactScore}
            title="Your Civic Impact Score"
            subtitle="You're actively helping make your neighborhood safer and cleaner."
            size="lg"
          />
        </div>
      </div>

      {/* CIVIC HEALTH BREAKDOWN SECTORS */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-500 dark:text-sky-400" /> City Civic Health Sectors ({CITY_CIVIC_HEALTH.overallScore}/100)
          </h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
            +{CITY_CIVIC_HEALTH.changeMonth}% improvement this month
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { label: 'Road Safety', score: CITY_CIVIC_HEALTH.roadSafety, color: 'bg-sky-500' },
            { label: 'Cleanliness', score: CITY_CIVIC_HEALTH.cleanliness, color: 'bg-emerald-500' },
            { label: 'Infrastructure', score: CITY_CIVIC_HEALTH.infrastructure, color: 'bg-amber-500' },
            { label: 'Lighting', score: CITY_CIVIC_HEALTH.lighting, color: 'bg-purple-500' },
            { label: 'Water & Pipes', score: CITY_CIVIC_HEALTH.water, color: 'bg-blue-500' },
            { label: 'Public Safety', score: CITY_CIVIC_HEALTH.publicSafety, color: 'bg-teal-500' },
          ].map(sector => (
            <div key={sector.label} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">{sector.label}</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{sector.score}</span>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${sector.color}`} style={{ width: `${sector.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEARBY ISSUES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500 dark:text-sky-400" /> Nearby Civic Reports in {user.area}
          </h3>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1"
          >
            <span>View All on Map</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearbyReports.map(report => {
            const { label: priorityLabel, badgeBg } = getPriorityLabel(report.priorityScore);
            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-slate-700 overflow-hidden shadow-sm hover:shadow-md dark:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1 group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900/80 text-white backdrop-blur-md border border-slate-700 uppercase">
                    {report.category.replace('_', ' ')}
                  </div>
                  <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border ${badgeBg}`}>
                    {priorityLabel} ({report.priorityScore})
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                    {report.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <MapPin className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                    <span>{report.location.address}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">👍 {report.supportersCount} Supporters</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{report.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
