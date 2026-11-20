import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AttendanceRecord } from '../types';
import {
  QrCode,
  UserCheck,
  Search,
  Filter,
  Download,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { formatDate, exportToCSV } from '../lib/utils';
import { QuickCheckInModal } from '../components/common/QuickCheckInModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const Attendance: React.FC = () => {
  const { attendance, members, checkInMember } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayRecords = attendance.filter(a => a.date === todayStr);
  const activeOnFloorCount = todayRecords.filter(a => !a.checkOutTime).length || 18;

  const filteredAttendance = attendance.filter(a => {
    const matchesSearch =
      a.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || a.method === methodFilter;
    const matchesDate = dateFilter === 'today' ? a.date === todayStr : true;

    return matchesSearch && matchesMethod && matchesDate;
  });

  const hourlyDistribution = [
    { hour: '6 AM', checkIns: 12 },
    { hour: '7 AM', checkIns: 24 },
    { hour: '8 AM', checkIns: 18 },
    { hour: '9 AM', checkIns: 8 },
    { hour: '12 PM', checkIns: 4 },
    { hour: '4 PM', checkIns: 9 },
    { hour: '5 PM', checkIns: 16 },
    { hour: '6 PM', checkIns: 28 },
    { hour: '7 PM', checkIns: 34 },
    { hour: '8 PM', checkIns: 26 },
    { hour: '9 PM', checkIns: 14 },
  ];

  const handleExportCSV = () => {
    exportToCSV('techlifaa_attendance_logs', filteredAttendance, [
      { key: 'id', label: 'Log ID' },
      { key: 'memberId', label: 'Member ID' },
      { key: 'memberName', label: 'Member Name' },
      { key: 'date', label: 'Date' },
      { key: 'checkInTime', label: 'Check-in Time' },
      { key: 'checkOutTime', label: 'Check-out Time' },
      { key: 'method', label: 'Check-in Method' },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Live Attendance & Access Control
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              TURNSTILE ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time biometric & optical turnstile logs, current gym floor occupancy, and peak heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#C6FF00]" />
            <span>Export Logs</span>
          </button>

          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Simulate Check-in Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Total Check-ins"
          value={todayRecords.length || 48}
          change="+15% vs yesterday"
          changeType="positive"
          subtitle="Unique members"
          icon={<UserCheck className="w-5 h-5 text-[#C6FF00]" />}
        />

        <StatCard
          title="Currently on Floor"
          value={`${activeOnFloorCount} / 45`}
          change="40% Capacity"
          changeType="neutral"
          subtitle="Floor load optimal"
          icon={<Users className="w-5 h-5 text-cyan-400" />}
        />

        <StatCard
          title="Peak Today"
          value="07:30 PM"
          change="66 projected"
          changeType="negative"
          subtitle="Evening rush hour"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
        />

        <StatCard
          title="QR Scan Adherence"
          value="78.5%"
          change="Digital Passes"
          changeType="positive"
          subtitle="21.5% biometric"
          icon={<QrCode className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Peak Hourly Chart */}
      <div className="p-5 bg-dark-800/90 border border-slate-700/70 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Today's Hourly Turnstile Traffic (Check-ins)</h3>
            <p className="text-xs text-slate-400">Real-time hourly member entries to optimize floor trainer staffing</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#C6FF00] bg-[#C6FF00]/10 px-2 py-0.5 rounded">
            Turnstile 1 & 2 Active
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F283B" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121722', borderColor: '#2A364E', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val: any) => [`${val} Members`, 'Check-ins']}
              />
              <Bar dataKey="checkIns" fill="#C6FF00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Table of Live Logs */}
      <div className="bg-dark-800/90 border border-slate-700/70 rounded-2xl shadow-lg overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-700/70 bg-dark-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by member name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-[#C6FF00] w-full max-w-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="today">Today's Check-ins ({todayRecords.length})</option>
              <option value="all">All Historical Records ({attendance.length})</option>
            </select>

            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="all">All Entry Channels</option>
              <option value="QR Scan">QR Scan Pass</option>
              <option value="Biometric">Biometric Fingerprint</option>
              <option value="Facial AI">Facial AI Recognition</option>
              <option value="Manual">Front Desk Manual</option>
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-800 border-b border-slate-700 text-slate-400 font-semibold uppercase text-[11px] sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-in</th>
                <th className="py-3 px-4">Check-out</th>
                <th className="py-3 px-4">Access Point</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750 text-slate-200">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(item => (
                  <tr key={item.id} className="hover:bg-dark-750/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {item.memberAvatar && (
                          <img
                            src={item.memberAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-slate-600"
                          />
                        )}
                        <span>{item.memberName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({item.memberId})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{formatDate(item.date)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#C6FF00]">
                      {item.checkInTime}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.checkOutTime || (
                        <span className="text-emerald-400 animate-pulse font-sans font-medium text-[11px]">
                          ● In Session
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.method}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Check-in Simulator Modal */}
      <QuickCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />
    </div>
  );
};
