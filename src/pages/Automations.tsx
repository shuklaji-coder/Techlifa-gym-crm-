import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AutomationRule } from '../types';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Edit,
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  Users,
  Eye,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/utils';

export const Automations: React.FC = () => {
  const {
    automations,
    toggleAutomation,
    updateAutomationTemplate,
    triggerAutomationTest,
    addToast,
  } = useApp();

  const [selectedAuto, setSelectedAuto] = useState<AutomationRule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateDraft, setTemplateDraft] = useState('');

  const handleOpenEdit = (auto: AutomationRule) => {
    setSelectedAuto(auto);
    setTemplateDraft(auto.template);
    setIsEditModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuto) return;
    updateAutomationTemplate(selectedAuto.id, templateDraft);
    setIsEditModalOpen(false);
  };

  const getPreviewText = (template: string) => {
    return template
      .replace(/{{name}}/g, 'Aarav Sharma')
      .replace(/{{expiry_date}}/g, '25 Nov 2024')
      .replace(/{{trainer_name}}/g, 'Vikram')
      .replace(/{{amount}}/g, '₹2,499')
      .replace(/{{invoice_number}}/g, 'INV-2024-1048')
      .replace(/{{payment_link}}/g, 'https://techlifaa.com/pay/MEM-1001');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Smart Automations & WhatsApp Workflows
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              5 WORKFLOWS CONFIGURED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated WhatsApp reminders for plan renewals, 7-day absence prevention, birthday surprises, and overdue fees.
          </p>
        </div>
      </div>

      {/* Automations Cards Grid */}
      <div className="space-y-4">
        {automations.map(auto => (
          <div
            key={auto.id}
            className={`rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
              auto.isActive
                ? 'bg-dark-800/95 border-slate-700/80 shadow-md'
                : 'bg-dark-850/60 border-slate-800 opacity-70'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      auto.isActive ? 'bg-[#C6FF00] animate-pulse shadow-[0_0_8px_#C6FF00]' : 'bg-slate-600'
                    }`}
                  />
                  <h3 className="text-base font-bold text-white tracking-wide">{auto.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-750 text-slate-300 border border-slate-700">
                    {auto.triggerCondition}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{auto.description}</p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400 font-medium">
                  {auto.isActive ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleAutomation(auto.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    auto.isActive ? 'bg-[#C6FF00]' : 'bg-dark-700'
                  }`}
                >
                  <div
                    className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      auto.isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Live Message Template Preview Card */}
            <div className="mt-4 p-4 rounded-xl bg-dark-850 border border-slate-750 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-[#C6FF00]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Message Preview (Dynamic Variables Substituted):</span>
                </span>
                <span className="font-mono text-slate-500">
                  Targeted Today: ~{auto.targetCount} recipients
                </span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed bg-dark-900/60 p-3 rounded-lg border border-slate-800">
                {getPreviewText(auto.template)}
              </p>
            </div>

            {/* Footer Row: Last Triggered & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 text-[11px]">
                Last Triggered: <strong className="text-white">{auto.lastTriggered || 'Today 10:15 AM'}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(auto)}
                  className="px-3.5 py-1.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-200 font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 text-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Template</span>
                </button>

                <button
                  onClick={() => triggerAutomationTest(auto.id)}
                  className="px-4 py-1.5 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black font-extrabold transition-all shadow-[0_0_12px_rgba(198,255,0,0.2)] flex items-center gap-1.5 text-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Run Workflow</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Automation Template Modal */}
      {selectedAuto && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Template: ${selectedAuto.title}`}
          subtitle="Customize the WhatsApp copy and personalize placeholder variables."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Message Copy (Supports WhatsApp emoji & formatting)
              </label>
              <textarea
                rows={5}
                required
                value={templateDraft}
                onChange={e => setTemplateDraft(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-[#C6FF00] font-sans leading-relaxed text-xs"
              />
            </div>

            <div className="p-3 bg-dark-750 rounded-xl border border-slate-700 text-slate-300 space-y-1">
              <p className="font-bold text-white text-[11px]">Available Variable Tags:</p>
              <p className="font-mono text-[10px] text-[#C6FF00]">
                {'{{name}} • {{expiry_date}} • {{trainer_name}} • {{amount}} • {{invoice_number}} • {{payment_link}}'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
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
                Save Template
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
