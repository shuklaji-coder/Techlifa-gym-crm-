import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Bot,
  Sparkles,
  Languages,
  Sliders,
  ShieldCheck,
  Check,
  Cpu,
  Key,
} from 'lucide-react';

export const AISettings: React.FC = () => {
  const { settings, updateSettings, addToast } = useApp();

  const [aiLang, setAiLang] = useState(settings.aiLanguage);
  const [aiTone, setAiTone] = useState(settings.aiTone);
  const [churnDays, setChurnDays] = useState(settings.churnThresholdDays);
  const [apiKey, setApiKey] = useState('demo-gemini-pro-mock-key-valid');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      aiLanguage: aiLang,
      aiTone: aiTone,
      churnThresholdDays: Number(churnDays),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
            AI Neural Engine & Personality Settings
          </h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30">
            DEMO ENGINE ACTIVE
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure multi-language conversational styles, Indian gym slang (Hinglish), and churn sensitivity.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Language & Tone Section */}
        <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Languages className="w-5 h-5 text-[#C6FF00]" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Language Model & Conversational Tone
              </h3>
              <p className="text-[11px] text-slate-400">
                Tailored for modern Indian gym members and WhatsApp engagement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">AI Primary Language</label>
              <div className="space-y-2">
                {[
                  { id: 'English', desc: 'Standard business English' },
                  { id: 'Hinglish', desc: 'Mix of Hindi & English ("Aapka plan renew karna hai")' },
                  { id: 'Hindi', desc: 'Devanagari script format' },
                ].map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      aiLang === item.id
                        ? 'bg-dark-750 border-[#C6FF00]/60 ring-1 ring-[#C6FF00]/30'
                        : 'bg-dark-850 border-slate-750 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{item.id}</span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                    <input
                      type="radio"
                      name="aiLanguage"
                      checked={aiLang === item.id}
                      onChange={() => setAiLang(item.id as any)}
                      className="mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">AI Coaching Tone</label>
              <div className="space-y-2">
                {[
                  { id: 'Professional', desc: 'Polite, structured, corporate tone' },
                  { id: 'Friendly', desc: 'Warm, encouraging, community-driven' },
                  { id: 'Hinglish Coach', desc: 'High energy gym motivation ("Bhai consistency is key!")' },
                ].map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      aiTone === item.id
                        ? 'bg-dark-750 border-[#C6FF00]/60 ring-1 ring-[#C6FF00]/30'
                        : 'bg-dark-850 border-slate-750 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{item.id}</span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                    <input
                      type="radio"
                      name="aiTone"
                      checked={aiTone === item.id}
                      onChange={() => setAiTone(item.id as any)}
                      className="mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Churn Sensitivity Slider */}
        <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Predictive Churn Sensitivity Threshold
              </h3>
              <p className="text-[11px] text-slate-400">
                Number of consecutive absent days before a member is flagged as Churn Alert.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Absence Trigger Window:</span>
              <span className="font-mono font-bold text-base text-[#C6FF00] bg-dark-850 px-3 py-1 rounded-xl border border-slate-700">
                {churnDays} Consecutive Days Absent
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="21"
              step="1"
              value={churnDays}
              onChange={e => setChurnDays(Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-[#C6FF00]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 Days (Aggressive Early Alert)</span>
              <span>10 Days (Recommended)</span>
              <span>21 Days (Dormant Lapsed)</span>
            </div>
          </div>
        </div>

        {/* LLM Backend Integration Architecture */}
        <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Production LLM Provider Architecture
              </h3>
              <p className="text-[11px] text-slate-400">
                Plug-and-play abstraction layer ready for Gemini 1.5 Pro / Flash.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Current Mode: Deterministic Local SaaS Intelligence</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ZERO CLOUD API COST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              TECHLIFAA GYM AI uses a deterministic calculation engine (`/src/lib/ai.ts`) for sales demonstrations, ensuring instant responses, explainable math, and zero external latency.
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Optional Google Gemini API Key (For Production Switch):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs outline-none focus:border-[#C6FF00]"
              />
              <button
                type="button"
                onClick={() => addToast('success', 'Key Configured', 'Production Gemini API ready for activation.')}
                className="px-4 py-2 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-200 font-semibold border border-slate-700"
              >
                Validate
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save AI Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
