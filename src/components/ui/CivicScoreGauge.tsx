import React from 'react';

interface CivicScoreGaugeProps {
  score: number; // 0 - 100
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CivicScoreGauge: React.FC<CivicScoreGaugeProps> = ({
  score,
  title = 'Civic Impact Score',
  subtitle = "You're helping make your neighborhood better.",
  size = 'md',
}) => {
  const radius = size === 'sm' ? 36 : size === 'lg' ? 60 : 48;
  const stroke = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let bgGradient = 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10';
  if (score < 50) {
    colorClass = 'text-amber-500';
    bgGradient = 'from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/10';
  } else if (score >= 80) {
    colorClass = 'text-sky-500 dark:text-sky-400';
    bgGradient = 'from-sky-500/10 to-blue-600/5 dark:from-sky-500/20 dark:to-blue-600/10';
  }

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${bgGradient} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 backdrop-blur-md flex items-center gap-5 shadow-lg`}>
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-200 dark:text-slate-800"
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight ${colorClass} ${size === 'lg' ? 'text-3xl' : 'text-2xl'}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          {title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{subtitle}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClass.replace('text-', 'bg-')} transition-all duration-1000`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">Top 5% Citizen</span>
        </div>
      </div>
    </div>
  );
};
