import React, { useState } from 'react';
import { CivicReport } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getPriorityLabel } from '../../services/priorityEngine';
import { addVerificationVote, toggleSupportReport, updateReportStatus } from '../../services/dbService';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import {
  MapPin,
  Clock,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  User,
  Send,
  ArrowLeft,
  XCircle,
  Share2
} from 'lucide-react';

interface IssueDetailsViewProps {
  report: CivicReport;
  onBack: () => void;
  onUpdate: (updated: CivicReport) => void;
}

export const IssueDetailsView: React.FC<IssueDetailsViewProps> = ({ report: initialReport, onBack, onUpdate }) => {
  const { user } = useAuth();
  if (!user) return null;

  const [report, setReport] = useState<CivicReport>(initialReport);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState([
    {
      id: 'c1',
      userName: 'Sarah Jenkins',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      userRole: 'citizen',
      text: 'I passed by this morning. Water is still leaking out. Please fix soon!',
      createdAt: '2026-09-18T11:00:00Z',
    },
    {
      id: 'c2',
      userName: 'Officer Priya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      userRole: 'moderator',
      text: 'Field team #4 dispatched to inspect water valve pressure.',
      createdAt: '2026-09-18T14:30:00Z',
    },
  ]);

  const { label: priorityLabel, badgeBg: priorityBadgeBg } = getPriorityLabel(report.priorityScore);
  const hasSupported = report.supportersUserIds.includes(user.id);

  // Handle Upvote
  const handleToggleSupport = () => {
    const updated = toggleSupportReport(report.id, user.id);
    if (updated) {
      setReport(updated);
      onUpdate(updated);
    }
  };

  // Handle Community Verification Vote
  const handleVoteVerification = (type: 'STILL_EXISTS' | 'RESOLVED' | 'NOT_ACCURATE') => {
    const updated = addVerificationVote(report.id, user, type);
    if (updated) {
      setReport(updated);
      onUpdate(updated);
    }
  };

  // Handle Adding Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newC = {
      id: `c-${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newC]);
    setCommentText('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Main Issue Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-400 border border-sky-400/30 uppercase">
              {report.category.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${priorityBadgeBg}`}>
              PRIORITY {report.priorityScore} / 100 ({priorityLabel})
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Reported {new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">{report.title}</h1>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>{report.location.address} ({report.location.area})</span>
        </p>

        {/* Status Stepper Progress */}
        <div className="pt-4 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Resolution Workflow Timeline</span>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
            {[
              { status: 'REPORTED', label: 'Reported' },
              { status: 'VERIFIED', label: 'Verified' },
              { status: 'ASSIGNED', label: 'Assigned' },
              { status: 'IN_PROGRESS', label: 'In Progress' },
              { status: 'RESOLVED', label: 'Resolved' },
            ].map((step, i) => {
              const isDone = report.status === step.status || i < ['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].indexOf(report.status);
              const isCurrent = report.status === step.status;
              return (
                <div key={step.status} className="space-y-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isDone ? 'bg-emerald-500' : isCurrent ? 'bg-sky-400 animate-pulse' : 'bg-slate-800'
                    }`}
                  />
                  <span className={isDone || isCurrent ? 'text-white font-bold' : 'text-slate-500'}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER EVIDENCE OR HIGH-RES PHOTO */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Visual Evidence & On-Site Media</h3>

        {report.status === 'RESOLVED' && report.resolutionEvidence ? (
          <BeforeAfterSlider
            beforeImage={report.resolutionEvidence.beforeImageUrl}
            afterImage={report.resolutionEvidence.afterImageUrl}
            beforeLabel="BEFORE: Reported Hazard"
            afterLabel={`AFTER: ${report.resolutionEvidence.resolutionType}`}
          />
        ) : (
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-96 object-cover rounded-2xl border border-slate-800 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80';
            }}
          />
        )}

        {/* Priority Score Explanation */}
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3 text-xs text-sky-200">
          <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-0.5">Priority Engine Score Context</div>
            <p className="leading-relaxed text-slate-300">
              Score of <strong>{report.priorityScore}/100</strong> calculated based on {report.severity} severity, {report.supportersCount} community upvotes, {report.verificationsCount} on-site verifications, and proximity to sensitive area.
            </p>
          </div>
        </div>
      </div>

      {/* COMMUNITY VERIFICATION & UPVOTE ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Community Verification Widget */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Community Verification
          </h3>
          <p className="text-xs text-slate-400">
            Have you passed by this location recently? Help verify whether the issue persists.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleVoteVerification('STILL_EXISTS')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Still Exists
            </button>
            <button
              onClick={() => handleVoteVerification('RESOLVED')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Fixed
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400 flex justify-between items-center">
            <span>Verifications Confidence</span>
            <span className="font-bold text-emerald-400">96% Confirmed ({report.verificationsCount} votes)</span>
          </div>
        </div>

        {/* Right Upvote & Support Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-sky-400" /> Citizen Support
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supporting an issue increases its priority score for faster municipal repair response.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleSupport}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                hasSupported
                  ? 'bg-sky-500 text-white shadow-sky-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasSupported ? 'fill-white' : ''}`} />
              <span>{hasSupported ? 'Supported' : 'Support Issue'}</span>
            </button>

            <div className="text-center px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="text-lg font-black text-white">{report.supportersCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Supporters</div>
            </div>
          </div>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sky-400" /> Community Discussion ({comments.length})
        </h3>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment or update on this issue..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20"
          >
            <Send className="w-3.5 h-3.5" /> Post
          </button>
        </form>

        <div className="space-y-3 pt-2">
          {comments.map(c => (
            <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-bold text-white">{c.userName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold uppercase">
                    {c.userRole}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-slate-300 pl-8">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
