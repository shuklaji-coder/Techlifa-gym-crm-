import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Search,
  Bell,
  Sparkles,
  UserCheck,
  RotateCcw,
  Check,
  ExternalLink,
  ChevronDown,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenQuickCheckIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenQuickCheckIn }) => {
  const {
    userRole,
    setUserRole,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    resetAllDataToDemo,
    settings,
    updateSettings,
  } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const isLight = settings.theme === 'light';

  const toggleTheme = () => {
    updateSettings({ theme: isLight ? 'dark' : 'light' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels = {
    owner: { title: 'Vikram Rathore', roleTitle: 'Gym Owner (Director)', badge: 'Admin Master', color: 'text-[#C6FF00] bg-[#C6FF00]/10 border-[#C6FF00]/30' },
    trainer: { title: 'Coach Priya', roleTitle: 'Senior Coach / Trainer', badge: 'Trainer Access', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    front_desk: { title: 'Reception Desk', roleTitle: 'Front Desk Officer', badge: 'Reception Desk', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.08] px-4 lg:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Left: Quick search trigger & Demo Ribbon */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-850/90 border border-white/[0.08] text-slate-400 hover:text-white hover:border-[#C6FF00]/40 hover:shadow-[0_0_15px_rgba(198,255,0,0.1)] transition-all text-xs group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C6FF00] transition-colors" />
          <span className="hidden sm:inline">Search CRM (Members, Leads, Invoices)...</span>
          <span className="inline sm:hidden">Search...</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-dark-800 text-slate-400 border border-white/[0.08] rounded group-hover:text-[#C6FF00]">
            ⌘K
          </kbd>
        </button>

        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-dark-850/80 border border-white/[0.06] text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
          <span className="text-white font-medium">TECHLIFAA v2.4</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Enterprise Fitness OS</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Check-in Button */}
        <button
          onClick={onOpenQuickCheckIn}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-dark-850/90 border border-white/[0.08] text-xs font-semibold text-white hover:border-[#C6FF00]/50 hover:shadow-[0_0_15px_rgba(198,255,0,0.15)] transition-all"
          title="Instant QR Scan or Member Check-in"
        >
          <UserCheck className="w-4 h-4 text-[#C6FF00]" />
          <span className="hidden md:inline">Quick Check-in</span>
        </button>

        {/* AI Command Badge */}
        <Link
          to="/ai-intelligence"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6FF00]/10 border border-[#C6FF00]/30 text-xs font-bold text-[#C6FF00] hover:bg-[#C6FF00]/20 hover:shadow-[0_0_15px_rgba(198,255,0,0.2)] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Command</span>
        </Link>

        {/* 1-Click Theme Switcher (Luxe White vs Deep Obsidian) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850/90 border border-white/[0.08] text-xs font-semibold hover:border-[#C6FF00]/40 hover:shadow-[0_0_15px_rgba(198,255,0,0.15)] transition-all group"
          title={isLight ? 'Switch to Deep Obsidian Charcoal Theme' : 'Switch to Luxe Pearl Studio White Theme'}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline font-bold text-slate-800">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden md:inline font-bold text-slate-200">White Theme</span>
            </>
          )}
        </button>

        {/* Reset Demo Data button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all members, leads, payments, and schedules back to factory demo state?')) {
              resetAllDataToDemo();
            }
          }}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-dark-850/90 border border-white/[0.08] text-[11px] text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
          title="Reset Seed Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Demo</span>
        </button>

        {/* Notification Center Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl bg-dark-850/90 border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#C6FF00]/40 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C6FF00] text-black font-extrabold text-[10px] flex items-center justify-center animate-bounce shadow-[0_0_8px_#C6FF00]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel-elevated rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-3.5 border-b border-white/[0.08] bg-dark-900/80">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Alerts & Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#C6FF00]/20 text-[#C6FF00] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Dismiss all
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) {
                          navigate(n.link);
                          setShowNotifs(false);
                        }
                      }}
                      className={`p-3.5 text-xs hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        !n.read ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-semibold ${!n.read ? 'text-[#C6FF00]' : 'text-slate-300'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 leading-snug">{n.message}</p>
                      {n.actionLabel && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-[#C6FF00] font-medium">
                          <span>{n.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-white/[0.08] bg-dark-900/80 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifs(false)}
                  className="text-xs text-[#C6FF00] font-semibold hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-dark-850/90 border border-white/[0.08] hover:border-[#C6FF00]/40 hover:shadow-[0_0_15px_rgba(198,255,0,0.1)] transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C6FF00] to-emerald-500 flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(198,255,0,0.3)]">
              {userRole === 'owner' ? 'OW' : userRole === 'trainer' ? 'TR' : 'FD'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-white tracking-wide leading-none">
                {roleLabels[userRole].title}
              </p>
              <p className="text-[10px] text-[#C6FF00] font-medium mt-0.5 leading-none font-mono">
                {roleLabels[userRole].badge}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 glass-panel-elevated rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-white/[0.08] bg-dark-900/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Demo Role</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Test role-based permissions live</p>
              </div>

              <div className="p-1.5 space-y-1">
                {(['owner', 'trainer', 'front_desk'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setUserRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                      userRole === role
                        ? 'bg-[#C6FF00]/10 text-white font-semibold border border-[#C6FF00]/30'
                        : 'text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-white">{roleLabels[role].roleTitle}</p>
                      <span className={`inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border mt-1 ${roleLabels[role].color}`}>
                        {roleLabels[role].badge}
                      </span>
                    </div>
                    {userRole === role && <Check className="w-4 h-4 text-[#C6FF00]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
