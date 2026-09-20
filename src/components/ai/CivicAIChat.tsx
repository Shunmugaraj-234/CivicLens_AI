import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CivicReport } from '../../types';
import { chatWithCivicAI } from '../../services/aiService';
import { Bot, Send, Sparkles, User, ArrowRight, ShieldCheck, MapPin, ThumbsUp } from 'lucide-react';

interface CivicAIChatProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actionCard?: {
    title: string;
    type: 'reports_list' | 'stats' | 'priority';
    reportIds?: string[];
  };
}

export const CivicAIChat: React.FC<CivicAIChatProps> = ({ reports, onSelectReport }) => {
  const { user } = useAuth();
  if (!user) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user.name}! I am CivicLens AI, your intelligent municipal data assistant. I continuously track priorities, potholes, water leaks, and community health scores in ${user.city}. How can I assist you today?`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const sampleQuestions = [
    'How many potholes are near me?',
    'Show critical issues in my city',
    'What is my civic impact score?',
    'Which issues were resolved this week?',
    'Show unresolved water leakage issues',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: prompt,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsThinking(true);

    try {
      const res = await chatWithCivicAI(prompt, reports);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.replyText,
        actionCard: res.actionCard,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col h-[680px] overflow-hidden">
      {/* AI Assistant Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              CivicLens AI Assistant <Sparkles className="w-4 h-4 text-sky-400" />
            </h2>
            <span className="text-[11px] text-emerald-400 font-semibold">● Connected to Municipal Database</span>
          </div>
        </div>

        <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          NLP Smart Query
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-2xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-sky-400 border border-slate-700'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-sky-500 text-white font-medium shadow-md shadow-sky-500/20'
                    : 'bg-slate-950 text-slate-200 border border-slate-800'
                }`}
              >
                {m.text}
              </div>

              {/* Action Card Renderer */}
              {m.actionCard && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/40 space-y-2 text-xs">
                  <div className="font-bold text-sky-300 flex items-center justify-between">
                    <span>{m.actionCard.title}</span>
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  </div>

                  {m.actionCard.reportIds && (
                    <div className="space-y-2 pt-1">
                      {reports
                        .filter(r => m.actionCard?.reportIds?.includes(r.id))
                        .slice(0, 3)
                        .map(r => (
                          <div
                            key={r.id}
                            onClick={() => onSelectReport(r)}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <div className="font-bold text-white line-clamp-1">{r.title}</div>
                              <div className="text-[10px] text-slate-400">📍 {r.location.address}</div>
                            </div>
                            <span className="text-[10px] font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10">
                              View →
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-sky-400 bg-slate-950 p-3 rounded-2xl w-fit border border-slate-800">
            <Bot className="w-4 h-4 animate-spin" />
            <span>CivicLens AI is searching city database...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-bold shrink-0">Ask:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask CivicLens AI about potholes, water leaks, impact score..."
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <span>Ask</span> <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
