import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Trainer } from '../types';
import {
  UserCheck2,
  Plus,
  Star,
  Users,
  Calendar,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Share2,
  Edit,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { openWhatsApp } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Trainers: React.FC = () => {
  const { trainers, members } = useApp();
  const navigate = useNavigate();

  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Trainers & Floor Coaches
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              6 Certified Coaches
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor coach client loads, monthly retention metrics, shift timings, and member satisfaction ratings.
          </p>
        </div>

        <button
          onClick={() => alert('New trainer enrollment module ready.')}
          className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainer</span>
        </button>
      </div>

      {/* Trainers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map(trainer => {
          const assignedMembers = members.filter(m => m.assignedTrainerId === trainer.id);

          return (
            <div
              key={trainer.id}
              className="rounded-2xl p-6 bg-dark-800/90 border border-slate-700/80 hover:border-slate-600 transition-all duration-300 flex flex-col justify-between shadow-lg group relative overflow-hidden"
            >
              <div>
                {/* Header row with avatar, name & rating */}
                <div className="flex items-start gap-4">
                  <img
                    src={trainer.avatar}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-600 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base truncate group-hover:text-[#C6FF00] transition-colors">
                        {trainer.name}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {trainer.experienceYears} Years Exp • {trainer.schedule}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#C6FF00] bg-[#C6FF00]/10 px-2 py-0.5 rounded border border-[#C6FF00]/30">
                        <Star className="w-3 h-3 fill-[#C6FF00]" />
                        {trainer.rating} / 5.0
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {trainer.attendanceRate}% Attendance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specializations Badges */}
                <div className="flex flex-wrap gap-1.5 my-4">
                  {trainer.specialization.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-dark-750 text-slate-300 border border-slate-700 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {trainer.bio}
                </p>

                {/* Performance & Client load bar */}
                <div className="my-4 p-3 rounded-xl bg-dark-850 border border-slate-750 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Assigned Clients:</span>
                    <strong className="text-white font-mono">{assignedMembers.length} Active</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Performance Score:</span>
                    <strong className="text-[#C6FF00] font-mono">{trainer.monthlyPerformanceScore} / 100</strong>
                  </div>
                  <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#C6FF00] rounded-full"
                      style={{ width: `${trainer.monthlyPerformanceScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: WhatsApp & View Clients */}
              <div className="pt-3 border-t border-slate-750 flex items-center justify-between text-xs">
                <button
                  onClick={() => openWhatsApp(trainer.phone, `Namaste Coach ${trainer.name.split(' ')[0]}! TECHLIFAA GYM admin checking in regarding today's client slots.`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5 font-semibold text-[11px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Coach</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTrainer(trainer);
                    setIsEditModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-dark-750 hover:bg-slate-700 text-slate-200 transition-colors text-[11px] font-semibold"
                >
                  View Clients ({assignedMembers.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trainer Assigned Clients Modal */}
      {selectedTrainer && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Coach: ${selectedTrainer.name}`}
          subtitle={`Assigned Members Portfolio (${members.filter(m => m.assignedTrainerId === selectedTrainer.id).length} Active Clients)`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-dark-850 rounded-xl border border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{selectedTrainer.name}</p>
                <p className="text-[11px] text-[#C6FF00]">{selectedTrainer.schedule} Shift</p>
              </div>
              <span className="font-mono text-xs bg-dark-800 px-2 py-1 rounded text-slate-300 border border-slate-700">
                {selectedTrainer.phone}
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {members
                .filter(m => m.assignedTrainerId === selectedTrainer.id)
                .map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setIsEditModalOpen(false);
                      navigate(`/members/${m.id}`);
                    }}
                    className="p-2.5 rounded-xl bg-dark-750 hover:bg-dark-700 border border-slate-750 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-white">{m.fullName}</p>
                        <p className="text-[10px] text-slate-400">
                          {m.id} • Goal: {m.fitnessGoal}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
