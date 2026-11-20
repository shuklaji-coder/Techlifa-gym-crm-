import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  calculateChurnPredictions,
  analyzePeakHours,
} from '../lib/ai';
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Flame,
  Clock,
  Send,
  Share2,
  CheckCircle2,
  Users,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { formatINR, formatDate, openWhatsApp } from '../lib/utils';
import { Link } from 'react-router-dom';

export const AIIntelligenceCenter: React.FC = () => {
  const { members, leads, attendance, plans, settings, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'churn' | 'lead_scoring' | 'renewals' | 'peak_hours' | 'coach'>('churn');
  const [riskFilter, setRiskFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  // AI Churn analysis from actual members
  const churnPredictions = calculateChurnPredictions(members, settings.churnThresholdDays);
  const highRiskCount = churnPredictions.filter(c => c.riskLevel === 'High').length;
  const mediumRiskCount = churnPredictions.filter(c => c.riskLevel === 'Medium').length;

  const filteredChurn = churnPredictions.filter(c =>
    riskFilter === 'all' ? true : c.riskLevel === riskFilter
  );

  // Peak Hour Analysis
  const peakAnalysis = analyzePeakHours(attendance);

  // Renewal Predictor groups
  const renewalLikely = members.filter(m => m.status === 'active' && m.totalVisits > 20).slice(0, 5);
  const renewalNudge = members.filter(m => m.status === 'expiring').slice(0, 5);
  const renewalHighRisk = churnPredictions.filter(c => c.riskLevel === 'High').slice(0, 5);

  const handleSendRetention = (c: typeof churnPredictions[0]) => {
    openWhatsApp(c.phone, c.suggestedMessage);
    addToast('success', 'Offer Dispatched via WhatsApp', `Sent retention deal to ${c.memberName}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-[#C6FF00]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 rounded-full bg-[#C6FF00]/10 blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> NEURAL CRM INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400">100% Deterministic Rule-Based Math</span>
            </div>
            <h1 className="text-xl lg:text-3xl font-black text-white mt-1.5 tracking-tight font-display">
              TECHLIFAA AI Command & Intelligence Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time predictive analytics scanning all 120 member lifecycles, attendance drop-offs, lead closing probabilities, and peak hours.
            </p>
          </div>

          <Link
            to="/ai-advisor"
            className="px-4 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <span>Ask Business Advisor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Primary AI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="High Churn Risk Alerts"
          value={highRiskCount}
          change="Urgent Action"
          changeType="negative"
          subtitle={`${mediumRiskCount} moderate risk`}
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          badge="0-100 Score"
        />

        <StatCard
          title="Average Churn Risk"
          value="24.2%"
          change="-3.8% this month"
          changeType="positive"
          subtitle="Overall Member Pool"
          icon={<TrendingDown className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Hot Lead Pipeline"
          value={leads.filter(l => l.scoreLabel === 'Hot').length}
          change="> 75% Close Rate"
          changeType="positive"
          subtitle="40 Total Leads"
          icon={<Flame className="w-5 h-5 text-orange-400" />}
        />

        <StatCard
          title="Peak Capacity Load"
          value="85% @ 7:30 PM"
          change="Floor Congestion"
          changeType="neutral"
          subtitle="Optimization active"
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 overflow-x-auto whitespace-nowrap custom-scrollbar gap-1 text-xs">
        {[
          { key: 'churn', label: `AI Churn Predictor (${churnPredictions.length})`, icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
          { key: 'lead_scoring', label: `AI Lead Scoring (${leads.length})`, icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
          { key: 'renewals', label: 'AI Renewal Forecast', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
          { key: 'peak_hours', label: 'AI Peak-Hour Optimizer', icon: <TrendingUp className="w-3.5 h-3.5 text-[#C6FF00]" /> },
          { key: 'coach', label: 'AI Progress Coach', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all ${
              activeTab === t.key
                ? 'border-[#C6FF00] text-[#C6FF00] bg-dark-800/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: AI Churn Prediction Engine */}
      {activeTab === 'churn' && (
        <div className="space-y-4 text-xs">
          {/* Filter Bar */}
          <div className="p-3 bg-dark-800/90 border border-slate-700/70 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Filter by Risk Severity:</span>
              {(['all', 'High', 'Medium', 'Low'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    riskFilter === lvl
                      ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                      : 'bg-dark-750 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="text-slate-400 text-[11px]">Showing {filteredChurn.length} members</span>
          </div>

          {/* Churn Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChurn.map(c => (
              <div
                key={c.memberId}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-lg ${
                  c.riskLevel === 'High'
                    ? 'bg-dark-800/95 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                    : c.riskLevel === 'Medium'
                    ? 'bg-dark-800/90 border-amber-500/40'
                    : 'bg-dark-800/80 border-slate-700/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.memberAvatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.memberName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {c.memberId} • Phone: {c.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                          c.riskLevel === 'High'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : c.riskLevel === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        Risk: {c.riskScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Why at risk explanations */}
                  <div className="my-3.5 p-3 rounded-xl bg-dark-850 border border-slate-750 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Explainable Risk Factors:
                    </p>
                    {c.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Retention Offer */}
                  <div className="p-3 rounded-xl bg-dark-750 border border-slate-700/80 space-y-1">
                    <p className="text-[10px] font-bold text-[#C6FF00] uppercase tracking-wider">
                      Recommended Retention Deal:
                    </p>
                    <p className="font-semibold text-white text-xs">{c.recommendedOffer}</p>
                  </div>
                </div>

                {/* Footer action button */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Absent for {c.lastVisitDaysAgo} days
                  </span>

                  <button
                    onClick={() => handleSendRetention(c)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send Retention Offer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: AI Lead Scoring */}
      {activeTab === 'lead_scoring' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.slice(0, 9).map(lead => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-dark-800 border border-slate-700/80 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{lead.fullName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{lead.source}</p>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      lead.scoreLabel === 'Hot'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : lead.scoreLabel === 'Warm'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    🔥 {lead.score}% ({lead.scoreLabel})
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-850 text-slate-300 text-[11px] space-y-1">
                  <p>Goal: <strong className="text-white">{lead.fitnessGoal}</strong></p>
                  <p>Budget: <span className="font-mono text-[#C6FF00]">{lead.budget || 'Standard'}</span></p>
                  <p className="text-slate-400 leading-snug">"{lead.notes}"</p>
                </div>

                <div className="p-2 rounded-lg bg-dark-750 text-[11px] text-[#C6FF00]">
                  <strong>Recommended Action:</strong> Follow up regarding trial booking with Head Coach Vikram.
                </div>

                <button
                  onClick={() => openWhatsApp(lead.phone, `Namaste ${lead.fullName}! Free trial session booked for your ${lead.fitnessGoal} goals at TECHLIFAA GYM!`)}
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Pitch</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Renewal Predictor */}
      {activeTab === 'renewals' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Column 1: Likely to Renew */}
          <div className="p-4 rounded-2xl bg-dark-800 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wide">Likely to Renew (High LTV)</h4>
              <span className="font-mono text-[10px] text-slate-400">{renewalLikely.length} members</span>
            </div>
            <div className="space-y-2">
              {renewalLikely.map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                  <p className="font-semibold text-white">{m.fullName}</p>
                  <p className="text-[10px] text-slate-400">{m.totalVisits} visits • High streak</p>
                  <p className="text-[10px] text-emerald-400 mt-1">Suggested Contact: 2 days before expiry</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Needs a Nudge */}
          <div className="p-4 rounded-2xl bg-dark-800 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <h4 className="font-bold text-amber-400 uppercase tracking-wide">Needs a Friendly Nudge</h4>
              <span className="font-mono text-[10px] text-slate-400">{renewalNudge.length} members</span>
            </div>
            <div className="space-y-2">
              {renewalNudge.map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                  <p className="font-semibold text-white">{m.fullName}</p>
                  <p className="text-[10px] text-slate-400">Expires {formatDate(m.expiryDate)}</p>
                  <p className="text-[10px] text-amber-400 mt-1">Suggested: Offer 10% Early Bird Extension</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: High Cancellation Risk */}
          <div className="p-4 rounded-2xl bg-dark-800 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <h4 className="font-bold text-rose-400 uppercase tracking-wide">High Cancellation Risk</h4>
              <span className="font-mono text-[10px] text-slate-400">{renewalHighRisk.length} members</span>
            </div>
            <div className="space-y-2">
              {renewalHighRisk.map(c => (
                <div key={c.memberId} className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                  <p className="font-semibold text-white">{c.memberName}</p>
                  <p className="text-[10px] text-slate-400">Absent {c.lastVisitDaysAgo} days</p>
                  <p className="text-[10px] text-rose-400 mt-1">Suggested: Dispatch VIP 1-Month Free Deal</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Peak-Hour Optimizer */}
      {activeTab === 'peak_hours' && (
        <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/80 space-y-5 text-xs shadow-lg">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">AI Gym Floor Capacity & Traffic Insights</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated recommendations to relieve evening floor crowding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase">Busiest Surge Window</span>
              <p className="font-bold text-white text-sm">{peakAnalysis.busiestWindow}</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Quietest Window (Underutilized)</span>
              <p className="font-bold text-white text-sm">{peakAnalysis.quietestWindow}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-2">
            <h4 className="font-bold text-[#C6FF00] uppercase text-[11px]">AI Schedule Recommendations:</h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              {peakAnalysis.recommendations.map((rec, idx) => (
                <li key={idx} className="leading-relaxed">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: AI Progress Coach */}
      {activeTab === 'coach' && (
        <div className="p-5 rounded-2xl bg-dark-800/90 border border-slate-700/80 space-y-4 text-xs shadow-lg">
          <h3 className="text-base font-bold text-white tracking-wide">AI Weekly Member Progress Digest</h3>
          <p className="text-xs text-slate-400">
            Synthesized analysis of 120 member measurements and consistency benchmarks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Average Fat Loss</span>
              <span className="font-mono font-bold text-[#C6FF00] text-lg block">-1.8 kg</span>
              <span className="text-[10px] text-slate-400">Past 30-day cohort</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Strength Progression Rate</span>
              <span className="font-mono font-bold text-cyan-400 text-lg block">+11.4%</span>
              <span className="text-[10px] text-slate-400">Compound lifts volume</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Weekly Attendance Consistency</span>
              <span className="font-mono font-bold text-emerald-400 text-lg block">3.8 visits / wk</span>
              <span className="text-[10px] text-slate-400">Active member cohort</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
