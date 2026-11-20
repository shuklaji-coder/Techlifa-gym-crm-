import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  Search,
  User,
  GitPullRequest,
  Dumbbell,
  Receipt,
  Sparkles,
  ArrowRight,
  Zap,
  QrCode,
  X,
} from 'lucide-react';
import { formatINR } from '../../lib/utils';

interface GlobalCommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickCheckIn: () => void;
}

export const GlobalCommandSearch: React.FC<GlobalCommandSearchProps> = ({
  isOpen,
  onClose,
  onOpenQuickCheckIn,
}) => {
  const { members, leads, trainers, plans } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Quick navigation pages
  const quickPages = [
    { name: 'Executive Dashboard', path: '/', category: 'Pages' },
    { name: 'Members Management CRM', path: '/members', category: 'Pages' },
    { name: 'Leads & Sales Pipeline (Kanban)', path: '/leads', category: 'Pages' },
    { name: 'Membership Plans & Pricing', path: '/plans', category: 'Pages' },
    { name: 'Live Attendance & Heatmap', path: '/attendance', category: 'Pages' },
    { name: 'Payments & GST Invoices', path: '/payments', category: 'Pages' },
    { name: 'AI Intelligence Center', path: '/ai-intelligence', category: 'AI Tools' },
    { name: 'AI Business Advisor & Reports', path: '/ai-advisor', category: 'AI Tools' },
    { name: 'Workouts Protocols', path: '/workouts', category: 'Fitness' },
    { name: 'Indian Diet Plans', path: '/diets', category: 'Fitness' },
    { name: 'Smart Automations', path: '/automations', category: 'Tools' },
  ];

  const filteredPages = q
    ? quickPages.filter(p => p.name.toLowerCase().includes(q))
    : quickPages.slice(0, 4);

  const matchedMembers = q
    ? members
        .filter(
          m =>
            m.fullName.toLowerCase().includes(q) ||
            m.phone.includes(q) ||
            m.id.toLowerCase().includes(q) ||
            m.fitnessGoal.toLowerCase().includes(q)
        )
        .slice(0, 5)
    : [];

  const matchedLeads = q
    ? leads
        .filter(
          l =>
            l.fullName.toLowerCase().includes(q) ||
            l.phone.includes(q) ||
            l.source.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-dark-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-700/60 bg-dark-850">
          <Search className="w-5 h-5 text-[#C6FF00]" />
          <input
            type="text"
            placeholder="Type a member name, lead, phone, plan, or command..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-dark-750 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar text-xs">
          {/* Quick Actions */}
          {!q && (
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect(onOpenQuickCheckIn)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-750 hover:bg-dark-700 border border-slate-700/60 text-slate-200 transition-colors text-left"
                >
                  <QrCode className="w-4 h-4 text-[#C6FF00]" />
                  <div>
                    <p className="font-semibold text-white">Quick Check-in</p>
                    <p className="text-[10px] text-slate-400">Scan QR or enter Member ID</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSelect(() => navigate('/ai-intelligence'))}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-750 hover:bg-dark-700 border border-slate-700/60 text-slate-200 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-[#C6FF00]" />
                  <div>
                    <p className="font-semibold text-white">AI Churn Prediction</p>
                    <p className="text-[10px] text-slate-400">Scan members at risk</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Matched Members */}
          {matchedMembers.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Members ({matchedMembers.length})
              </p>
              <div className="space-y-1">
                {matchedMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(() => navigate(`/members/${m.id}`))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-slate-700/40 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-slate-600"
                      />
                      <div>
                        <p className="font-semibold text-white group-hover:text-[#C6FF00] transition-colors">
                          {m.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {m.id} • {m.phone} • {m.fitnessGoal}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          m.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : m.status === 'expiring'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Leads Pipeline ({matchedLeads.length})
              </p>
              <div className="space-y-1">
                {matchedLeads.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect(() => navigate('/leads'))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-slate-700/40 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GitPullRequest className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="font-semibold text-white group-hover:text-[#C6FF00] transition-colors">
                          {l.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {l.source} • {l.phone} • Goal: {l.fitnessGoal}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-slate-700">
                      Score: {l.score} ({l.scoreLabel})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen Navigation */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Navigation & Modules
              </p>
              <div className="space-y-1">
                {filteredPages.map(page => (
                  <button
                    key={page.path}
                    onClick={() => handleSelect(() => navigate(page.path))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-slate-700/40 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ArrowRight className="w-3.5 h-3.5 text-[#C6FF00] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-medium text-slate-200 group-hover:text-white">
                        {page.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{page.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedMembers.length === 0 && matchedLeads.length === 0 && filteredPages.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No matching members, leads, or screens found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-slate-700/60 bg-dark-850 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <span>Tip: Press <strong>⌘K</strong> anywhere to summon command palette</span>
          <span>TECHLIFAA GYM AI</span>
        </div>
      </div>
    </div>
  );
};
