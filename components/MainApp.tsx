import React, { useState, useEffect } from 'react';
import { generateYouTubeMetadata } from '../services/geminiService';
import { savePromptHistory } from '../services/historyService';
import { YouTubeMetadata, AppStatus, PromptHistory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import HistoryPanel from './HistoryPanel';
import AdminPage from './AdminPage';

const ViralBadge: React.FC<{ children: React.ReactNode; color?: 'red' | 'emerald' | 'blue' }> = ({ children, color = "red" }) => {
  const colorMap = {
    red: 'bg-red-600/10 border-red-600/20 text-red-500',
    emerald: 'bg-emerald-600/10 border-emerald-600/20 text-emerald-500',
    blue: 'bg-blue-600/10 border-blue-600/20 text-blue-500'
  };
  const dotMap = {
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className={`inline-flex items-center gap-2 border ${colorMap[color]} px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest`}>
      <span className={`w-1 h-1 md:w-1.5 md:h-1.5 ${dotMap[color]} rounded-full animate-pulse`}></span>
      {children}
    </div>
  );
};

const CopyBtn: React.FC<{ text: string; size?: 'sm' | 'md'; label?: string }> = ({ text, size = 'md', label = 'COPY' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`transition-all flex items-center justify-center gap-2 font-bold rounded-xl whitespace-nowrap ${
        size === 'sm' ? 'px-3 py-1.5 text-[10px]' : 'px-3 md:px-4 py-2 text-xs'
      } ${
        copied 
          ? 'bg-emerald-500 text-white' 
          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
      }`}
    >
      {copied ? '✓ COPIED' : label}
    </button>
  );
};
const username = ["shaurya"];
const password = ["Jddreddy9**"];
const languages = [
  "Telugu", "Hindi", "English", "Tamil", "Kannada", "Malayalam", 
  "Bengali", "Marathi", "Punjabi", "Spanish", "Portuguese", 
  "German", "Japanese", "Mix (Hinglish)", "Mix (Tenglish)"
];

export default function MainApp() {
  const { user, logout } = useAuth();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('Telugu');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<YouTubeMetadata | null>(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Show admin page if user is admin
  if (user?.is_admin) {
    return <AdminPage />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setStatus(AppStatus.LOADING);
    setError('');
    try {
      const data = await generateYouTubeMetadata(input, language);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
      
      // Save to history
      if (user) {
        await savePromptHistory(user.id, input, language, data);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'DAILY_LIMIT_REACHED') {
        setError('DAILY_LIMIT_REACHED');
      } else {
        setError(err.message || 'Failed to generate metadata. Please try again.');
      }
      setStatus(AppStatus.ERROR);
    }
  };

  const handleSelectHistory = (history: PromptHistory) => {
    setInput(history.prompt);
    setLanguage(history.language);
    setResult(history.metadata);
    setStatus(AppStatus.SUCCESS);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-red-600/40">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Top Bar - Mobile First */}
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all"
            >
              📜 History
            </button>
            <span className="text-xs md:text-sm text-slate-400 hidden sm:inline">
              {user?.username}
            </span>
          </div>
          <button
            onClick={logout}
            className="bg-slate-800 hover:bg-slate-700 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all"
          >
            Logout
          </button>
        </div>

        {/* Header - Mobile Optimized */}
        <header className="text-center mb-6 md:mb-12 space-y-3 md:space-y-4">
          <ViralBadge color="red">Algorithm Mastery v6.0</ViralBadge>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter">
            BEAST<span className="text-red-600">FLOW</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-base font-medium max-w-xl mx-auto leading-relaxed px-2">
            Transform ideas into viral assets. Neat titles, SEO tags, and mixed-language logic.
          </p>
        </header>

        {/* Search Console - Mobile First */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl md:rounded-3xl p-2 md:p-3 mb-6 md:mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="YOUR VIDEO IDEA..."
              className="w-full bg-transparent px-4 md:px-6 py-3 md:py-4 text-base md:text-2xl font-black uppercase tracking-tight outline-none placeholder:text-slate-800 text-white"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 font-bold text-slate-300 outline-none hover:bg-white/10 transition-all cursor-pointer appearance-none text-xs md:text-sm"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
                ))}
              </select>
              <button
                disabled={status === AppStatus.LOADING || !input.trim()}
                className="w-full sm:flex-1 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {status === AppStatus.LOADING ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : 'LAUNCH METADATA'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`px-4 py-4 md:py-6 rounded-xl mb-6 ${
            error === 'DAILY_LIMIT_REACHED' 
              ? 'bg-yellow-600/20 border-2 border-yellow-600/40' 
              : 'bg-red-600/10 border border-red-600/20'
          }`}>
            {error === 'DAILY_LIMIT_REACHED' ? (
              <div className="text-center space-y-3">
                <div className="text-2xl md:text-4xl font-black text-yellow-400 mb-2">
                  🚫 We're Done for Today
                </div>
                <p className="text-yellow-300 text-sm md:text-base font-bold">
                  All API keys have reached their daily limit (19 uses each).
                </p>
                <p className="text-yellow-400/80 text-xs md:text-sm">
                  Please come back tomorrow for more generations!
                </p>
              </div>
            ) : (
              <div className="text-red-400 text-sm">{error}</div>
            )}
          </div>
        )}

        {/* Results - Mobile Optimized */}
        {result && status === AppStatus.SUCCESS && (
          <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Titles Section */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">High CTR Titles</h2>
                <div className="hidden sm:block h-px flex-1 bg-white/10"></div>
                <ViralBadge color="emerald">Algorithm Ready</ViralBadge>
              </div>
              <div className="grid gap-2 md:gap-3">
                {result.titles.map((title, i) => (
                  <div key={i} className="bg-slate-900/60 border border-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:border-red-600/30 transition-all">
                    <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                      <span className="text-xl md:text-3xl font-black text-slate-800 group-hover:text-red-600/20 shrink-0">0{i+1}</span>
                      <h3 className="text-sm md:text-xl font-bold uppercase tracking-tight leading-tight break-words">{title}</h3>
                    </div>
                    <CopyBtn text={title} />
                  </div>
                ))}
              </div>
            </section>

            {/* Video Tags Section */}
            <section className="bg-red-600/5 border border-red-600/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase">Video Tags</h2>
                  <p className="text-xs text-red-500/60 font-bold tracking-widest uppercase mt-1">Copy these into YouTube Studio Tags field</p>
                </div>
                <CopyBtn text={result.tags.join(', ')} label="COPY ALL TAGS" />
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, i) => (
                  <span key={i} className="bg-red-600/10 border border-red-600/20 text-red-400 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Main Content Grid - Mobile Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              {/* Description */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <section className="bg-slate-900/60 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase">SEO Description</h2>
                    <CopyBtn
                      text={`${result.description}\n\n${result.suggestedHashtags.join(" ")}`}
                      size="sm"
                      label="COPY DESC"
                    /></div>
                  <div className="bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap font-sans text-slate-400 text-xs md:text-sm leading-relaxed">
                      {result.description}
                    </pre>
                  </div>
                </section>
                
                {/* Retention Hooks */}
                <section className="bg-blue-600/5 border border-blue-600/10 rounded-2xl p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-black mb-4 uppercase tracking-widest text-blue-400">Retention Hooks (First 30s)</h2>
                  <div className="space-y-3">
                    {result.hookIdeas.map((hook, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">{i+1}</div>
                        <p className="text-slate-300 text-xs md:text-sm italic">"{hook}"</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Info - Mobile Stack */}
              <div className="space-y-4 md:space-y-6">
                {/* Thumbnail */}
                <section className="bg-slate-900/80 border border-white/5 rounded-2xl p-4 md:p-6">
                  <h2 className="text-sm md:text-base font-black mb-3 uppercase tracking-widest text-red-500">Thumbnail Strategy</h2>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4 font-medium">
                    {result.thumbnailConcept}
                  </p>
                  <ViralBadge color="blue">Psychology Built-in</ViralBadge>
                </section>

                {/* Hashtags */}
                <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hashtags (100)</h2>
                    <CopyBtn text={result.suggestedHashtags.join(' ')} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-[200px] md:max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.suggestedHashtags.map((h, i) => (
                      <span key={i} className="text-[9px] md:text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors cursor-default">
                        {h.startsWith('#') ? h : `#${h}`}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Pinned Comment */}
                <section className="bg-emerald-600/5 border border-emerald-600/10 rounded-2xl p-4 md:p-6">
                  <h2 className="text-xs font-black mb-3 uppercase tracking-widest text-emerald-500">Community Spark</h2>
                  <p className="text-slate-200 font-bold mb-4 text-xs md:text-sm">"{result.pinnedComment}"</p>
                  <CopyBtn text={result.pinnedComment} size="sm" label="COPY COMMENT" />
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {status === AppStatus.IDLE && (
          <div className="py-12 md:py-20 flex flex-col items-center justify-center space-y-4 md:space-y-6 opacity-20">
            <div className="w-16 h-16 md:w-24 md:h-24 border-2 md:border-4 border-white/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-xs md:text-base font-black tracking-[0.3em] uppercase">Ready for Ignition</p>
          </div>
        )}
      </div>

      {/* History Panel */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectHistory={handleSelectHistory}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,0,0,0.2); }
      `}</style>
    </div>
  );
}

