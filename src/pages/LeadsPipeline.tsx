import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Lead, LeadStage, LeadSource } from '../types';
import confetti from 'canvas-confetti';
import {
  GitPullRequest,
  Plus,
  Phone,
  Flame,
  Calendar,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Trash2,
  Share2,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  XCircle,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatDate, openWhatsApp, formatINR } from '../lib/utils';

export const LeadsPipeline: React.FC = () => {
  const {
    leads,
    trainers,
    plans,
    addLead,
    updateLead,
    deleteLead,
    moveLeadStage,
    convertLeadToMember,
    addToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [convertPlanId, setConvertPlanId] = useState(plans[0]?.id || 'PLAN-M1');

  // Drag and drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Add lead form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    source: 'Instagram' as LeadSource,
    stage: 'new' as LeadStage,
    followUpDate: new Date().toISOString().split('T')[0],
    fitnessGoal: 'Fat Loss',
    notes: '',
    budget: '₹12,000 - ₹18,000',
    assignedTrainerId: trainers[0]?.id || '',
  });

  const stages: { id: LeadStage; title: string; color: string; badgeColor: string }[] = [
    { id: 'new', title: 'New Leads', color: 'border-blue-500/30 bg-blue-500/5', badgeColor: 'bg-blue-500/20 text-blue-400' },
    { id: 'contacted', title: 'Contacted', color: 'border-amber-500/30 bg-amber-500/5', badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'trial_booked', title: 'Trial Booked', color: 'border-[#C6FF00]/40 bg-[#C6FF00]/5', badgeColor: 'bg-[#C6FF00]/20 text-[#C6FF00]' },
    { id: 'joined', title: 'Joined / Converted', color: 'border-emerald-500/30 bg-emerald-500/5', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'lost', title: 'Lost / Dormant', color: 'border-slate-700/60 bg-dark-850', badgeColor: 'bg-slate-800 text-slate-400' },
  ];

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.fitnessGoal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: LeadStage) => {
    if (draggedLeadId) {
      moveLeadStage(draggedLeadId, stageId);
      setDraggedLeadId(null);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      fullName: '',
      phone: '+91-98',
      email: '',
      source: 'Instagram',
      stage: 'new',
      followUpDate: new Date().toISOString().split('T')[0],
      fitnessGoal: 'Muscle Building',
      notes: '',
      budget: '₹18,000 (Annual)',
      assignedTrainerId: trainers[0]?.id || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('Name and Phone are required.');
      return;
    }

    addLead({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || `${formData.fullName.toLowerCase().replace(' ', '.')}@gmail.com`,
      source: formData.source,
      stage: formData.stage,
      followUpDate: formData.followUpDate,
      fitnessGoal: formData.fitnessGoal,
      notes: formData.notes,
      budget: formData.budget,
      assignedTrainerId: formData.assignedTrainerId,
    });

    setIsAddModalOpen(false);
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    convertLeadToMember(selectedLead.id, convertPlanId);
    setIsConvertModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#C6FF00', '#00F0FF', '#FFB800', '#ffffff'],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Leads & Sales Pipeline
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              {leads.length} Leads
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive Kanban pipeline with automated WhatsApp templates, lead scoring, and 1-click member enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3 bg-dark-800/90 border border-slate-700/70 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or goal..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs w-full placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Source:</span>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="bg-dark-750 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#C6FF00]"
          >
            <option value="all">All Sources</option>
            <option value="Instagram">Instagram</option>
            <option value="Google Search">Google Search</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Member Referral">Member Referral</option>
            <option value="Facebook Ads">Facebook Ads</option>
          </select>
        </div>
      </div>

      {/* Kanban Board (5 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
              className={`rounded-2xl border p-3 flex flex-col justify-between min-h-[580px] ${stage.color}`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
                  <h3 className="font-bold text-white text-xs tracking-wide">{stage.title}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${stage.badgeColor}`}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="py-10 text-center text-slate-500 text-[11px] border border-dashed border-slate-800 rounded-xl">
                      Drag lead cards here
                    </div>
                  ) : (
                    stageLeads.map(lead => {
                      const trainer = trainers.find(t => t.id === lead.assignedTrainerId);

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead.id)}
                          className="p-3.5 rounded-xl bg-dark-800 border border-slate-700/80 shadow-md hover:border-slate-500 transition-all cursor-grab active:cursor-grabbing text-xs space-y-2.5 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-white group-hover:text-[#C6FF00] transition-colors">
                                {lead.fullName}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {lead.source} • Goal: {lead.fitnessGoal}
                              </p>
                            </div>

                            {/* Lead Score Pill */}
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${lead.scoreLabel === 'Hot'
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : lead.scoreLabel === 'Warm'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                            >
                              🔥 {lead.score}%
                            </span>
                          </div>

                          {lead.notes && (
                            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 bg-dark-850 p-2 rounded-lg border border-slate-800">
                              "{lead.notes}"
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-750">
                            <span>Follow-up: {formatDate(lead.followUpDate, 'dd MMM')}</span>
                            {lead.budget && (
                              <span className="font-mono text-slate-300">{lead.budget}</span>
                            )}
                          </div>

                          {/* Quick Actions Row */}
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  const text = `Namaste ${lead.fullName}! This is TECHLIFAA GYM following up regarding your ${lead.fitnessGoal} goals. Are you free for a complimentary trial workout with our head coach tomorrow?`;
                                  openWhatsApp(lead.phone, text);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </button>

                              {lead.stage !== 'joined' && (
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setIsConvertModalOpen(true);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-[#C6FF00]/15 hover:bg-[#C6FF00] hover:text-black text-[#C6FF00] font-semibold text-[10px] transition-colors border border-[#C6FF00]/30"
                                  title="Enroll as Active Member"
                                >
                                  Convert
                                </button>
                              )}
                            </div>

                            {/* Stage shift dropdown */}
                            <select
                              value={lead.stage}
                              onChange={e => moveLeadStage(lead.id, e.target.value as LeadStage)}
                              className="bg-dark-750 text-[10px] text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 outline-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="trial_booked">Trial</option>
                              <option value="joined">Joined</option>
                              <option value="lost">Lost</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Convert Lead to Member Modal */}
      <Modal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        title={`Enroll Lead as Member: ${selectedLead?.fullName}`}
        subtitle="Converts this lead into an active member and records their initial payment."
        maxWidth="md"
      >
        <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Select Membership Package</label>
            <select
              value={convertPlanId}
              onChange={e => setConvertPlanId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.durationMonths} Months) — {formatINR(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-dark-750 rounded-xl border border-slate-700 text-slate-300">
            <p className="font-semibold text-white">Conversion Automation:</p>
            <ul className="mt-1 space-y-1 text-[11px] list-disc list-inside text-slate-400">
              <li>Generates official Member ID (e.g. MEM-1121)</li>
              <li>Generates GST Tax Invoice and receipt</li>
              <li>Moves lead status to <strong>JOINED</strong></li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsConvertModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              Confirm Enrollment & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Sales Lead"
        subtitle="Capture incoming lead inquiry from walk-in, social media, or referrals."
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Rohan Chopra"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Phone (+91) *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-98200-XXXXX"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Lead Source</label>
              <select
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value as LeadSource })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Instagram">Instagram</option>
                <option value="Google Search">Google Search</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Member Referral">Member Referral</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Flyer / Offline">Flyer / Offline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Fitness Goal</label>
              <input
                type="text"
                value={formData.fitnessGoal}
                onChange={e => setFormData({ ...formData, fitnessGoal: e.target.value })}
                placeholder="e.g. Weight Loss / Zumba"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Lead Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Inquired about morning batches and personal training fees..."
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              Add to Pipeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
