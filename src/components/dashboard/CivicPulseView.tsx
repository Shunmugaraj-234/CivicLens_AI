import React from 'react';
import { CIVIC_PULSE_DATA } from '../../data/seedData';
import { Flame, Sparkles, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, MapPin, Activity } from 'lucide-react';

export const CivicPulseView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-sky-950/60 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 animate-bounce" /> Signature Intelligence Digest
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">CivicPulse — City Daily Summary</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time municipal situation report generated continuously from citizen reports and resolution velocity.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" /> Live Pulse {CIVIC_PULSE_DATA.date}
        </div>
      </div>

      {/* Daily Metrics Digest */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">New Reports (24h)</span>
          <div className="text-3xl font-black text-white">{CIVIC_PULSE_DATA.newIssues24h}</div>
          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Road issues {CIVIC_PULSE_DATA.roadIssueTrend}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Resolved (24h)</span>
          <div className="text-3xl font-black text-emerald-400">{CIVIC_PULSE_DATA.resolved24h}</div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3" /> Garbage reports {CIVIC_PULSE_DATA.garbageIssueTrend}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Critical Hazards</span>
          <div className="text-3xl font-black text-red-400">{CIVIC_PULSE_DATA.criticalCount}</div>
          <span className="text-[10px] text-red-400 font-bold">Requires immediate action</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Avg Resolution Time</span>
          <div className="text-3xl font-black text-sky-400">{CIVIC_PULSE_DATA.avgResolutionTimeHours}h</div>
          <span className="text-[10px] text-slate-400">PWD field dispatch</span>
        </div>
      </div>

      {/* Daily AI Intelligence Briefing */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" /> Executive AI Intelligence Summary
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono">
          "{CIVIC_PULSE_DATA.aiSummary}"
        </p>
      </div>

      {/* PREDICTIVE ISSUE HOTSPOTS */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Predictive Hotspots & AI Risk Forecast
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CIVIC_PULSE_DATA.predictiveHotspots.map((h, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" /> {h.area}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {h.probability} Probability
                </span>
              </div>
              <div className="text-sm font-bold text-sky-400">{h.riskType} Risk</div>
              <p className="text-xs text-slate-400 leading-relaxed">{h.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
