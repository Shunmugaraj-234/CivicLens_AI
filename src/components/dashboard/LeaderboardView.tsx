import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BADGES_LIST, DEMO_USERS } from '../../data/seedData';
import { Trophy, Award, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const [tab, setTab] = useState<'city' | 'neighborhood'>('city');
  const [isPrivate, setIsPrivate] = useState<boolean>(user.isPrivateProfile || false);

  const leaderboardUsers = [...DEMO_USERS].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Community Recognition
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Civic Champions Leaderboard</h1>
          <p className="text-xs text-slate-300 mt-1">
            Recognizing citizens actively solving problems and verifying neighborhood safety.
          </p>
        </div>

        {/* Privacy Toggle */}
        <button
          onClick={() => setIsPrivate(!isPrivate)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
            isPrivate
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{isPrivate ? 'Profile Hidden on Leaderboard' : 'Public Leaderboard Profile'}</span>
        </button>
      </div>

      {/* USER BADGES COLLECTION */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Your Achievement Badges
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {BADGES_LIST.map(badge => {
            const isUnlocked = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl text-center space-y-1.5 border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-lg'
                    : 'bg-slate-950/40 border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div className="text-xs font-bold text-white">{badge.name}</div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('city')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                tab === 'city' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              City-wide ({user.city})
            </button>
            <button
              onClick={() => setTab('neighborhood')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                tab === 'neighborhood' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Neighborhood ({user.area})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {leaderboardUsers.map((u, rank) => (
            <div
              key={u.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                u.id === user.id ? 'bg-sky-500/10 font-bold' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                  rank === 0 ? 'bg-amber-400 text-slate-950' : rank === 1 ? 'bg-slate-300 text-slate-950' : rank === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  #{rank + 1}
                </span>

                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{u.name}</span>
                    {u.id === user.id && <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-white">YOU</span>}
                  </div>
                  <div className="text-xs text-slate-400">{u.levelTitle} • {u.area}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-amber-400">{u.points} XP</div>
                <div className="text-[10px] text-slate-500 font-semibold">Score: {u.impactScore}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
