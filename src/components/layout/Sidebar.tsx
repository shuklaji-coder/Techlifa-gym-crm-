import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  CreditCard,
  QrCode,
  Receipt,
  UserCheck2,
  CalendarDays,
  Dumbbell,
  UtensilsCrossed,
  Sparkles,
  TrendingUp,
  Zap,
  BarChart3,
  Bell,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { userRole, settings, members, leads } = useApp();
  const location = useLocation();

  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const hotLeadsCount = leads.filter(l => l.scoreLabel === 'Hot').length;

  const navSections: NavSection[] = [
    {
      group: 'Core Operations',
      items: [
        { path: '/', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { path: '/members', label: 'Members CRM', icon: <Users className="w-4 h-4" />, badge: activeMembersCount },
        { path: '/leads', label: 'Leads & Pipeline', icon: <GitPullRequest className="w-4 h-4" />, badge: hotLeadsCount, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
        { path: '/plans', label: 'Membership Plans', icon: <CreditCard className="w-4 h-4" /> },
        { path: '/attendance', label: 'Live Attendance', icon: <QrCode className="w-4 h-4" /> },
        { path: '/payments', label: 'Payments & GST', icon: <Receipt className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Fitness & Coaching',
      items: [
        { path: '/trainers', label: 'Trainers Staff', icon: <UserCheck2 className="w-4 h-4" /> },
        { path: '/classes', label: 'Classes & Schedule', icon: <CalendarDays className="w-4 h-4" /> },
        { path: '/workouts', label: 'Workout Protocols', icon: <Dumbbell className="w-4 h-4" /> },
        { path: '/diets', label: 'Indian Diet Plans', icon: <UtensilsCrossed className="w-4 h-4" /> },
      ],
    },
    {
      group: 'AI Neural Core',
      items: [
        { path: '/ai-intelligence', label: 'AI Intelligence Center', icon: <Sparkles className="w-4 h-4 text-[#C6FF00]" />, highlight: true },
        { path: '/ai-advisor', label: 'AI Business Advisor', icon: <TrendingUp className="w-4 h-4 text-[#C6FF00]" />, highlight: true },
        { path: '/automations', label: 'Smart Automations', icon: <Zap className="w-4 h-4 text-amber-400" /> },
      ],
    },
    {
      group: 'Enterprise Tools',
      items: [
        { path: '/reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { path: '/notifications', label: 'Alerts & Messages', icon: <Bell className="w-4 h-4" /> },
        { path: '/settings', label: 'Gym Settings', icon: <Settings className="w-4 h-4" /> },
        { path: '/ai-settings', label: 'AI Model Settings', icon: <Bot className="w-4 h-4" /> },
        { path: '/login', label: 'Role Switch / Demo', icon: <ShieldAlert className="w-4 h-4 text-slate-500" /> },
      ],
    },
  ];

  return (
    <aside
      className={`relative z-40 flex flex-col h-screen bg-dark-950/95 backdrop-blur-2xl border-r border-white/[0.07] transition-all duration-300 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08] bg-dark-900/40">
        {!collapsed && (
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C6FF00] via-[#A3E635] to-emerald-500 flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(198,255,0,0.35)] group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider font-display leading-tight flex items-center gap-1.5">
                {settings.gymName || 'TECHLIFAA GYM'}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C6FF00]/15 text-[#C6FF00] font-mono border border-[#C6FF00]/30 shadow-[0_0_8px_rgba(198,255,0,0.2)]">
                  AI
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-tight leading-none mt-0.5">Enterprise Fitness OS</p>
            </div>
          </NavLink>
        )}

        {collapsed && (
          <NavLink to="/" className="mx-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C6FF00] via-[#A3E635] to-emerald-500 flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(198,255,0,0.35)]">
              ⚡
            </div>
          </NavLink>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                {section.group}
              </p>
            )}

            {section.items.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-semibold shadow-inner border border-white/[0.1] backdrop-blur-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
                  } ${item.highlight && !isActive ? 'hover:border-[#C6FF00]/30 hover:text-[#C6FF00]' : ''}`}
                >
                  {/* Active glowing indicator pill */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#C6FF00] shadow-[0_0_10px_#C6FF00]" />
                  )}

                  <span
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-[#C6FF00]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="truncate flex-1 tracking-wide">{item.label}</span>
                  )}

                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-white/[0.06] text-slate-300 border border-white/[0.06]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Collapsed Toggle & Role Preview */}
      <div className="p-3 border-t border-white/[0.08] bg-dark-900/40">
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-dark-850/80 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-ping" />
              <div>
                <p className="text-[11px] font-bold text-white tracking-tight">AI Neural Engine Active</p>
                <p className="text-[10px] text-slate-400">100% Deterministic SaaS</p>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#C6FF00]" />
          </div>
        )}
      </div>
    </aside>
  );
};
