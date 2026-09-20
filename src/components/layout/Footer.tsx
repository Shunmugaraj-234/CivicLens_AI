import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-10 px-4 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">CivicLens AI</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
            Tagline: <strong className="text-slate-800 dark:text-slate-200">"See the problem. Report it. Track the impact."</strong>
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Open innovation civic intelligence platform powered by AI, geolocation & duplicate detection.
          </p>
        </div>

        <div>
          <h5 className="text-slate-900 dark:text-white font-bold text-sm mb-3">Platform Navigation</h5>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate && onNavigate('landing')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home Landing</button></li>
            <li><button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Citizen Dashboard</button></li>
            <li><button onClick={() => onNavigate && onNavigate('report')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Report an Issue</button></li>
            <li><button onClick={() => onNavigate && onNavigate('map')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Interactive Civic Map</button></li>
            <li><button onClick={() => onNavigate && onNavigate('civic-pulse')} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">CivicPulse Digest</button></li>
          </ul>
        </div>

        <div>
          <h5 className="text-slate-900 dark:text-white font-bold text-sm mb-3">CivicLens Roles</h5>
          <ul className="space-y-2">
            <li><span className="text-slate-700 dark:text-slate-300">Citizen Portal</span></li>
            <li><span className="text-slate-700 dark:text-slate-300">Field Moderator Operations</span></li>
            <li><span className="text-slate-700 dark:text-slate-300">Municipal Admin Analytics</span></li>
            <li><span className="text-slate-700 dark:text-slate-300">Civic AI Chat Assistant</span></li>
          </ul>
        </div>

        {/* Security & Trust with Animated Social Media Icons */}
        <div className="space-y-3">
          <h5 className="text-slate-900 dark:text-white font-bold text-sm">Security & Trust</h5>
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-xs">Privacy-Preserving Reporter Anonymity</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            All user reports are protected under citizen privacy controls. AI output verified server-side.
          </p>

          {/* ANIMATED SOCIAL MEDIA LOGOS */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Connect & Follow Us</span>
            <div className="flex items-center gap-2.5">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md transform hover:scale-125 hover:-translate-y-1 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-800 text-white flex items-center justify-center shadow-md transform hover:scale-125 hover:-translate-y-1 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md transform hover:scale-125 hover:-translate-y-1 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                title="Twitter (X)"
                className="w-8 h-8 rounded-xl bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-md transform hover:scale-125 hover:-translate-y-1 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md transform hover:scale-125 hover:-translate-y-1 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          &copy; 2026 CivicLens AI. Built for Open Innovation Hackathon.
        </div>
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for Smarter & Safer Cities</span>
        </div>
      </div>
    </footer>
  );
};
