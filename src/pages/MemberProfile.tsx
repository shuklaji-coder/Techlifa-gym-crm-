import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  QrCode,
  Dumbbell,
  UtensilsCrossed,
  FileText,
  Clock,
  ArrowLeft,
  Share2,
  Sparkles,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { formatINR, formatDate, openWhatsApp, getDaysRemaining } from '../lib/utils';
import { GSTInvoiceModal } from '../components/common/GSTInvoiceModal';
import { PaymentTransaction, BodyMeasurement } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    members,
    plans,
    trainers,
    attendance,
    payments,
    workoutPlans,
    dietPlans,
    updateMember,
    renewMember,
    checkInMember,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'payments' | 'measurements' | 'workout' | 'diet' | 'notes' | 'timeline'
  >('overview');

  const [selectedInvoice, setSelectedInvoice] = useState<PaymentTransaction | null>(null);
  const [newNote, setNewNote] = useState('');

  const member = members.find(m => m.id === id);

  if (!member) {
    return (
      <div className="p-12 text-center bg-dark-800 rounded-2xl border border-slate-700">
        <h2 className="text-lg font-bold text-white">Member Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">The member ID "{id}" does not exist in the database.</p>
        <button
          onClick={() => navigate('/members')}
          className="mt-4 px-4 py-2 bg-[#C6FF00] text-black text-xs font-bold rounded-xl"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const plan = plans.find(p => p.id === member.planId);
  const trainer = trainers.find(t => t.id === member.assignedTrainerId);
  const memberAttendance = attendance.filter(a => a.memberId === member.id);
  const memberPayments = payments.filter(p => p.memberId === member.id);
  const assignedWorkout = workoutPlans.find(w => w.assignedMemberIds.includes(member.id)) || workoutPlans[0];
  const assignedDiet = dietPlans.find(d => d.assignedMemberIds.includes(member.id)) || dietPlans[0];

  const daysLeft = getDaysRemaining(member.expiryDate);

  // Measurement charts data
  const measurementData = member.measurements.map(m => ({
    date: formatDate(m.date, 'dd MMM'),
    weight: m.weightKg,
    bodyFat: m.bodyFatPercent,
    waist: m.waistCm,
  }));

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const currentNotes = member.notes ? `${member.notes}\n• ${newNote}` : `• ${newNote}`;
    updateMember(member.id, { notes: currentNotes });
    setNewNote('');
    addToast('success', 'Observation Added', 'Saved to member coaching records.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top back nav & Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/members')}
          className="p-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              {member.fullName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              {member.id}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                member.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : member.status === 'expiring'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {member.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Joined {formatDate(member.joinDate)} • {member.fitnessGoal} • {plan?.name || 'Standard'}
          </p>
        </div>
      </div>

      {/* Hero Profile Summary Card */}
      <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={member.avatar}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-600 shadow-md"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">{member.fullName}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {member.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {member.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {member.age} yrs, {member.gender}
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Emergency: <strong className="text-slate-200">{member.emergencyContact.name}</strong> ({member.emergencyContact.relationship}) —{' '}
                <span className="font-mono">{member.emergencyContact.phone}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => checkInMember(member.id, 'Manual')}
              className="px-3.5 py-2 rounded-xl bg-dark-750 hover:bg-dark-700 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-[#C6FF00]" />
              <span>Tap Check-in</span>
            </button>

            <button
              onClick={() => renewMember(member.id, member.planId)}
              className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Renew Membership</span>
            </button>

            <button
              onClick={() => openWhatsApp(member.phone, `Namaste ${member.fullName}! This is Coach ${trainer?.name || 'Vikram'} from ${member.id}. Hope you are ready for today's session!`)}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title="Chat on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 text-xs">
          <div className="p-3 rounded-xl bg-dark-850 border border-slate-750">
            <span className="text-slate-400 text-[11px] block">Membership Expiry</span>
            <span className="font-bold text-white text-sm mt-0.5 block">
              {formatDate(member.expiryDate)}
            </span>
            <span className={`text-[10px] font-semibold ${daysLeft < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days expired` : `${daysLeft} days remaining`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-slate-750">
            <span className="text-slate-400 text-[11px] block">Lifetime Visits</span>
            <span className="font-bold text-white text-sm mt-0.5 block">{member.totalVisits} workouts</span>
            <span className="text-[10px] text-slate-400">Last visited {formatDate(member.lastAttendance)}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-slate-750">
            <span className="text-slate-400 text-[11px] block">Personal Coach</span>
            <span className="font-bold text-white text-sm mt-0.5 block truncate">
              {trainer?.name || 'Floor Coach'}
            </span>
            <span className="text-[10px] text-[#C6FF00]">
              {trainer ? `⭐ ${trainer.rating} • ${trainer.specialization[0]}` : 'General Floor'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-slate-750">
            <span className="text-slate-400 text-[11px] block">Outstanding Dues</span>
            <span className={`font-bold font-mono text-sm mt-0.5 block ${member.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {member.outstandingBalance > 0 ? formatINR(member.outstandingBalance) : 'Fully Cleared'}
            </span>
            <span className="text-[10px] text-slate-400">All invoices updated</span>
          </div>
        </div>
      </div>

      {/* 8 Tab Navigation Buttons */}
      <div className="flex border-b border-slate-800 overflow-x-auto whitespace-nowrap custom-scrollbar gap-1">
        {[
          { key: 'overview', label: 'Overview', icon: <User className="w-3.5 h-3.5" /> },
          { key: 'attendance', label: `Attendance (${memberAttendance.length})`, icon: <QrCode className="w-3.5 h-3.5" /> },
          { key: 'payments', label: `Payments (${memberPayments.length})`, icon: <CreditCard className="w-3.5 h-3.5" /> },
          { key: 'measurements', label: 'Body Progress', icon: <Flame className="w-3.5 h-3.5 text-[#C6FF00]" /> },
          { key: 'workout', label: 'Workout Protocol', icon: <Dumbbell className="w-3.5 h-3.5" /> },
          { key: 'diet', label: 'Indian Diet Plan', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
          { key: 'notes', label: 'Coaching Notes', icon: <FileText className="w-3.5 h-3.5" /> },
          { key: 'timeline', label: 'Activity Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-[#C6FF00] text-[#C6FF00] bg-dark-800/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">Membership & Contract Details</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between py-1.5 border-b border-slate-750">
                <span className="text-slate-400">Current Plan:</span>
                <span className="font-bold text-white">{plan?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-750">
                <span className="text-slate-400">Plan Duration:</span>
                <span className="text-slate-200">{plan?.durationMonths} Months</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-750">
                <span className="text-slate-400">Package Fee (GST 18% incl):</span>
                <span className="font-mono font-bold text-[#C6FF00]">{formatINR(plan?.price || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-750">
                <span className="text-slate-400">Enrolled On:</span>
                <span className="text-slate-200">{formatDate(member.joinDate)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-750">
                <span className="text-slate-400">Current Expiry:</span>
                <span className="font-bold text-white">{formatDate(member.expiryDate)}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-semibold text-slate-300 mb-2">Included Amenities:</p>
              <div className="space-y-1">
                {plan?.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF00]" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">Coach & Training Focus</h3>
            <div className="p-3.5 rounded-xl bg-dark-750 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={trainer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">{trainer?.name || 'Head Coach'}</h4>
                  <p className="text-[11px] text-[#C6FF00]">{trainer?.specialization.join(', ')}</p>
                </div>
              </div>
              <button
                onClick={() => openWhatsApp(trainer?.phone || '+91-98000-00000', `Namaste Coach, inquiring regarding client ${member.fullName}'s routine.`)}
                className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <p className="font-semibold text-slate-300 mb-1">Target Fitness Goal:</p>
              <div className="p-3 rounded-xl bg-dark-750 text-slate-300 text-xs">
                🎯 {member.fitnessGoal} — 4-week structured progression program.
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-300 mb-1">Medical Disclaimers / Notes:</p>
              <div className="p-3 rounded-xl bg-dark-750 text-slate-400 text-xs leading-relaxed">
                {member.notes || 'No chronic health issues or injuries recorded. Cleared for high-intensity training.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Heatmap & Logs */}
      {activeTab === 'attendance' && (
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">30-Day Check-in Heatmap</h3>
                <p className="text-xs text-slate-400">Visualizing consistency over the past month</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#C6FF00] bg-[#C6FF00]/10 px-2.5 py-1 rounded">
                Attendance Rate: 84%
              </span>
            </div>

            {/* 30-day block grid */}
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 p-3 rounded-xl bg-dark-850 border border-slate-750">
              {Array.from({ length: 30 }).map((_, idx) => {
                const attended = idx % 4 !== 0; // simulated attendance
                return (
                  <div
                    key={idx}
                    title={`Day ${30 - idx}: ${attended ? 'Attended' : 'Rest Day'}`}
                    className={`h-7 rounded-md flex items-center justify-center font-mono text-[10px] ${
                      attended
                        ? 'bg-[#C6FF00] text-black font-bold shadow-[0_0_8px_rgba(198,255,0,0.2)]'
                        : 'bg-dark-750 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {30 - idx}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#C6FF00]" /> Check-in logged
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-dark-750 border border-slate-700" /> Rest Day
              </span>
            </div>
          </div>

          {/* Table of check-in records */}
          <div className="rounded-2xl bg-dark-800/90 border border-slate-700/70 overflow-hidden shadow-md">
            <div className="p-4 border-b border-slate-700 bg-dark-850">
              <h4 className="font-bold text-white text-xs">Logged Check-in Records</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-750 text-slate-400 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Check-in Time</th>
                    <th className="py-2.5 px-4">Check-out Time</th>
                    <th className="py-2.5 px-4">Entry Channel</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-750">
                  {memberAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No previous attendance records recorded.
                      </td>
                    </tr>
                  ) : (
                    memberAttendance.map(a => (
                      <tr key={a.id} className="hover:bg-dark-750/50">
                        <td className="py-3 px-4 font-medium text-white">{formatDate(a.date)}</td>
                        <td className="py-3 px-4 font-mono text-[#C6FF00]">{a.checkInTime}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{a.checkOutTime || 'Active on floor'}</td>
                        <td className="py-3 px-4 text-slate-400">{a.method}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                            PRESENT
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payments & Invoices */}
      {activeTab === 'payments' && (
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl bg-dark-800/90 border border-slate-700/70 overflow-hidden shadow-md">
            <div className="p-4 border-b border-slate-700 bg-dark-850 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">Billing History & GST Tax Invoices</h4>
                <p className="text-[11px] text-slate-400">Official tax invoices compliant with Indian GST</p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-750 text-slate-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Plan / Package</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-750">
                  {memberPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No previous payment invoices found.
                      </td>
                    </tr>
                  ) : (
                    memberPayments.map(p => (
                      <tr key={p.id} className="hover:bg-dark-750/50">
                        <td className="py-3 px-4 font-mono font-bold text-white">{p.invoiceNumber}</td>
                        <td className="py-3 px-4 text-slate-300">{formatDate(p.date)}</td>
                        <td className="py-3 px-4 text-slate-200">{p.planName}</td>
                        <td className="py-3 px-4 text-slate-400">{p.paymentMethod}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">
                          {formatINR(p.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(p)}
                            className="px-2.5 py-1 rounded-lg bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Body Measurements Progress Charts */}
      {activeTab === 'measurements' && (
        <div className="space-y-6 text-xs">
          <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Weight (kg) & Body Fat % Progression</h3>
                <p className="text-xs text-slate-400">Tracked over bi-weekly InBody assessments</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                -2.5 kg Fat Loss Achieved
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurementData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F283B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121722', borderColor: '#2A364E', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#C6FF00" strokeWidth={3} name="Weight (kg)" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="bodyFat" stroke="#00F0FF" strokeWidth={2.5} name="Body Fat %" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="rounded-2xl bg-dark-800/90 border border-slate-700/70 overflow-hidden shadow-md">
            <div className="p-4 border-b border-slate-700 bg-dark-850">
              <h4 className="font-bold text-white text-xs">Biometric Logs History</h4>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-750 text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Weight</th>
                  <th className="py-2.5 px-4">Body Fat %</th>
                  <th className="py-2.5 px-4">Chest</th>
                  <th className="py-2.5 px-4">Waist</th>
                  <th className="py-2.5 px-4">Arms</th>
                  <th className="py-2.5 px-4">Hips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-750">
                {member.measurements.map((m, idx) => (
                  <tr key={idx} className="hover:bg-dark-750/50">
                    <td className="py-3 px-4 font-semibold text-white">{formatDate(m.date)}</td>
                    <td className="py-3 px-4 font-mono text-[#C6FF00] font-bold">{m.weightKg} kg</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{m.bodyFatPercent}%</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{m.chestCm} cm</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{m.waistCm} cm</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{m.armsCm} cm</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{m.hipsCm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Workout Plan Assigned */}
      {activeTab === 'workout' && (
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{assignedWorkout.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30">
                    {assignedWorkout.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Goal: {assignedWorkout.goal} • {assignedWorkout.daysPerWeek} Days/Week • {assignedWorkout.durationWeeks} Weeks Split
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-white font-semibold border border-slate-700 transition-colors"
              >
                Print Routine
              </button>
            </div>

            <div className="space-y-4">
              {assignedWorkout.days.map((day, dIdx) => (
                <div key={dIdx} className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#C6FF00] text-xs uppercase tracking-wide">
                      {day.dayName}
                    </h4>
                    <span className="text-[11px] text-slate-400">{day.focus}</span>
                  </div>

                  <div className="divide-y divide-slate-800 pt-1">
                    {day.exercises.map((ex, eIdx) => (
                      <div key={eIdx} className="py-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{ex.name}</p>
                          <p className="text-[10px] text-slate-400">Target: {ex.targetMuscle}</p>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          <span className="text-[#C6FF00] font-bold">{ex.sets} sets</span> × {ex.reps} reps
                          <span className="text-slate-500 block text-[10px]">Rest: {ex.restSeconds}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Diet Plan Assigned */}
      {activeTab === 'diet' && (
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{assignedDiet.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {assignedDiet.dietType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target: {assignedDiet.dailyCalories} kcal • Protein: {assignedDiet.proteinGrams}g • Carbs: {assignedDiet.carbsGrams}g • Fats: {assignedDiet.fatsGrams}g
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-white font-semibold border border-slate-700 transition-colors"
              >
                Print Diet Blueprint
              </button>
            </div>

            <div className="space-y-3">
              {assignedDiet.meals.map((meal, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#C6FF00] uppercase bg-[#C6FF00]/10 px-2 py-0.5 rounded">
                      {meal.mealType}
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {meal.calories} kcal • {meal.proteinGrams}g Protein
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{meal.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{meal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Notes */}
      {activeTab === 'notes' && (
        <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white tracking-wide">Trainer & Medical Observations</h3>
          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add observation (e.g. Cleared 100kg deadlift today, posture solid, advised hydration)..."
              className="w-full bg-dark-750 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-[#C6FF00]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#C6FF00] text-black font-extrabold rounded-xl hover:bg-[#B5EB00] transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 text-slate-300 whitespace-pre-wrap leading-relaxed">
            {member.notes || 'No notes currently logged.'}
          </div>
        </div>
      )}

      {/* Tab 8: Activity Timeline */}
      {activeTab === 'timeline' && (
        <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/70 shadow-md text-xs space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wide">Chronological Member Journey</h3>
          <div className="relative pl-6 space-y-6 border-l border-slate-750">
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#C6FF00] shadow-[0_0_8px_#C6FF00]" />
              <p className="font-bold text-white">Recent Workout Completed</p>
              <p className="text-[11px] text-slate-400">Tapped turnstile on {formatDate(member.lastAttendance)}</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-400" />
              <p className="font-bold text-white">InBody Assessment Completed</p>
              <p className="text-[11px] text-slate-400">Weighed {member.measurements[0]?.weightKg} kg with {member.measurements[0]?.bodyFatPercent}% body fat</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-400" />
              <p className="font-bold text-white">Enrolled in {plan?.name}</p>
              <p className="text-[11px] text-slate-400">Account activated on {formatDate(member.joinDate)}</p>
            </div>
          </div>
        </div>
      )}

      {/* GST Invoice Modal */}
      <GSTInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        transaction={selectedInvoice}
      />
    </div>
  );
};
