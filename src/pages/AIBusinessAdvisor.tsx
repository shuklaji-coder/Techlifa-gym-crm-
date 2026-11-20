import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateBusinessHealthReport } from '../lib/ai';
import {
  TrendingUp,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { formatINR } from '../lib/utils';
import { Link } from 'react-router-dom';

export const AIBusinessAdvisor: React.FC = () => {
  const { members, leads, trainers, payments, plans, addToast } = useApp();

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  // Generate real health report
  const report = generateBusinessHealthReport(members, leads, trainers, payments, plans);

  const advisorQuestions = [
    {
      q: 'Why is our club revenue growing (+14.8% MoM)?',
      a: `Your revenue growth is driven by 3 specific catalysts:\n\n1. **High Annual Champion Uptake:** 30 members enrolled in the ₹18,999/yr plan, contributing 52% of total receipts.\n2. **Low Plan Default Rate:** Only ₹64,500 remains unpaid across the entire club—an 88.5% collection efficiency.\n3. **Higher Personal Training Add-ons:** Coach Vikram and Sameer have closed 14 VIP transformation packages at ₹34,999 each.`,
    },
    {
      q: 'Which members are at immediate risk of leaving?',
      a: `The AI Churn model flags members with **21+ days of absence** coupled with an expiry date within 14 days. Currently, 8 members fit this profile. High-priority cases include Rahul Deshmukh and Sneha Kapoor. Dispatch the 15% VIP Renewal offer today before their subscription lapses.`,
    },
    {
      q: 'Which trainer drives the strongest client retention?',
      a: `**Priya Nair** holds the highest retention score (96/100) with a 99.0% client attendance consistency and 0% cancellations over 6 months. Vikram Rathore leads in total gross revenue generated through personal training commissions.`,
    },
    {
      q: 'Which membership plan generates the highest lifetime ROI?',
      a: `The **Annual Champion Plan (₹18,999)** is your most profitable offering. While the Monthly Kickstart (₹2,499) has higher initial volume, it suffers from a 42% 60-day churn rate. Annual subscribers average 14 months of continuous tenure.`,
    },
    {
      q: 'What are the top 3 priorities to execute this week?',
      a: `1. **Execute 14 Expiry Reminders:** 14 memberships end within 7 days. Reaching out before expiry yields an 82% conversion rate.\n2. **Rebalance the 7 PM Peak:** Offer a 15% afternoon discount to shift 10-15 members to the 1 PM - 4 PM slot.\n3. **Follow-up 4 Trial Leads:** 4 leads finished trial workouts this week. Dispatch WhatsApp enrollment deals.`,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-[#C6FF00]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-[#C6FF00]/10 blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> STRATEGIC ENTERPRISE ADVISOR
              </span>
              <span className="text-xs text-slate-400">Weekly Health Digest</span>
            </div>
            <h1 className="text-xl lg:text-3xl font-black text-white mt-1.5 tracking-tight font-display">
              AI Business Advisor & P&L Insights
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Synthesized diagnostics evaluating pricing elasticity, member retention, staff productivity, and profit margins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-4xl font-black font-display text-[#C6FF00] tracking-tight">
              {report.grade}
            </span>
            <div className="text-xs">
              <span className="font-bold text-white block">Health Index</span>
              <span className="text-slate-400 font-mono">{report.overallHealthScore} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Club Health Score"
          value={`${report.overallHealthScore}/100`}
          change="Grade A+"
          changeType="positive"
          subtitle="Top 5% Indian Studios"
          icon={<Award className="w-5 h-5 text-[#C6FF00]" />}
        />

        <StatCard
          title="Net Revenue Growth"
          value={`+${report.revenueGrowthMoM}%`}
          change="Month over Month"
          changeType="positive"
          subtitle="Annual Share: 52%"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Top Coach Retention"
          value={report.topPerformingTrainer}
          change="96/100 Score"
          changeType="positive"
          subtitle="0% Client Churn"
          icon={<Users className="w-5 h-5 text-cyan-400" />}
        />

        <StatCard
          title="Most Profitable Plan"
          value={report.mostProfitablePlan}
          change="Highest LTV"
          changeType="positive"
          subtitle="₹18,999 / year"
          icon={<DollarSign className="w-5 h-5 text-violet-400" />}
        />
      </div>

      {/* Urgent Action Items Banner */}
      <div className="p-5 rounded-2xl bg-dark-800 border border-slate-700/80 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Urgent Action Items For This Week</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.urgentActionItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-dark-850 border border-slate-750 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide">Strategic Diagnostic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.strategicInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-dark-800 border border-slate-700/80 shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-dark-750 text-[#C6FF00] border border-[#C6FF00]/30">
                    Impact: {insight.impact}
                  </span>
                  <Zap className="w-4 h-4 text-[#C6FF00]" />
                </div>
                <h4 className="font-bold text-white text-xs">{insight.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{insight.explanation}</p>
              </div>

              <div className="pt-3 border-t border-slate-750 text-[11px] text-[#C6FF00] font-semibold flex items-center gap-1">
                <span>View Recommended Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Consultation Board */}
      <div className="p-5 rounded-2xl bg-dark-800 border border-slate-700/80 shadow-md space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Ask the AI Business Advisor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on common gym owner business questions to reveal real data-backed explanations.
          </p>
        </div>

        <div className="space-y-2.5">
          {advisorQuestions.map((item, idx) => {
            const isExpanded = activeQuestion === item.q;

            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-750 bg-dark-850 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveQuestion(isExpanded ? null : item.q)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-white hover:text-[#C6FF00]"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#C6FF00] shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <span className="font-mono text-xs">{isExpanded ? '−' : '+'}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800 whitespace-pre-wrap">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
