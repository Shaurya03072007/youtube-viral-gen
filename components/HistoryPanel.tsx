import React, { useState, useEffect } from 'react';
import { PromptHistory, YouTubeMetadata } from '../types';
import { getPromptHistory, deletePromptHistory } from '../services/historyService';
import { useAuth } from '../contexts/AuthContext';

interface HistoryPanelProps {
  onSelectHistory: (history: PromptHistory) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ onSelectHistory, isOpen, onClose }: HistoryPanelProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    const { history: fetchedHistory, error: err } = await getPromptHistory(user.id);
    if (err) {
      setError(err);
    } else {
      setHistory(fetchedHistory);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this prompt? This cannot be undone.')) return;
    
    const { success, error: err } = await deletePromptHistory(id);
    if (success) {
      setHistory(history.filter(h => h.id !== id));
    } else {
      alert(err || 'Failed to delete');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10">
          <h2 className="text-xl md:text-2xl font-black text-white">Prompt History</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">No history yet</p>
              <p className="text-sm">Your prompts will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                  className="bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:border-red-600/30 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm md:text-base mb-2 line-clamp-2">
                        {item.prompt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                          {item.language}
                        </span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

