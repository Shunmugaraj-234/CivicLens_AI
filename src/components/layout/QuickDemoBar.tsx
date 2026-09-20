import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, ShieldAlert, Settings, Sparkles } from 'lucide-react';

export const QuickDemoBar: React.FC = () => {
  const { user, switchRole } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white border-b border-sky-500/20 py-1.5 px-4 text-xs font-medium flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 animate-pulse">
          <Sparkles className="w-3 h-3 mr-1" /> HACKATHON DEMO MODE
        </span>
        <span className="hidden sm:inline text-slate-300">
          Active Profile: <strong className="text-white">{user.name}</strong> ({user.role.toUpperCase()})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 hidden md:inline">Switch Role:</span>
        <button
          onClick={() => switchRole('citizen')}
          className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
            user.role === 'citizen'
              ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <UserCheck className="w-3 h-3" /> Citizen
        </button>
        <button
          onClick={() => switchRole('moderator')}
          className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
            user.role === 'moderator'
              ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShieldAlert className="w-3 h-3" /> Field Moderator
        </button>
        <button
          onClick={() => switchRole('admin')}
          className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
            user.role === 'admin'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Settings className="w-3 h-3" /> Administrator
        </button>
      </div>
    </div>
  );
};
