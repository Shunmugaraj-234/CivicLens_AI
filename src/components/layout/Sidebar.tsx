import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  MapPin,
  FileText,
  Radio,
  Bell,
  Bot,
  Trophy,
  Activity,
  User,
  Settings,
  ShieldAlert,
  BarChart3,
  Building2,
  Users,
  Flame,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  if (!user) return null;

  const citizenItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { id: 'map', label: 'Civic Map', icon: MapPin },
    { id: 'my-reports', label: 'My Reports', icon: FileText },
    { id: 'nearby', label: 'Nearby Issues', icon: Radio },
    { id: 'civic-pulse', label: 'CivicPulse Digest', icon: Flame, badge: 'HOT' },
    { id: 'ai-assistant', label: 'Civic AI Assistant', icon: Bot },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'impact', label: 'Personal Impact', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const moderatorItems = [
    { id: 'moderator-dashboard', label: 'Priority Ops Queue', icon: ShieldAlert, highlight: true },
    { id: 'map', label: 'Field Civic Map', icon: MapPin },
    { id: 'my-reports', label: 'Assigned Issues', icon: FileText },
    { id: 'civic-pulse', label: 'CivicPulse Digest', icon: Flame },
    { id: 'ai-assistant', label: 'Civic AI Assistant', icon: Bot },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Analytics', icon: BarChart3, highlight: true },
    { id: 'area-comparison', label: 'Area Health Score', icon: Building2 },
    { id: 'moderator-dashboard', label: 'Priority Queue Ops', icon: ShieldAlert },
    { id: 'map', label: 'City-wide Heatmap', icon: MapPin },
    { id: 'my-reports', label: 'All Reports Manager', icon: FileText },
    { id: 'admin-users', label: 'User Directory', icon: Users },
    { id: 'civic-pulse', label: 'CivicPulse Summary', icon: Flame },
  ];

  let menuItems = citizenItems;
  if (user.role === 'moderator') menuItems = moderatorItems;
  if (user.role === 'admin') menuItems = adminItems;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="p-4 space-y-6">
        {/* User Status Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-sky-500/50" />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
              <Award className="w-3 h-3" />
              <span>{user.levelTitle} (Lvl {user.level})</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">
            Main Menu ({user.role})
          </div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                    : item.highlight
                    ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-sky-200 dark:border-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-sky-50 dark:from-slate-950 dark:to-sky-950 border border-slate-200 dark:border-sky-500/20 text-center">
          <div className="text-[11px] font-bold text-sky-600 dark:text-sky-300 mb-1">Civic Impact Score</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{user.impactScore} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ 100</span></div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Top contributor in {user.city}</p>
        </div>
      </div>
    </aside>
  );
};
