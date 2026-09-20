import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Award, Activity, CheckCircle2, ShieldCheck, Flame, Star, Sparkles, Heart } from 'lucide-react';
import { BADGES_LIST } from '../../data/seedData';

export const PersonalImpactView: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const nextLevelXp = user.level * 100;
  const progressPercent = Math.min(100, Math.round((user.points % 100)));

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-2xl shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
              }}
            />
            <div className="space-y-1 text-center sm:text-left">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-md uppercase tracking-wider">
                {user.role} Impact Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">{user.name}'s Personal Impact</h1>
              <p className="text-xs text-sky-100 font-medium">
                📍 {user.area || 'Central Zone'}, {user.city || 'Metropolis'}
              </p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[180px]">
            <div className="text-xs text-sky-100 font-bold uppercase">Civic Impact Score</div>
            <div className="text-4xl font-black text-white my-1">{user.impactScore} <span className="text-sm font-normal text-sky-200">/ 100</span></div>
            <div className="text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Top 5% Citizen Contributor
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Points</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{user.points} XP</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Level {user.level} Progress</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Level Title</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white truncate">{user.levelTitle}</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">Tier {user.level} Rank</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Community Badges</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{user.badges?.length || 1} Badges</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Unlocked Achievements</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Civic Activity</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Active</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-bold">Verified Reporter</div>
        </div>
      </div>

      {/* Level Progress Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-900 dark:text-white">Level {user.level} Progress: {user.levelTitle}</span>
          <span className="text-sky-600 dark:text-sky-400">{progressPercent}% to Level {user.level + 1}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Unlocked Badges Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Civic Badges & Accomplishments
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES_LIST.map((b) => {
            const isUnlocked = user.badges?.includes(b.id) || b.id === 'civic_scout';
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-50 dark:bg-slate-800/80 border-amber-300 dark:border-amber-500/40 shadow-sm'
                    : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm">{b.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{b.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{b.description}</p>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">✓ Unlocked</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block mt-1">Locked</span>
                    )}
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
