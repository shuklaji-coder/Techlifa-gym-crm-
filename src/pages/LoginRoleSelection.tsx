import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Crown,
  Dumbbell,
  UserCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const LoginRoleSelection: React.FC = () => {
  const { userRole, setUserRole, settings } = useApp();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    navigate('/');
  };

  const roles = [
    {
      id: 'owner' as UserRole,
      title: 'Gym Owner / Director',
      badge: 'Full Executive Access',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      description: 'Strategic oversight, P&L statements, AI churn diagnostics, pricing plans, and staff payroll.',
      color: 'border-[#C6FF00]/60 hover:border-[#C6FF00] bg-dark-800/90 shadow-[0_0_30px_rgba(198,255,0,0.12)]',
      icon: <Crown className="w-6 h-6 text-[#C6FF00]" />,
      permissions: [
        'Complete Revenue & GST Invoicing Access',
        'AI Business Advisor & Churn Predictions',
        'Staff Salary & Commission Management',
        'Club Branding & Global Configurations',
      ],
    },
    {
      id: 'trainer' as UserRole,
      title: 'Senior Coach / Trainer',
      badge: 'Coaching & Floor Access',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      description: 'Assigned member body progress, 4-week workout builders, diet plans, and group fitness classes.',
      color: 'border-cyan-500/40 hover:border-cyan-400 bg-dark-800/90 shadow-[0_0_30px_rgba(6,182,212,0.12)]',
      icon: <Dumbbell className="w-6 h-6 text-cyan-400" />,
      permissions: [
        'Client Body Measurements & Tracking',
        'AI Workout & Nutrition Generators',
        'Class Attendance & Schedule Check-in',
        'Personal Training Session Logs',
      ],
    },
    {
      id: 'front_desk' as UserRole,
      title: 'Front Desk / Reception Desk',
      badge: 'Operations & Check-in',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120',
      description: 'Turnstile check-ins, new member registrations, UPI fee collection, and trial booking follow-ups.',
      color: 'border-amber-500/40 hover:border-amber-400 bg-dark-800/90 shadow-[0_0_30px_rgba(245,158,11,0.12)]',
      icon: <UserCheck className="w-6 h-6 text-amber-400" />,
      permissions: [
        'Live Optical QR & Biometric Check-in',
        'Fee Collection & Receipt Generation',
        'Walk-in Lead Capture & WhatsApp Links',
        'Membership Renewals & Freezes',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C6FF00]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C6FF00] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(198,255,0,0.3)]">
            ⚡
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wider font-display">
              {settings.gymName}
            </h1>
            <p className="text-xs text-slate-400">{settings.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-850 border border-slate-700 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-[#C6FF00]" />
          <span>Interactive Enterprise Demo Portal</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto w-full text-center my-6 md:my-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6FF00]/10 border border-[#C6FF00]/30 text-[#C6FF00] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Select Your Demo Role to Experience the Platform</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">
          Welcome to <span className="text-[#C6FF00]">TECHLIFAA GYM AI</span>
        </h2>
        <p className="text-sm md:text-base text-slate-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          The next-generation fitness business management system built specifically for premium Indian health clubs, gyms, and sports studios.
        </p>
      </div>

      {/* 3 Role Selection Cards */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => handleSelectRole(role.id)}
            className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 ${role.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-dark-750 border border-slate-700/60 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-dark-900 text-slate-300 border border-slate-700">
                  {role.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#C6FF00] transition-colors">
                {role.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {role.description}
              </p>

              {/* Permissions list */}
              <div className="mt-5 pt-4 border-t border-slate-700/60 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Included Privileges:
                </p>
                {role.permissions.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF00] shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs font-bold text-white group-hover:text-[#C6FF00]">
              <span>Log in as {role.id === 'owner' ? 'Owner' : role.id === 'trainer' ? 'Trainer' : 'Front Desk'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center py-6 text-xs text-slate-500 border-t border-slate-800/80 mt-8">
        <p>
          TECHLIFAA GYM AI Enterprise SaaS • High-End Interactive Sales Demonstration • No backend or cloud account required
        </p>
      </div>
    </div>
  );
};
