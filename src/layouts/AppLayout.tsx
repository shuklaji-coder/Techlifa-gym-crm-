import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { GlobalCommandSearch } from '../components/layout/GlobalCommandSearch';
import { FloatingAIAssistant } from '../components/layout/FloatingAIAssistant';
import { ToastContainer } from '../components/ui/ToastContainer';
import { QuickCheckInModal } from '../components/common/QuickCheckInModal';
import { Sparkles, Radio } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-950 text-slate-100 overflow-hidden font-sans ambient-bg bg-grid-pattern relative">
      {/* Background radial ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C6FF00]/[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[160px] pointer-events-none" />

      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:block shrink-0 relative z-40">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Top Navbar */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
        />

        {/* Live System Activity Ticker Ribbon */}
        <div className="bg-dark-900/80 border-b border-white/[0.05] px-4 md:px-8 py-1.5 flex items-center justify-between text-[11px] text-slate-400 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Turnstiles active: <strong className="text-white">48 check-ins today</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Peak slot: <strong className="text-[#C6FF00]">07:00 PM (Evening Rush)</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Monthly collections: <strong className="text-white">+14.8% MoM</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono text-[10px] shrink-0">
            <span>TECHLIFAA NEURAL ENGINE v2.4</span>
            <span className="text-[#C6FF00]">● 99.8% UPTIME</span>
          </div>
        </div>

        {/* Content Body Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-24 lg:pb-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Responsive Mobile Bottom Navigation */}
      <MobileNav onOpenMenu={() => setIsSearchOpen(true)} />

      {/* Global Command Search (Cmd + K) */}
      <GlobalCommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenQuickCheckIn={() => {
          setIsSearchOpen(false);
          setIsQuickCheckInOpen(true);
        }}
      />

      {/* Quick Check-in Turnstile Simulator Modal */}
      <QuickCheckInModal
        isOpen={isQuickCheckInOpen}
        onClose={() => setIsQuickCheckInOpen(false)}
      />

      {/* Floating Interactive AI Assistant */}
      <FloatingAIAssistant />

      {/* Toast Notification Renderer */}
      <ToastContainer />
    </div>
  );
};
