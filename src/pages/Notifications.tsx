import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ExternalLink,
  Trash2,
  Check,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    addNotification,
    addToast,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const handleSimulateNewAlert = () => {
    addNotification({
      title: 'High Turnstile Rush Detected (7:15 PM)',
      message: 'Turnstile check-ins exceeded 35 members in the past 30 minutes. Floor trainer support recommended.',
      type: 'warning',
      link: '/attendance',
      actionLabel: 'View Floor Heatmap',
    });
    addToast('info', 'New Alert Triggered', 'Added to Notification Center.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Alerts & Notification Center
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational alerts, automated renewal triggers, turnstile surges, and payment confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateNewAlert}
            className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#C6FF00]" />
            <span>Simulate Incoming Alert</span>
          </button>

          <button
            onClick={clearAllNotifications}
            className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Dismiss All</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'unread', label: `Unread (${notifications.filter(n => !n.read).length})` },
          { id: 'warning', label: 'AI Churn & Capacity' },
          { id: 'payment', label: 'Payments' },
          { id: 'info', label: 'Leads & Classes' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors shrink-0 ${
              filterType === tab.id
                ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                : 'bg-dark-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center bg-dark-800/80 rounded-2xl border border-slate-750">
            <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No notifications in this category</h4>
            <p className="text-xs text-slate-400 mt-1">You are all caught up!</p>
          </div>
        ) : (
          filteredNotifs.map(n => {
            const icons = {
              warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
              payment: <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />,
              success: <CheckCircle2 className="w-5 h-5 text-[#C6FF00] shrink-0" />,
              info: <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />,
            };

            return (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !n.read
                    ? 'bg-dark-800 border-slate-600 shadow-md ring-1 ring-[#C6FF00]/20'
                    : 'bg-dark-850/80 border-slate-800 hover:bg-dark-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">{icons[n.type]}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${!n.read ? 'text-[#C6FF00]' : 'text-white'}`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#C6FF00] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">{n.message}</p>
                    {n.actionLabel && (
                      <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#C6FF00] hover:underline">
                        <span>{n.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">{n.timestamp}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
