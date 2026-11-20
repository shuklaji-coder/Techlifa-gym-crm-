import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  QrCode,
  Sparkles,
  Menu,
} from 'lucide-react';

interface MobileNavProps {
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMenu }) => {
  const items = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/members', label: 'Members', icon: <Users className="w-5 h-5" /> },
    { path: '/leads', label: 'Leads', icon: <GitPullRequest className="w-5 h-5" /> },
    { path: '/attendance', label: 'Check-in', icon: <QrCode className="w-5 h-5" /> },
    { path: '/ai-intelligence', label: 'AI Core', icon: <Sparkles className="w-5 h-5 text-[#C6FF00]" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#C6FF00] font-bold' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium text-slate-400 hover:text-white"
      >
        <Menu className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
};
