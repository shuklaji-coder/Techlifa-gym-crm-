import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  CreditCard,
  Users,
  Flame,
  Award,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { exportToCSV, formatINR, formatDate } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ReportsAnalytics: React.FC = () => {
  const { members, leads, trainers, payments, plans, attendance } = useApp();

  const [dateRange, setDateRange] = useState('30d');

  const paidPayments = payments.filter(p => p.status === 'paid');
  const totalRevenue = paidPayments.reduce((acc, p) => acc + p.totalAmount, 0);
  const activeMembers = members.filter(m => m.status === 'active');
  const joinedLeads = leads.filter(l => l.stage === 'joined');

  // Plan distribution
  const planData = plans.map(p => ({
    name: p.name.split(' ')[0],
    revenue: payments.filter(pay => pay.planId === p.id && pay.status === 'paid').reduce((sum, pay) => sum + pay.totalAmount, 0) || 50000,
  }));

  // Lead Conversion breakdown
  const leadSourceData = [
    { source: 'Instagram', leads: 15, joined: 6, rate: '40%' },
    { source: 'Google Search', leads: 10, joined: 4, rate: '40%' },
    { source: 'Walk-in', leads: 8, joined: 5, rate: '62.5%' },
    { source: 'Member Referral', leads: 5, joined: 4, rate: '80%' },
    { source: 'Facebook Ads', leads: 2, joined: 0, rate: '0%' },
  ];

  const handleExportMembersCSV = () => {
    exportToCSV('techlifaa_members_report', members, [
      { key: 'id', label: 'ID' },
      { key: 'fullName', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'planId', label: 'Plan' },
      { key: 'totalVisits', label: 'Total Visits' },
      { key: 'outstandingBalance', label: 'Dues (INR)' },
    ]);
  };

  const handleExportRevenueCSV = () => {
    exportToCSV('techlifaa_revenue_report', payments, [
      { key: 'invoiceNumber', label: 'Invoice No' },
      { key: 'date', label: 'Date' },
      { key: 'memberName', label: 'Member' },
      { key: 'planName', label: 'Plan' },
      { key: 'paymentMethod', label: 'Method' },
      { key: 'totalAmount', label: 'Total Amount (INR)' },
      { key: 'status', label: 'Status' },
    ]);
  };

  const handleExportLeadsCSV = () => {
    exportToCSV('techlifaa_leads_report', leads, [
      { key: 'id', label: 'Lead ID' },
      { key: 'fullName', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'source', label: 'Source' },
      { key: 'stage', label: 'Stage' },
      { key: 'score', label: 'AI Score' },
      { key: 'fitnessGoal', label: 'Goal' },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Reports & Executive Analytics
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              CSV Export Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Downloadable reports for accounting, lead acquisition audits, trainer performance, and membership lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C6FF00]"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90 Days)</option>
            <option value="ytd">Year to Date (2024)</option>
          </select>
        </div>
      </div>

      {/* CSV Export Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-dark-800/90 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Members Master CSV</h4>
              <p className="text-[10px] text-slate-400">120 active & historical records</p>
            </div>
          </div>
          <button
            onClick={handleExportMembersCSV}
            className="p-2 rounded-xl bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-300 transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800/90 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C6FF00]/10 text-[#C6FF00] border border-[#C6FF00]/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">GST Revenue & Invoices CSV</h4>
              <p className="text-[10px] text-slate-400">85 transactions with tax breakdown</p>
            </div>
          </div>
          <button
            onClick={handleExportRevenueCSV}
            className="p-2 rounded-xl bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-300 transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800/90 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Leads & Conversion Pipeline CSV</h4>
              <p className="text-[10px] text-slate-400">40 leads with sources & scores</p>
            </div>
          </div>
          <button
            onClick={handleExportLeadsCSV}
            className="p-2 rounded-xl bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-300 transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Revenue by Plan Chart & Lead Conversion Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Gross Revenue by Membership Tier</h3>
              <p className="text-xs text-slate-400">Cumulative receipts across active plans</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#C6FF00]">
              Total: {formatINR(totalRevenue, true)}
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F283B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121722', borderColor: '#2A364E', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => formatINR(Number(val))}
                />
                <Bar dataKey="revenue" fill="#C6FF00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion by Source Table */}
        <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Lead Channel Conversion Rate</h3>
              <p className="text-xs text-slate-400">Effectiveness of marketing spend channels</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">Top: Referral (80%)</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-dark-750 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Lead Source</th>
                  <th className="py-2.5 px-3 text-center">Inquiries</th>
                  <th className="py-2.5 px-3 text-center">Joined</th>
                  <th className="py-2.5 px-3 text-right">Conversion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-750 text-slate-200">
                {leadSourceData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-dark-750/50">
                    <td className="py-3 px-3 font-semibold text-white">{row.source}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.leads}</td>
                    <td className="py-3 px-3 text-center font-mono text-[#C6FF00] font-bold">{row.joined}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trainer Performance Table */}
      <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Coach Productivity & Commission Ledger</h3>
            <p className="text-xs text-slate-400">Monthly retention scores, assigned clients, and commission payout estimates</p>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-dark-750 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Trainer Name</th>
                <th className="py-2.5 px-4">Specialty</th>
                <th className="py-2.5 px-4 text-center">Active Clients</th>
                <th className="py-2.5 px-4 text-center">Score</th>
                <th className="py-2.5 px-4 text-center">Rating</th>
                <th className="py-2.5 px-4 text-right">Commission Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750 text-slate-200">
              {trainers.map(t => (
                <tr key={t.id} className="hover:bg-dark-750/50">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                    <img src={t.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span>{t.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{t.specialization[0]}</td>
                  <td className="py-3 px-4 text-center font-mono">{t.assignedMemberCount}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#C6FF00] font-bold">
                    {t.monthlyPerformanceScore}/100
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-amber-400">⭐ {t.rating}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">{t.commissionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
