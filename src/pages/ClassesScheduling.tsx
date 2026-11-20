import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { FitnessClass, ClassCategory } from '../types';
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

export const ClassesScheduling: React.FC = () => {
  const { classes, trainers, members, bookClass, cancelClassBooking, addToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(null);
  const [memberToBookId, setMemberToBookId] = useState(members[0]?.id || '');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const categories: ClassCategory[] = [
    'Yoga',
    'Zumba',
    'HIIT',
    'CrossFit',
    'Strength Training',
    'Cardio',
  ];

  const filteredClasses = classes.filter(c => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesDay = selectedDay === 'all' || c.dayOfWeek === selectedDay;
    return matchesCat && matchesDay;
  });

  const handleOpenBook = (c: FitnessClass) => {
    setSelectedClass(c);
    setIsBookModalOpen(true);
  };

  const handleExecuteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !memberToBookId) return;

    const success = bookClass(selectedClass.id, memberToBookId);
    if (success) {
      setIsBookModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Classes & Timetable Scheduling
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              Weekly Schedule
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Group fitness reservations, Yoga, CrossFit WODs, Zumba dance floor, and studio capacity limits.
          </p>
        </div>
      </div>

      {/* Filter Tabs by Day */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs">
        <button
          onClick={() => setSelectedDay('all')}
          className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 font-semibold ${
            selectedDay === 'all'
              ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
              : 'bg-dark-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          All Days
        </button>
        {daysOfWeek.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 font-semibold ${
              selectedDay === day
                ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                : 'bg-dark-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Filter by Category */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] shrink-0">Category:</span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-dark-700 text-[#C6FF00] border-[#C6FF00]/40'
              : 'bg-dark-800 text-slate-400 border-slate-700'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-dark-700 text-[#C6FF00] border-[#C6FF00]/40'
                : 'bg-dark-800 text-slate-400 border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(c => {
          const isSoldOut = c.enrolledCount >= c.capacity;

          return (
            <div
              key={c.id}
              className={`rounded-2xl p-6 bg-dark-800/90 border transition-all duration-300 flex flex-col justify-between shadow-lg relative group ${
                isSoldOut ? 'border-amber-500/50' : 'border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-750 text-[#C6FF00] border border-[#C6FF00]/30 font-bold">
                    {c.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{c.dayOfWeek}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#C6FF00] transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>

                {/* Timing & Room info */}
                <div className="my-4 space-y-2 text-xs bg-dark-850 p-3.5 rounded-xl border border-slate-750">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-[#C6FF00]" />
                    <span className="font-mono font-medium">{c.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{c.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>
                      Coach: <strong className="text-white">{c.trainerName}</strong>
                    </span>
                  </div>
                </div>

                {/* Capacity Counter */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Class Capacity:</span>
                    <span className={`font-mono font-bold ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {c.enrolledCount} / {c.capacity} Enrolled
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isSoldOut ? 'bg-rose-500' : 'bg-[#C6FF00]'
                      }`}
                      style={{ width: `${Math.min(100, (c.enrolledCount / c.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-4 border-t border-slate-750 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isSoldOut ? 'Class Full' : `${c.capacity - c.enrolledCount} spots left`}
                </span>

                <button
                  onClick={() => handleOpenBook(c)}
                  disabled={isSoldOut}
                  className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black font-extrabold text-xs transition-colors disabled:opacity-40 shadow-sm"
                >
                  {isSoldOut ? 'Sold Out' : 'Book Member'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Member Into Class Modal */}
      {selectedClass && (
        <Modal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          title={`Reserve Seat: ${selectedClass.name}`}
          subtitle={`Day: ${selectedClass.dayOfWeek} • Time: ${selectedClass.timeSlot} • ${selectedClass.enrolledCount}/${selectedClass.capacity} Spots Booked`}
          maxWidth="md"
        >
          <form onSubmit={handleExecuteBooking} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Select Active Member</label>
              <select
                value={memberToBookId}
                onChange={e => setMemberToBookId(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.id}) • {m.fitnessGoal}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 bg-dark-750 rounded-xl border border-slate-700 text-slate-300 text-[11px] leading-relaxed">
              <p className="font-bold text-white mb-1">Class Guidelines:</p>
              <p>
                • Members must arrive at {selectedClass.room} 5 minutes before scheduled start time.
                <br />
                • Complimentary towels and mats provided.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
