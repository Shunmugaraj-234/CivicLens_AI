import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CivicReport } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { CITY_CIVIC_HEALTH, AREA_HEALTH_SCORES } from '../../data/seedData';
import {
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building2,
  TrendingUp,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

interface AdminDashboardProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, onSelectReport }) => {
  const { isDark } = useTheme();
  const [selectedAreaTab, setSelectedAreaTab] = useState<string>('Central City');

  const totalUsers = 12480;
  const totalReports = reports.length;

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Report ID', 'Title', 'Category', 'Severity', 'Priority Score', 'Status', 'Address', 'Area', 'Created At'];
    const rows = reports.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.severity,
      r.priorityScore,
      r.status,
      `"${r.location.address.replace(/"/g, '""')}"`,
      r.location.area,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicLens_Municipal_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart 1: Reports per day mock data
  const reportsPerDay = [
    { day: 'Mon', reports: 34, resolved: 28 },
    { day: 'Tue', reports: 42, resolved: 36 },
    { day: 'Wed', reports: 38, resolved: 31 },
    { day: 'Thu', reports: 51, resolved: 44 },
    { day: 'Fri', reports: 48, resolved: 39 },
    { day: 'Sat', reports: 29, resolved: 25 },
    { day: 'Sun', reports: 31, resolved: 27 },
  ];

  // Chart 2: Category breakdown
  const categoryData = [
    { name: 'Potholes', count: 18, color: '#38bdf8' },
    { name: 'Garbage', count: 14, color: '#10b981' },
    { name: 'Water Leak', count: 10, color: '#f59e0b' },
    { name: 'Streetlight', count: 8, color: '#8b5cf6' },
    { name: 'Open Manhole', count: 6, color: '#ef4444' },
  ];

  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipText = isDark ? '#ffffff' : '#0f172a';
  const axisColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-white to-purple-500/5 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 flex flex-wrap items-center justify-between gap-4 shadow-md dark:shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-purple-500" /> Municipal Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">City-wide Civic Analytics</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Executive overview of municipal resolution efficiency, category distributions, and district scores.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-transform transform hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" /> Export Reports CSV
        </button>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Active Citizens</span>
            <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalUsers.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">88% Community Participation</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Civic Reports</span>
            <Layers className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalReports}</div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">+48 new issues today</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">31 Hours</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Target &lt; 48 hours</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>AI Model Accuracy</span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">94.2%</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Multimodal Gemini Vision</span>
        </div>
      </div>

      {/* RECHARTS ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports per day bar chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md dark:shadow-xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-500 dark:text-sky-400" /> Weekly Report Submissions vs Resolutions
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText }} />
                <Legend />
                <Bar dataKey="reports" fill="#0284c7" name="Logged Reports" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved by PWD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown pie chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md dark:shadow-xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500 dark:text-purple-400" /> Issues by Category
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AREA COMPARISON TOOL */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md dark:shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-500 dark:text-sky-400" /> District Civic Health Comparison Matrix
          </h3>
          <span className="text-xs text-slate-600 dark:text-slate-400">Overall City Score: 78 / 100</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {AREA_HEALTH_SCORES.map(area => (
            <div
              key={area.areaName}
              onClick={() => setSelectedAreaTab(area.areaName)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                selectedAreaTab === area.areaName
                  ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-500 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{area.areaName}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{area.score} <span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                <div className="flex justify-between"><span>Reports:</span> <strong className="text-slate-900 dark:text-white">{area.reportCount}</strong></div>
                <div className="flex justify-between"><span>Resolution:</span> <strong className="text-emerald-600 dark:text-emerald-400">{area.resolutionRate}%</strong></div>
                <div className="flex justify-between"><span>Avg Speed:</span> <strong className="text-amber-600 dark:text-amber-400">{area.avgResolutionHours}h</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
