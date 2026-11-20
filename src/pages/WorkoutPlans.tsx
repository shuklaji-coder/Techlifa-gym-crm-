import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { WorkoutPlan } from '../types';
import { generateAIWorkoutPlan, WorkoutGeneratorInput } from '../lib/ai';
import {
  Dumbbell,
  Sparkles,
  Plus,
  Printer,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

export const WorkoutPlans: React.FC = () => {
  const { workoutPlans, members, saveWorkoutPlan, assignWorkoutToMember, addToast } = useApp();

  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [assignMemberId, setAssignMemberId] = useState(members[0]?.id || '');

  // Generator inputs
  const [genInputs, setGenInputs] = useState<WorkoutGeneratorInput>({
    goal: 'Muscle Building',
    level: 'Intermediate',
    daysPerWeek: 5,
    equipment: ['Barbells', 'Dumbbells', 'Cables', 'Machines'],
    durationMinutes: 60,
    limitations: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newPlan = generateAIWorkoutPlan(genInputs);
      saveWorkoutPlan(newPlan);
      setIsGenerating(false);
      setIsGeneratorModalOpen(false);
      addToast('success', 'AI Workout Generated! ⚡', `${newPlan.title} is now in your library.`);
    }, 900);
  };

  const handleExecuteAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !assignMemberId) return;

    assignWorkoutToMember(selectedPlan.id, assignMemberId);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Workout Protocols & AI Generator
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30">
              AI ENGINE v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            4-week structured training splits, progressive overload volume tracking, and personalized AI routines.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Generate AI Workout</span>
        </button>
      </div>

      {/* Safety / Medical Disclaimer Alert */}
      <div className="p-3.5 rounded-xl bg-dark-800 border border-slate-700/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Professional Guidance Note:</strong> AI generated workout protocols are designed for athletic fitness conditioning. Any injury modifications or rehabilitation recommendations do not constitute formal medical advice.
        </p>
      </div>

      {/* Workout Plans List */}
      <div className="space-y-6">
        {workoutPlans.map(plan => (
          <div
            key={plan.id}
            className="rounded-2xl p-6 bg-dark-800/90 border border-slate-700/80 shadow-lg space-y-4"
          >
            {/* Plan Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display">{plan.title}</h3>
                  {plan.aiGenerated && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI GENERATED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Goal: <strong className="text-slate-200">{plan.goal}</strong> • Level: <strong className="text-slate-200">{plan.level}</strong> • {plan.daysPerWeek} Days/Week • {plan.durationWeeks} Weeks Split
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

            {/* Daily Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.days.map((day, dIdx) => (
                <div key={dIdx} className="p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="font-bold text-[#C6FF00] uppercase tracking-wide text-[11px]">
                      {day.dayName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{day.focus}</span>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {day.exercises.map((ex, eIdx) => (
                      <div key={eIdx} className="py-2 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white">{ex.name}</p>
                          <p className="text-[10px] text-slate-400">Target: {ex.targetMuscle}</p>
                          {ex.notes && <p className="text-[10px] text-amber-400/90 italic mt-0.5">Note: {ex.notes}</p>}
                        </div>
                        <div className="text-right font-mono text-[11px] shrink-0">
                          <span className="text-[#C6FF00] font-bold">{ex.sets}</span> × {ex.reps}
                          <span className="text-slate-500 block text-[9px]">{ex.restSeconds}s rest</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Workout Generator Modal */}
      <Modal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        title="AI Workout Protocol Generator"
        subtitle="Generates an individualized 4-week split based on exercise science and biomechanics."
        maxWidth="lg"
      >
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Fitness Goal *</label>
              <select
                value={genInputs.goal}
                onChange={e => setGenInputs({ ...genInputs, goal: e.target.value })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                <option value="Fat Loss & Shred">Fat Loss & Metabolic Conditioning</option>
                <option value="Raw Strength">Raw Strength & Powerlifting</option>
                <option value="Athletic Endurance">Athletic Endurance & Conditioning</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Experience Level</label>
              <select
                value={genInputs.level}
                onChange={e => setGenInputs({ ...genInputs, level: e.target.value as any })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="Beginner">Beginner (0 - 6 Months)</option>
                <option value="Intermediate">Intermediate (6 - 24 Months)</option>
                <option value="Advanced">Advanced (2+ Years)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Workout Frequency (Days/Week)</label>
              <select
                value={genInputs.daysPerWeek}
                onChange={e => setGenInputs({ ...genInputs, daysPerWeek: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value={3}>3 Days / Week (Full Body)</option>
                <option value={4}>4 Days / Week (Upper / Lower)</option>
                <option value={5}>5 Days / Week (Push / Pull / Legs)</option>
                <option value={6}>6 Days / Week (PPL Arnold Split)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Session Duration</label>
              <select
                value={genInputs.durationMinutes}
                onChange={e => setGenInputs({ ...genInputs, durationMinutes: Number(e.target.value) })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value={45}>45 Minutes (Express)</option>
                <option value={60}>60 Minutes (Standard)</option>
                <option value={75}>75 Minutes (High Volume)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Limitations, Prior Injuries, or Knee/Back Sensitivity (Optional)
            </label>
            <input
              type="text"
              value={genInputs.limitations}
              onChange={e => setGenInputs({ ...genInputs, limitations: e.target.value })}
              placeholder="e.g. Mild knee clicking on deep squats, avoid heavy overhead barbell press"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
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
              <span>{isGenerating ? 'Building 4-Week Split...' : 'Generate Protocol'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign to Member Modal */}
      {selectedPlan && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={`Assign Routine: ${selectedPlan.title}`}
          subtitle="Directly link this protocol to a member's active profile."
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
