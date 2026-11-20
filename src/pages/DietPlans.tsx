import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { DietPlan } from '../types';
import { generateAIDietPlan, DietPlannerInput } from '../lib/ai';
import {
  UtensilsCrossed,
  Sparkles,
  Printer,
  Users,
  PieChart,
  ShieldAlert,
  Flame,
  Award,
  Plus,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

export const DietPlans: React.FC = () => {
  const { dietPlans, members, saveDietPlan, assignDietToMember, addToast } = useApp();

  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [assignMemberId, setAssignMemberId] = useState(members[0]?.id || '');

  // Generator inputs
  const [genInputs, setGenInputs] = useState<DietPlannerInput>({
    dietType: 'Vegetarian',
    dailyCalories: 2200,
    goal: 'Lean Muscle & Strength',
    budgetTier: 'Budget-Friendly',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newPlan = generateAIDietPlan(genInputs);
      saveDietPlan(newPlan);
      setIsGenerating(false);
      setIsGeneratorModalOpen(false);
      addToast('success', 'AI Diet Plan Created! 🥗', `${newPlan.title} is now available.`);
    }, 900);
  };

  const handleExecuteAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !assignMemberId) return;

    assignDietToMember(selectedPlan.id, assignMemberId);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Indian Diet Plans & AI Macro Blueprint
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              VEG / NON-VEG / JAIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Macro-targeted nutrition tailored for Indian diets, budget-friendly protein sources, and meal schedules.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Generate AI Diet Plan</span>
        </button>
      </div>

      {/* Calorie Approximation & Nutrition Disclaimer */}
      <div className="p-3.5 rounded-xl bg-dark-800 border border-slate-700/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Notice:</strong> All calorie, protein, carbohydrate, and fat counts are approximate estimates based on standard Indian Food Composition Tables (IFCT). Individual metabolic rates and cooking styles may vary.
        </p>
      </div>

      {/* Diet Plans List */}
      <div className="space-y-6">
        {dietPlans.map(plan => (
          <div
            key={plan.id}
            className="rounded-2xl p-6 bg-dark-800/90 border border-slate-700/80 shadow-lg space-y-4"
          >
            {/* Plan Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display">{plan.title}</h3>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      plan.dietType === 'Vegetarian'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : plan.dietType === 'Jain'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {plan.dietType}
                  </span>
                  {plan.aiGenerated && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI FORMULATED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Budget: <strong className="text-slate-200">{plan.budgetTier}</strong> • Total Daily Target: ~{plan.dailyCalories} kcal
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsAssignModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Assign to Member</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Macro Summary Strip */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                <span className="text-slate-400 text-[10px] block">Daily Calories</span>
                <span className="font-mono font-bold text-white text-sm mt-0.5 block">{plan.dailyCalories} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                <span className="text-slate-400 text-[10px] block">Protein</span>
                <span className="font-mono font-bold text-[#C6FF00] text-sm mt-0.5 block">{plan.proteinGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                <span className="text-slate-400 text-[10px] block">Carbohydrates</span>
                <span className="font-mono font-bold text-cyan-400 text-sm mt-0.5 block">{plan.carbsGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-750">
                <span className="text-slate-400 text-[10px] block">Healthy Fats</span>
                <span className="font-mono font-bold text-amber-400 text-sm mt-0.5 block">{plan.fatsGrams}g</span>
              </div>
            </div>

            {/* Meals List */}
            <div className="space-y-3">
              {plan.meals.map((meal, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#C6FF00] uppercase bg-[#C6FF00]/10 px-2 py-0.5 rounded border border-[#C6FF00]/30">
                      {meal.mealType}
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">
                      ~{meal.calories} kcal • <strong className="text-[#C6FF00]">{meal.proteinGrams}g P</strong> • {meal.carbsGrams}g C • {meal.fatsGrams}g F
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{meal.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{meal.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Diet Generator Modal */}
      <Modal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        title="AI Indian Nutrition & Diet Generator"
        subtitle="Formulates a macronutrient-calibrated Indian meal plan based on dietary preferences."
        maxWidth="lg"
      >
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Dietary Restriction *</label>
              <select
                value={genInputs.dietType}
                onChange={e => setGenInputs({ ...genInputs, dietType: e.target.value as any })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Vegetarian">Pure Vegetarian (High Paneer/Dal/Soya)</option>
                <option value="Non-Vegetarian">Non-Vegetarian (Eggs/Chicken/Fish)</option>
                <option value="Jain">Pure Jain (No Root Veg, No Onion/Garlic)</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Target Calories / Day</label>
              <input
                type="number"
                min="1400"
                max="4000"
                step="50"
                value={genInputs.dailyCalories}
                onChange={e => setGenInputs({ ...genInputs, dailyCalories: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Fitness Goal</label>
              <select
                value={genInputs.goal}
                onChange={e => setGenInputs({ ...genInputs, goal: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Lean Muscle & Strength">Lean Muscle & Strength (High Protein)</option>
                <option value="Aggressive Fat Loss">Aggressive Fat Loss (Caloric Deficit)</option>
                <option value="Clean Bulk">Clean Bulk & Hypertrophy</option>
                <option value="Endurance & Recovery">Endurance & Recovery</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Budget Tier</label>
              <select
                value={genInputs.budgetTier}
                onChange={e => setGenInputs({ ...genInputs, budgetTier: e.target.value as any })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Budget-Friendly">Budget-Friendly (Soya, Chana, Eggs, Dal, Paneer)</option>
                <option value="Standard">Standard (Greek Yogurt, Whey, Chicken, Fish)</option>
                <option value="Premium">Premium (Imported Salmon, Almond Flour, Superfoods)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsGeneratorModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00] flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling Macro Blueprint...' : 'Generate Meal Plan'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign to Member Modal */}
      {selectedPlan && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={`Assign Diet: ${selectedPlan.title}`}
          subtitle="Directly link this meal blueprint to a member's active profile."
          maxWidth="md"
        >
          <form onSubmit={handleExecuteAssign} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Select Member</label>
              <select
                value={assignMemberId}
                onChange={e => setAssignMemberId(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.id}) • Goal: {m.fitnessGoal}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
