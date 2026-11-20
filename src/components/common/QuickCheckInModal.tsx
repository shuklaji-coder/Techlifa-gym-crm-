import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../ui/Modal';
import confetti from 'canvas-confetti';
import { QrCode, Search, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ isOpen, onClose }) => {
  const { members, checkInMember } = useApp();
  const [memberQuery, setMemberQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<any>(null);

  const matchedMembers = memberQuery.trim()
    ? members.filter(
        m =>
          m.fullName.toLowerCase().includes(memberQuery.toLowerCase()) ||
          m.id.toLowerCase().includes(memberQuery.toLowerCase()) ||
          m.phone.includes(memberQuery)
      ).slice(0, 5)
    : members.slice(0, 4);

  const handleSimulateQRScan = () => {
    setScanning(true);
    setTimeout(() => {
      // Pick random active member
      const activeMems = members.filter(m => m.status === 'active');
      const randomMember = activeMems[Math.floor(Math.random() * activeMems.length)];
      if (randomMember) {
        checkInMember(randomMember.id, 'QR Scan');
        setLastCheckIn(randomMember);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#C6FF00', '#10B981', '#ffffff'],
        });
      }
      setScanning(false);
    }, 1000);
  };

  const handleManualCheckIn = (memberId: string) => {
    const mem = members.find(m => m.id === memberId);
    if (mem) {
      checkInMember(memberId, 'Manual');
      setLastCheckIn(mem);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Turnstile / Check-in Console"
      subtitle="Simulate real-time turnstile entry, mobile QR scanner, or manual front desk check-in."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* QR Scan Simulator Card */}
        <div className="p-5 rounded-2xl bg-dark-850 border border-slate-700/80 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C6FF00] to-transparent" />

          <div className="mx-auto w-24 h-24 rounded-2xl bg-dark-800 border-2 border-dashed border-[#C6FF00]/50 flex items-center justify-center p-3 relative shadow-[0_0_20px_rgba(198,255,0,0.1)]">
            <QrCode className={`w-14 h-14 text-[#C6FF00] ${scanning ? 'animate-pulse' : ''}`} />
            {scanning && (
              <div className="absolute inset-0 bg-[#C6FF00]/10 flex items-center justify-center">
                <span className="w-full h-0.5 bg-[#C6FF00] animate-ping" />
              </div>
            )}
          </div>

          <h4 className="text-sm font-bold text-white mt-3">Optical Turnstile Scanner</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Supports member mobile app QR codes, RFID cards, and biometric facial scan.
          </p>

          <button
            onClick={handleSimulateQRScan}
            disabled={scanning}
            className="mt-4 px-5 py-2.5 bg-[#C6FF00] text-black font-extrabold text-xs rounded-xl hover:bg-[#B5EB00] transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{scanning ? 'Reading QR Signal...' : 'Simulate Live QR Scan'}</span>
          </button>
        </div>

        {/* Recent Instant Success Feedback */}
        {lastCheckIn && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">Checked In: {lastCheckIn.fullName}</p>
                <p className="text-[10px] text-emerald-400">
                  {lastCheckIn.id} • Plan: Active • Visits: {lastCheckIn.totalVisits}
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
              GRANTED
            </span>
          </div>
        )}

        {/* Manual Member Search / ID Entry */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Or Search Member by Name / ID / Phone:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Aarav or MEM-1005 or 98201..."
              value={memberQuery}
              onChange={e => setMemberQuery(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {matchedMembers.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded-xl bg-dark-750 hover:bg-dark-700 border border-slate-750 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img src={m.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-white">{m.fullName}</p>
                    <p className="text-[10px] text-slate-400">
                      {m.id} • {m.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleManualCheckIn(m.id)}
                  className="px-2.5 py-1 bg-dark-800 hover:bg-[#C6FF00] hover:text-black text-slate-200 border border-slate-700 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Check In</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
