import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Member, MemberStatus, Gender } from '../types';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  MoreVertical,
  Phone,
  Eye,
  RefreshCw,
  Snowflake,
  Play,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatINR, formatDate, openWhatsApp, exportToCSV } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export const Members: React.FC = () => {
  const {
    members,
    plans,
    trainers,
    addMember,
    updateMember,
    deleteMember,
    freezeMember,
    unfreezeMember,
    renewMember,
    assignTrainerToMember,
    recordPayment,
    addToast,
  } = useApp();

  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: 25,
    gender: 'male' as Gender,
    planId: plans[0]?.id || 'PLAN-M1',
    status: 'active' as MemberStatus,
    assignedTrainerId: trainers[0]?.id || 'TRN-101',
    fitnessGoal: 'General Fitness' as any,
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: 'Spouse',
    notes: '',
  });

  // Renew modal form state
  const [renewPlanId, setRenewPlanId] = useState(plans[0]?.id || 'PLAN-M1');
  const [renewPaymentMethod, setRenewPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Cash'>('UPI');

  // Collect payment form state
  const [paymentAmount, setPaymentAmount] = useState(2499);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Cash'>('UPI');

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    return members
      .filter(m => {
        const matchesSearch =
          m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.phone.includes(searchTerm) ||
          m.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        const matchesPlan = planFilter === 'all' || m.planId === planFilter;
        const matchesTrainer = trainerFilter === 'all' || m.assignedTrainerId === trainerFilter;

        return matchesSearch && matchesStatus && matchesPlan && matchesTrainer;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'name_desc') return b.fullName.localeCompare(a.fullName);
        if (sortBy === 'join_desc') return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        if (sortBy === 'balance_desc') return (b.outstandingBalance || 0) - (a.outstandingBalance || 0);
        if (sortBy === 'visits_desc') return (b.totalVisits || 0) - (a.totalVisits || 0);
        return 0;
      });
  }, [members, searchTerm, statusFilter, planFilter, trainerFilter, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const handleOpenAdd = () => {
    setFormData({
      fullName: '',
      phone: '+91-98',
      email: '',
      age: 26,
      gender: 'male',
      planId: plans[0]?.id || 'PLAN-M1',
      status: 'active',
      assignedTrainerId: trainers[0]?.id || 'TRN-101',
      fitnessGoal: 'Muscle Building',
      emergencyName: 'Family Contact',
      emergencyPhone: '+91-98000-00000',
      emergencyRelationship: 'Parent',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setSelectedMember(m);
    setFormData({
      fullName: m.fullName,
      phone: m.phone,
      email: m.email,
      age: m.age,
      gender: m.gender,
      planId: m.planId,
      status: m.status,
      assignedTrainerId: m.assignedTrainerId || trainers[0]?.id || '',
      fitnessGoal: m.fitnessGoal,
      emergencyName: m.emergencyContact?.name || '',
      emergencyPhone: m.emergencyContact?.phone || '',
      emergencyRelationship: m.emergencyContact?.relationship || 'Spouse',
      notes: m.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('Please fill in Member Name and Phone.');
      return;
    }

    const plan = plans.find(p => p.id === formData.planId) || plans[0];
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

    addMember({
      fullName: formData.fullName,
      avatar: formData.gender === 'male'
        ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      phone: formData.phone,
      email: formData.email || `${formData.fullName.toLowerCase().replace(' ', '.')}@gmail.com`,
      age: Number(formData.age),
      gender: formData.gender,
      joinDate: new Date().toISOString().split('T')[0],
      planId: formData.planId,
      status: formData.status,
      assignedTrainerId: formData.assignedTrainerId,
      emergencyContact: {
        name: formData.emergencyName || 'Guardian',
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone || formData.phone,
      },
      fitnessGoal: formData.fitnessGoal,
      lastAttendance: new Date().toISOString().split('T')[0],
      outstandingBalance: 0,
      expiryDate: expiryDate.toISOString().split('T')[0],
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 }, colors: ['#C6FF00', '#00F0FF', '#ffffff'] });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    updateMember(selectedMember.id, {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      age: Number(formData.age),
      gender: formData.gender,
      planId: formData.planId,
      status: formData.status,
      assignedTrainerId: formData.assignedTrainerId,
      fitnessGoal: formData.fitnessGoal,
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone,
      },
      notes: formData.notes,
    });

    setIsEditModalOpen(false);
  };

  const handleExecuteRenew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    renewMember(selectedMember.id, renewPlanId, renewPaymentMethod);
    setIsRenewModalOpen(false);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#C6FF00', '#00F0FF', '#ffffff'] });
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    recordPayment({
      memberId: selectedMember.id,
      planId: selectedMember.planId,
      amount: Number(paymentAmount),
      paymentMethod,
      notes: 'Counter payment received for membership balance',
    });
    setIsPaymentModalOpen(false);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#C6FF00', '#10B981', '#ffffff'] });
  };

  const handleExportCSV = () => {
    exportToCSV('techlifaa_members_master', filteredMembers, [
      { key: 'id', label: 'Member ID' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'planId', label: 'Plan Code' },
      { key: 'joinDate', label: 'Join Date' },
      { key: 'expiryDate', label: 'Expiry Date' },
      { key: 'totalVisits', label: 'Lifetime Visits' },
      { key: 'outstandingBalance', label: 'Outstanding Dues (INR)' },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
            Members Management CRM
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage 120 member records, renewals, assigned coaches, and emergency logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#C6FF00]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-dark-800/90 border border-slate-700/70 rounded-2xl shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, member ID, phone, email..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-dark-750 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-[#C6FF00]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="all">All Statuses ({members.length})</option>
              <option value="active">Active Only</option>
              <option value="expiring">Expiring This Week</option>
              <option value="expired">Expired</option>
              <option value="frozen">Frozen / Suspended</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={planFilter}
              onChange={e => {
                setPlanFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="all">All Plans</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="name_asc">Sort: Name (A to Z)</option>
              <option value="name_desc">Sort: Name (Z to A)</option>
              <option value="join_desc">Sort: Newest Enrolled</option>
              <option value="balance_desc">Sort: Highest Balance Due</option>
              <option value="visits_desc">Sort: Most Gym Visits</option>
            </select>
          </div>
        </div>

        {/* Quick count chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/50 text-[11px]">
          <span className="text-slate-400">Quick Filters:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${statusFilter === 'all' ? 'bg-[#C6FF00]/15 text-[#C6FF00] border-[#C6FF00]/40' : 'bg-dark-750 text-slate-300 border-slate-700'
              }`}
          >
            All ({members.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${statusFilter === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' : 'bg-dark-750 text-slate-300 border-slate-700'
              }`}
          >
            Active ({members.filter(m => m.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('expiring')}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${statusFilter === 'expiring' ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' : 'bg-dark-750 text-slate-300 border-slate-700'
              }`}
          >
            Expiring ({members.filter(m => m.status === 'expiring').length})
          </button>
          <button
            onClick={() => setStatusFilter('frozen')}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${statusFilter === 'frozen' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40' : 'bg-dark-750 text-slate-300 border-slate-700'
              }`}
          >
            Frozen ({members.filter(m => m.status === 'frozen').length})
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-dark-800/90 border border-slate-700/70 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Member Info</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Plan & Expiry</th>
                <th className="py-3.5 px-4">Assigned Coach</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Dues (₹)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750 text-slate-200">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No members found matching your search or filters.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map(member => {
                  const plan = plans.find(p => p.id === member.planId);
                  const trainer = trainers.find(t => t.id === member.assignedTrainerId);

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-dark-750/60 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/members/${member.id}`)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white group-hover:text-[#C6FF00] transition-colors">
                                {member.fullName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 bg-dark-900 px-1 rounded">
                                {member.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {member.age} yrs • {member.gender} • Goal: {member.fitnessGoal}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        <p className="font-mono text-slate-200">{member.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{member.email}</p>
                      </td>

                      {/* Plan & Expiry */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white">{plan?.name || 'Standard'}</p>
                        <p className="text-[11px] text-slate-400">
                          Expires: {formatDate(member.expiryDate)}
                        </p>
                      </td>

                      {/* Assigned Coach */}
                      <td className="py-3.5 px-4">
                        {trainer ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
                            <span className="font-medium text-slate-200">{trainer.name.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white">{member.totalVisits} visits</span>
                        <p className="text-[10px] text-slate-400">Last: {formatDate(member.lastAttendance)}</p>
                      </td>

                      {/* Outstanding Dues */}
                      <td className="py-3.5 px-4">
                        {member.outstandingBalance > 0 ? (
                          <span className="font-mono font-bold text-rose-400">
                            {formatINR(member.outstandingBalance)}
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-mono">Cleared</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${member.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : member.status === 'expiring'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : member.status === 'frozen'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openWhatsApp(member.phone, `Namaste ${member.fullName}! This is TECHLIFAA GYM checking in on your fitness streak.`)}
                            className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setPaymentAmount(member.outstandingBalance || 2499);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-dark-750 text-slate-300 hover:bg-[#C6FF00] hover:text-black transition-colors"
                            title="Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setRenewPlanId(member.planId);
                              setIsRenewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-dark-750 text-slate-300 hover:bg-cyan-500 hover:text-black transition-colors"
                            title="Renew Membership"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 rounded-lg bg-dark-750 text-slate-300 hover:bg-slate-700 transition-colors"
                            title="Edit Profile"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{Math.min(filteredMembers.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-white">{Math.min(filteredMembers.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-white">{filteredMembers.length}</strong> members
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-300 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl font-bold transition-colors ${currentPage === page
                    ? 'bg-[#C6FF00] text-black shadow-[0_0_10px_rgba(198,255,0,0.2)]'
                    : 'bg-dark-750 text-slate-300 hover:bg-dark-700'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-300 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Member"
        subtitle="Create an official membership profile with health goals and emergency contacts."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Kunal Singhania"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Phone Number (+91) *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-98201-XXXXX"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="kunal@example.com"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Membership Plan</label>
              <select
                value={formData.planId}
                onChange={e => setFormData({ ...formData, planId: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatINR(p.price)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Assigned Coach / Trainer</label>
              <select
                value={formData.assignedTrainerId}
                onChange={e => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Fitness Goal</label>
              <select
                value={formData.fitnessGoal}
                onChange={e => setFormData({ ...formData, fitnessGoal: e.target.value as any })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Fat Loss">Fat Loss & Calorie Burn</option>
                <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                <option value="Strength">Strength & Powerlifting</option>
                <option value="Endurance">Cardio & Athletic Endurance</option>
                <option value="Flexibility">Flexibility & Core Yoga</option>
                <option value="General Fitness">General Fitness & Wellness</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Emergency Contact Person</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                placeholder="Name & Relation"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Health Notes / Limitations</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Mild lower back sensitivity, prefers morning workouts."
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              Save Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Profile: ${selectedMember?.fullName}`}
        subtitle="Update member contact details, coach assignment, and status."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as MemberStatus })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="active">Active</option>
                <option value="expiring">Expiring</option>
                <option value="expired">Expired</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Coach</label>
              <select
                value={formData.assignedTrainerId}
                onChange={e => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Plan</label>
              <select
                value={formData.planId}
                onChange={e => setFormData({ ...formData, planId: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => {
                if (selectedMember && window.confirm(`Archive ${selectedMember.fullName}?`)) {
                  deleteMember(selectedMember.id);
                  setIsEditModalOpen(false);
                }
              }}
              className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Member</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Renew Modal */}
      <Modal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        title={`Renew Plan: ${selectedMember?.fullName}`}
        subtitle="Extend subscription and issue automated GST invoice."
        maxWidth="md"
      >
        <form onSubmit={handleExecuteRenew} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Select Renewal Package</label>
            <select
              value={renewPlanId}
              onChange={e => setRenewPlanId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.durationMonths} Months) — {formatINR(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Credit Card', 'Cash'] as const).map(method => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setRenewPaymentMethod(method)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${renewPaymentMethod === method
                      ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                      : 'bg-dark-800 text-slate-300 border-slate-700'
                    }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsRenewModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              Confirm & Collect Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Collect Payment: ${selectedMember?.fullName}`}
        subtitle={`Member ID: ${selectedMember?.id} • Pending Dues: ${formatINR(selectedMember?.outstandingBalance || 0)}`}
        maxWidth="md"
      >
        <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Amount to Collect (₹)</label>
            <input
              type="number"
              required
              value={paymentAmount}
              onChange={e => setPaymentAmount(Number(e.target.value))}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-bold text-white outline-none focus:border-[#C6FF00] font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Payment Channel</label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Credit Card', 'Cash'] as const).map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${paymentMethod === m
                      ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                      : 'bg-dark-800 text-slate-300 border-slate-700'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-dark-750 rounded-xl border border-slate-700 text-slate-300 text-[11px]">
            <p className="flex justify-between">
              <span>Base Amount (Taxable):</span>
              <span className="font-mono">{formatINR(Math.round(paymentAmount / 1.18))}</span>
            </p>
            <p className="flex justify-between mt-1">
              <span>GST 18% (CGST 9% + SGST 9%):</span>
              <span className="font-mono">{formatINR(paymentAmount - Math.round(paymentAmount / 1.18))}</span>
            </p>
            <p className="flex justify-between mt-1.5 font-bold text-white pt-1 border-t border-slate-700">
              <span>Total Received:</span>
              <span className="font-mono text-[#C6FF00]">{formatINR(paymentAmount)}</span>
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              Issue Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
