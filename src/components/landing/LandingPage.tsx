import React from 'react';
import { Camera, MapPin, Sparkles, Shield, CheckCircle2, Flame, Users, Activity, ArrowRight, Zap, AlertTriangle, Layers } from 'lucide-react';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onReportClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onReportClick }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wide animate-pulse">
                <Sparkles className="w-4 h-4" /> AI-POWERED CIVIC INTELLIGENCE PLATFORM
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                CivicLens AI
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                "See the problem. Report it. Track the impact."
              </p>

              <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transforming everyday citizen observations into structured, transparent, and actionable civic intelligence using multimodal AI, geolocation, duplicate detection, and dynamic priority scoring.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onReportClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-base shadow-xl shadow-sky-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Report an Issue</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>

                <button
                  onClick={() => onNavigate('map')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base border border-slate-300 dark:border-slate-700/80 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span>Explore Civic Map</span>
                </button>
              </div>

              {/* Key Highlights row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">94.2%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">AI Detection Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">31 hrs</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Avg Resolution Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">1,480+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Issues Resolved</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Map Visual Simulation */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 shadow-2xl p-2 group">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                  alt="Interactive City Map Preview"
                  className="w-full h-[420px] object-cover rounded-2xl opacity-80 dark:opacity-75 group-hover:opacity-90 transition-opacity"
                />

                {/* Floating Animated Cards */}
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-500/40 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">AI Detection</div>
                    <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold">Pothole Surface Crater</div>
                  </div>
                </div>

                <div className="absolute top-28 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-red-500/40 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Severity Level</div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-bold">HIGH (Priority Score 91/100)</div>
                  </div>
                </div>

                <div className="absolute bottom-20 left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Community Support</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">17 Verified Supporters</div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-500/40 p-2.5 rounded-xl text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Resolution: IN PROGRESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-widest">End-to-End Civic Flow</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">How CivicLens AI Operates</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
              From photo capture to municipal verification and evidence-backed resolution in 4 smart steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Capture & Geotag',
                desc: 'Citizen captures photo/video of problem. GPS coordinates automatically attached.',
                icon: Camera,
                color: 'from-sky-500 to-blue-600',
              },
              {
                step: '02',
                title: 'Multimodal AI Analysis',
                desc: 'Gemini AI detects issue type, calculates severity, risk score, and generates formal complaint.',
                icon: Sparkles,
                color: 'from-indigo-500 to-purple-600',
              },
              {
                step: '03',
                title: 'Duplicate & Priority Match',
                desc: 'System searches nearby reports within 200m. Calculates dynamic Priority Score (0-100).',
                icon: Layers,
                color: 'from-amber-500 to-orange-600',
              },
              {
                step: '04',
                title: 'Field Resolution',
                desc: 'Field officers fix the issue, upload before/after evidence, and update citizen timeline.',
                icon: CheckCircle2,
                color: 'from-emerald-500 to-teal-600',
              },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.step} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all relative group shadow-sm">
                  <div className="text-4xl font-black text-slate-300 dark:text-slate-800 group-hover:text-slate-400 dark:group-hover:text-slate-700 transition-colors absolute top-4 right-4">
                    {card.step}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER EVIDENCE DEMO */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">Transparent Resolution Evidence</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Before & After Resolution Verification</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              When field officers complete a repair, they submit high-resolution before and after comparison photos. Citizens can verify the quality of work directly on the interactive slider.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Verified Inspection Log</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Sanitation & PWD repair teams log exact completion timestamp and team ID.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Flame className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Civic Health Score Update</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Resolving issues boosts local neighborhood score and awards citizen points.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
              beforeLabel="BEFORE: Overflowing Waste Hazard"
              afterLabel="AFTER: Cleared & Sanitized Zone"
            />
            <p className="text-center text-xs text-slate-500 mt-2">
              Drag the center slider left or right to inspect before/after municipal work quality.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-sky-500/10 via-slate-100 to-indigo-500/10 dark:from-sky-900/60 dark:via-slate-900 dark:to-indigo-950/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready to make your city cleaner and safer?
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base max-w-2xl mx-auto">
            Join thousands of active citizens, field officers, and city planners using CivicLens AI to track, prioritize, and solve real-world problems.
          </p>
          <div className="pt-2">
            <button
              onClick={onReportClick}
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-lg shadow-2xl shadow-sky-500/40 transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <Camera className="w-6 h-6" />
              <span>Report First Issue Now</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
