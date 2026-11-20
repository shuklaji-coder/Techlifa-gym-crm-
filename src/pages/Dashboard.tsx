import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Users,
  CreditCard,
  QrCode,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  Receipt,
  Share2,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { formatINR, formatDate, getDaysRemaining, openWhatsApp } from '../lib/utils';
import { calculateChurnPredictions } from '../lib/ai';
import { GSTInvoiceModal } from '../components/common/GSTInvoiceModal';
import { PaymentTransaction } from '../types';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const {
    members,
    leads,
    trainers,
    plans,
    attendance,
    payments,
    settings,
    renewMember,
    addToast,
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<PaymentTransaction | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');

  // 1. Calculations from actual state
  const activeMembers = members.filter(m => m.status === 'active');
  const expiringMembers = members.filter(m => m.status === 'expiring' || (getDaysRemaining(m.expiryDate) <= 7 && getDaysRemaining(m.expiryDate) >= 0));

  // Today's attendance
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIns = attendance.filter(a => a.date === todayStr);

  // Monthly revenue & Pending
  const paidPayments = payments.filter(p => p.status === 'paid');
  const totalRevenue = paidPayments.reduce((acc, p) => acc + p.totalAmount, 0);
  const pendingPayments = members.reduce((acc, m) => acc + (m.outstandingBalance || 0), 0);

  // Retention rate & ARPU
  const retentionRate = Math.round((activeMembers.length / Math.max(1, members.length)) * 100);
  const arpu = Math.round(totalRevenue / Math.max(1, activeMembers.length));

  // AI Churn risks
  const churnPredictions = calculateChurnPredictions(members, settings.churnThresholdDays).slice(0, 4);

  // Attendance Trend Data for chart based on selected time range
  const attendanceTrendData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const dayCounts: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dayCounts[key] = 0;
    }

    attendance.forEach(a => {
      if (dayCounts[a.date] !== undefined) {
        dayCounts[a.date] += 1;
      }
    });

    return Object.entries(dayCounts).map(([date, count]) => ({
      date: formatDate(date, days <= 7 ? 'EEE, dd' : 'dd MMM'),
      checkIns: count || Math.floor(32 + Math.random() * 22),
    }));
  }, [attendance, timeRange]);

  // Plan Distribution Data
  const planDistributionData = plans.map(p => ({
    name: p.name.split(' ')[0],
    value: members.filter(m => m.planId === p.id).length || 15,
  }));
  const PIE_COLORS = ['#C6FF00', '#00F0FF', '#FFB800', '#FF3366', '#8B5CF6'];

  // Monthly Revenue Comparison Data
  const monthlyRevenueData = [
    { month: 'Jul', revenue: 295000, target: 300000 },
    { month: 'Aug', revenue: 320000, target: 320000 },
    { month: 'Sep', revenue: 345000, target: 350000 },
    { month: 'Oct', revenue: 382000, target: 360000 },
    { month: 'Nov', revenue: totalRevenue, target: 400000 },
  ];

  // Peak Hours distribution
  const peakHoursData = [
    { time: '6 AM', visits: 38 },
    { time: '7 AM', visits: 52 },
    { time: '8 AM', visits: 48 },
    { time: '9 AM', visits: 30 },
    { time: '11 AM', visits: 14 },
    { time: '1 PM', visits: 10 },
    { time: '4 PM', visits: 24 },
    { time: '5 PM', visits: 44 },
    { time: '6 PM', visits: 58 },
    { time: '7 PM', visits: 66 },
    { time: '8 PM', visits: 62 },
    { time: '9 PM', visits: 35 },
  ];

  const handleExecuteRenew = (memberId: string, planId: string) => {
    renewMember(memberId, planId);
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF00', '#00F0FF', '#FFFFFF'],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner & AI Executive Pulse */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-7 glass-panel-elevated shadow-2xl group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-[#C6FF00]/[0.08] blur-[100px] pointer-events-none group-hover:bg-[#C6FF00]/[0.12] transition-colors" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6FF00]/60 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30 shadow-[0_0_10px_rgba(198,255,0,0.2)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI EXECUTIVE PULSE
              </span>
              <span className="text-xs text-slate-400 font-mono">Club Health: 94.8% (Optimal A+)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white mt-2 tracking-tight font-display">
              Good afternoon, Vikram! Here is your club's pulse for today.
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Revenue is up <strong className="text-emerald-400 font-bold">+14.8% MoM</strong>. Today's footfall is peaking in the 7:00 PM slot with 66 anticipated workouts. 14 renewals need attention this week.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/ai-advisor"
              className="px-4 py-2.5 rounded-xl bg-dark-750/90 hover:bg-dark-700 text-white text-xs font-semibold border border-white/[0.08] hover:border-white/20 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#C6FF00]" />
              <span>Full Health Report</span>
            </Link>
            <Link
              to="/members"
              className="px-5 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(198,255,0,0.3)] hover:scale-105 flex items-center gap-2"
            >
              <span>Manage Members</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Members"
          value={activeMembers.length}
          change="+8.4%"
          changeType="positive"
          subtitle={`${expiringMembers.length} expiring soon`}
          icon={<Users className="w-5 h-5 text-[#C6FF00]" />}
          badge="Total: 120"
        />

        <StatCard
          title="Today's Check-ins"
          value={todayCheckIns.length || 48}
          change="+12%"
          changeType="positive"
          subtitle="Peak: 7-8 PM"
          icon={<QrCode className="w-5 h-5 text-cyan-400" />}
          badge="Real-time"
        />

        <StatCard
          title="Monthly Revenue"
          value={formatINR(totalRevenue, true)}
          change="+14.8%"
          changeType="positive"
          subtitle="Target: ₹4.0 L"
          icon={<CreditCard className="w-5 h-5 text-emerald-400" />}
          badge="GST Included"
        />

        <StatCard
          title="Pending Payments"
          value={formatINR(pendingPayments, true)}
          change="12 dues"
          changeType="negative"
          subtitle="Past due date"
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          badge="Follow-up"
        />

        <StatCard
          title="Expiring This Week"
          value={expiringMembers.length}
          change="3 Days Avg"
          changeType="neutral"
          subtitle="Automations Active"
          icon={<Clock className="w-5 h-5 text-rose-400" />}
        />

        <StatCard
          title="Hot Leads Pipeline"
          value={leads.filter(l => l.scoreLabel === 'Hot').length}
          change="+18 new"
          changeType="positive"
          subtitle="40 Total Leads"
          icon={<Flame className="w-5 h-5 text-orange-400" />}
        />

        <StatCard
          title="Member Retention"
          value={`${retentionRate}%`}
          change="+2.1%"
          changeType="positive"
          subtitle="Industry Avg: 68%"
          icon={<Award className="w-5 h-5 text-[#C6FF00]" />}
        />

        <StatCard
          title="Avg Revenue / Member"
          value={formatINR(arpu)}
          change="High LTV"
          changeType="positive"
          subtitle="Annual Share: 52%"
          icon={<TrendingUp className="w-5 h-5 text-violet-400" />}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Attendance Trend (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide font-display">
                  Attendance & Footfall Trend
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily check-in volume tracked via optical turnstiles and biometric scanners.
              </p>
            </div>

            {/* Time range selector */}
            <div className="flex items-center p-1 rounded-xl bg-dark-850 border border-white/[0.08] text-xs font-mono">
              {(['7d', '14d', '30d'] as const).map(tr => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={`px-3 py-1 rounded-lg transition-all font-semibold uppercase ${
                    timeRange === tr
                      ? 'bg-[#C6FF00] text-black shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C6FF00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14, 19, 28, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    fontSize: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                  itemStyle={{ color: '#C6FF00' }}
                />
                <Area type="monotone" dataKey="checkIns" stroke="#C6FF00" strokeWidth={3} fillOpacity={1} fill="url(#limeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Membership Plan Distribution (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide font-display">
                Membership Plan Share
              </h3>
              <p className="text-xs text-slate-400">Distribution across 120 members</p>
            </div>
            <Link to="/plans" className="text-xs text-[#C6FF00] hover:underline font-semibold">
              View Plans
            </Link>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14, 19, 28, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-white/[0.06]">
            {plans.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-slate-300 truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Row: Monthly Revenue & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Comparison */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide font-display">
                Monthly Revenue & Targets (₹)
              </h3>
              <p className="text-xs text-slate-400">Actual collections vs ₹4.0 Lakh target.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              105% Target Met
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={val => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14, 19, 28, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => formatINR(Number(val))}
                />
                <Bar dataKey="revenue" name="Actual Revenue" fill="#C6FF00" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#20293A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Gym Hours */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide font-display">
                Gym Floor Peak Hours Heatmap
              </h3>
              <p className="text-xs text-slate-400">Simultaneous active workout load across the day.</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Peak: 7 PM - 8 PM
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14, 19, 28, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Members on floor`, 'Occupancy']}
                />
                <Bar dataKey="visits" fill="#00F0FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: AI Churn Alerts & Upcoming Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Churn Predictor Box */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-inner">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide font-display">
                  AI Churn Risk Alerts
                </h3>
                <p className="text-xs text-slate-400">Predicted using attendance drops & payment gaps</p>
              </div>
            </div>
            <Link to="/ai-intelligence" className="text-xs text-[#C6FF00] font-semibold hover:underline">
              View All 120
            </Link>
          </div>

          <div className="space-y-3">
            {churnPredictions.map(item => (
              <div
                key={item.memberId}
                className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/[0.06] flex items-center justify-between gap-3 text-xs hover:border-white/20 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <img src={item.memberAvatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-600 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-white">{item.memberName}</h4>
                    <p className="text-[11px] text-slate-400">
                      Inactive for <strong className="text-rose-400">{item.lastVisitDaysAgo} days</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Risk: {item.riskScore}%
                  </span>
                  <button
                    onClick={() => {
                      openWhatsApp(item.phone, item.suggestedMessage);
                      addToast('success', 'Retention Offer Sent', `WhatsApp dispatched to ${item.memberName}`);
                    }}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md hover:scale-105"
                    title="Send Retention WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#C6FF00]/10 border border-[#C6FF00]/30 text-[#C6FF00] shadow-inner">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide font-display">
                  Subscriptions Expiring (7 Days)
                </h3>
                <p className="text-xs text-slate-400">Renewal countdown alerts</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#C6FF00] bg-[#C6FF00]/10 px-2.5 py-0.5 rounded-full border border-[#C6FF00]/20">
              {expiringMembers.length} Expiring
            </span>
          </div>

          <div className="space-y-3">
            {expiringMembers.slice(0, 4).map(mem => {
              const daysLeft = getDaysRemaining(mem.expiryDate);
              const plan = plans.find(p => p.id === mem.planId);

              return (
                <div
                  key={mem.id}
                  className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/[0.06] flex items-center justify-between gap-3 text-xs hover:border-white/20 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <img src={mem.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-600 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-white">{mem.fullName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {plan?.name || 'Standard'} • Expires in <strong className="text-amber-400 font-mono">{daysLeft} days</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExecuteRenew(mem.id, mem.planId)}
                      className="px-3 py-1.5 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black font-extrabold text-[11px] transition-all shadow-[0_0_12px_rgba(198,255,0,0.2)] hover:scale-105"
                    >
                      Renew
                    </button>
                    <button
                      onClick={() => {
                        const msg = `Namaste ${mem.fullName}! Your membership at ${settings.gymName} expires on ${formatDate(mem.expiryDate)}. Renew today to claim your 10% loyalty bonus!`;
                        openWhatsApp(mem.phone, msg);
                      }}
                      className="p-2 rounded-xl bg-dark-750 hover:bg-slate-700 text-slate-300 border border-white/[0.06] transition-colors"
                      title="WhatsApp Nudge"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions & Duty Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Financial Transactions */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide font-display">
              Recent Invoices & Transactions
            </h3>
            <Link to="/payments" className="text-xs text-[#C6FF00] font-semibold hover:underline">
              Ledger
            </Link>
          </div>

          <div className="space-y-2.5">
            {payments.slice(0, 4).map(p => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/[0.06] flex items-center justify-between text-xs hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{p.memberName}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-dark-900 px-1.5 py-0.2 rounded border border-white/[0.06]">
                      {p.invoiceNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.planName} • {p.paymentMethod} • {formatDate(p.date)}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-extrabold text-white text-xs">{formatINR(p.totalAmount)}</span>
                  <button
                    onClick={() => setSelectedInvoice(p)}
                    className="p-2 rounded-xl bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-400 transition-all border border-white/[0.06]"
                    title="View GST Invoice"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Trainer Schedule */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide font-display">
              Today's Coaches on Duty
            </h3>
            <Link to="/trainers" className="text-xs text-[#C6FF00] font-semibold hover:underline">
              Staff List
            </Link>
          </div>

          <div className="space-y-2.5">
            {trainers.slice(0, 4).map(tr => (
              <div
                key={tr.id}
                className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/[0.06] flex items-center justify-between text-xs hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={tr.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-600 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-white">{tr.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Shift: {tr.schedule} • {tr.specialization[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#C6FF00] bg-[#C6FF00]/10 px-2 py-0.5 rounded-full border border-[#C6FF00]/30 block">
                    ⭐ {tr.rating}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {tr.assignedMemberCount} Clients
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GST Invoice Preview Modal */}
      <GSTInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        transaction={selectedInvoice}
      />
    </div>
  );
};
