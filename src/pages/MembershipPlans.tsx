import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { MembershipPlan } from '../types';
import {
  CreditCard,
  Plus,
  Check,
  Tag,
  Users,
  Edit,
  Trash2,
  Percent,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatINR } from '../lib/utils';

export const MembershipPlans: React.FC = () => {
  const { plans, members, addPlan, updatePlan, deletePlan, addToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    durationMonths: 1,
    price: 2499,
    gstPercent: 18,
    description: '',
    featuresText: '',
    isPopular: false,
    discountCode: '',
    discountPercent: 0,
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      durationMonths: 3,
      price: 5999,
      gstPercent: 18,
      description: 'Full facility access with coaching guidance.',
      featuresText: 'All Gym Equipment Access\nFree Locker & Shower\n1 InBody Assessment',
      isPopular: false,
      discountCode: 'FIT10',
      discountPercent: 10,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      durationMonths: plan.durationMonths,
      price: plan.price,
      gstPercent: plan.gstPercent,
      description: plan.description,
      featuresText: plan.features.join('\n'),
      isPopular: plan.isPopular || false,
      discountCode: plan.discountCode || '',
      discountPercent: plan.discountPercent || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      alert('Plan Name and valid Price are required.');
      return;
    }

    const features = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name: formData.name,
        durationMonths: Number(formData.durationMonths),
        price: Number(formData.price),
        gstPercent: Number(formData.gstPercent),
        description: formData.description,
        features,
        isPopular: formData.isPopular,
        discountCode: formData.discountCode,
        discountPercent: Number(formData.discountPercent),
      });
    } else {
      addPlan({
        name: formData.name,
        durationMonths: Number(formData.durationMonths),
        price: Number(formData.price),
        gstPercent: Number(formData.gstPercent),
        description: formData.description,
        features,
        isPopular: formData.isPopular,
        discountCode: formData.discountCode,
        discountPercent: Number(formData.discountPercent),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Membership Plans & Pricing
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              Indian GST Compliant (18%)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure subscription tiers, seasonal discount codes, and VIP personal training packages.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* 5 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => {
          const activeCount = members.filter(m => m.planId === plan.id).length;
          const basePrice = Math.round(plan.price / 1.18);
          const gstAmount = plan.price - basePrice;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between relative group ${
                plan.isPopular
                  ? 'bg-dark-800 border-[#C6FF00]/60 shadow-[0_0_25px_rgba(198,255,0,0.15)] ring-1 ring-[#C6FF00]/40'
                  : 'bg-dark-800/90 border-slate-700/80 hover:border-slate-600 shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#C6FF00] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  MOST POPULAR (BEST VALUE)
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C6FF00] transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-750 text-slate-300 border border-slate-700 shrink-0">
                    {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-5 p-4 rounded-xl bg-dark-850 border border-slate-750">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-mono">{formatINR(plan.price)}</span>
                    <span className="text-xs text-slate-400">/ {plan.durationMonths}m</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-750">
                    <span>Base: {formatINR(basePrice)}</span>
                    <span>GST 18%: {formatINR(gstAmount)}</span>
                  </div>
                </div>

                {/* Promo Code Pill if available */}
                {plan.discountCode && (
                  <div className="mb-4 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{plan.discountCode}</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-semibold">
                      Save {plan.discountPercent}%
                    </span>
                  </div>
                )}

                {/* Features List */}
                <div className="space-y-2 text-xs">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Plan Highlights:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#C6FF00] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Active members & actions */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong className="text-white">{activeCount}</strong> Active Members
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="p-1.5 rounded-lg bg-dark-750 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Edit Plan"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete plan "${plan.name}"?`)) {
                        deletePlan(plan.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-dark-750 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create Membership Package'}
        subtitle="Set duration, Indian rupee pricing, GST rates, and promotional promo codes."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Plan Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Quarterly Pro Plus"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Duration (Months)</label>
              <input
                type="number"
                min="1"
                max="36"
                value={formData.durationMonths}
                onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Total Price in ₹ (GST Incl) *</label>
              <input
                type="number"
                min="100"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00] font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Brief Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Ideal for body transformation and endurance..."
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Promo Discount Code</label>
              <input
                type="text"
                value={formData.discountCode}
                onChange={e => setFormData({ ...formData, discountCode: e.target.value.toUpperCase() })}
                placeholder="e.g. DIWALI2024"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00] font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={e => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Features (One per line)</label>
            <textarea
              rows={4}
              value={formData.featuresText}
              onChange={e => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder="Unlimited Floor Access&#10;Yoga & Zumba Classes&#10;Steam & Sauna"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={formData.isPopular}
              onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
              className="w-4 h-4 rounded text-[#C6FF00] bg-dark-800 border-slate-700"
            />
            <label htmlFor="isPopular" className="text-xs text-slate-300 cursor-pointer">
              Mark as "Most Popular / Best Value" banner
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
