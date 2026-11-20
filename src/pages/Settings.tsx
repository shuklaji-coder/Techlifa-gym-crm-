import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Settings as SettingsIcon,
  Building2,
  Palette,
  Shield,
  Bell,
  Check,
  Sparkles,
  Upload,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetAllDataToDemo, addToast } = useApp();

  const [formData, setFormData] = useState({
    gymName: settings.gymName,
    tagline: settings.tagline,
    contactPhone: settings.contactPhone,
    email: settings.email,
    address: settings.address,
    city: settings.city,
    state: settings.state,
    gstNumber: settings.gstNumber,
    primaryColor: settings.primaryColor,
    theme: settings.theme,
    enableWhatsAppAlerts: settings.enableWhatsAppAlerts,
    enableSmsNotifications: settings.enableSmsNotifications,
    enableAutoRenewals: settings.enableAutoRenewals,
    churnThresholdDays: settings.churnThresholdDays,
  });

  const presetColors = [
    { name: 'Electric Lime (Default)', hex: '#C6FF00' },
    { name: 'Neon Cyber Cyan', hex: '#00F0FF' },
    { name: 'Olympic Gold', hex: '#FFB800' },
    { name: 'Hyper Hot Rose', hex: '#FF3366' },
    { name: 'Cyberpunk Violet', hex: '#8B5CF6' },
    { name: 'Emerald Performance', hex: '#10B981' },
  ];

  const handleColorSelect = (hex: string) => {
    setFormData(prev => ({ ...prev, primaryColor: hex }));
    updateSettings({ primaryColor: hex });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
            Club Settings & Brand Identity
          </h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
            Live Config
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize your gym details, Indian GST registration, branding accents, and automation triggers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Brand & Theme Customization */}
        <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Palette className="w-5 h-5 text-[#C6FF00]" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Live Brand Identity & Neon Color Picker
              </h3>
              <p className="text-[11px] text-slate-400">
                Changes apply instantly across all buttons, glows, charts, and navigation indicators.
              </p>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-2">Preset Accent Colors:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presetColors.map(c => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => handleColorSelect(c.hex)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    formData.primaryColor.toLowerCase() === c.hex.toLowerCase()
                      ? 'bg-dark-750 border-white ring-2 ring-white/20'
                      : 'bg-dark-850 border-slate-750 hover:border-slate-600'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 shadow-md"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <span className="font-bold text-white text-[11px] block">{c.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{c.hex}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Custom Hex Code</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={e => handleColorSelect(e.target.value)}
                  className="w-9 h-9 rounded-xl bg-transparent border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={e => handleColorSelect(e.target.value)}
                  className="w-32 bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Theme Mode</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, theme: 'dark' });
                      updateSettings({ theme: 'dark' });
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      formData.theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-700 shadow-sm ring-2 ring-[#C6FF00]'
                        : 'bg-dark-750 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Deep Charcoal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, theme: 'light' });
                      updateSettings({ theme: 'light' });
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      formData.theme === 'light'
                        ? 'bg-white text-slate-900 border-slate-300 shadow-sm ring-2 ring-emerald-500'
                        : 'bg-dark-750 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Luxe Pearl White</span>
                  </button>
                </div>
              </div>
          </div>
        </div>

        {/* Section 2: Club Details & GST */}
        <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Business Details & GST Compliance
              </h3>
              <p className="text-[11px] text-slate-400">
                Printed directly on all generated GST tax invoices and thermal receipts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Gym Name</label>
              <input
                type="text"
                value={formData.gymName}
                onChange={e => setFormData({ ...formData, gymName: e.target.value })}
                className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">GSTIN Number (India)</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={e => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Official Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Gym Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">State & Pincode</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-dark-750 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="p-6 rounded-2xl bg-dark-800/90 border border-slate-700/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <Bell className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Alerts & Communications Channels
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose automated channels for renewal notices and check-in greetings.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-slate-750 cursor-pointer">
              <div>
                <span className="font-bold text-white block">WhatsApp Business Alerts (wa.me)</span>
                <span className="text-[11px] text-slate-400">One-click direct WhatsApp chat routing</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableWhatsAppAlerts}
                onChange={e => setFormData({ ...formData, enableWhatsAppAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-[#C6FF00] bg-dark-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-slate-750 cursor-pointer">
              <div>
                <span className="font-bold text-white block">SMS Dues Reminders</span>
                <span className="text-[11px] text-slate-400">Dispatch SMS fallback for unpaid fees</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableSmsNotifications}
                onChange={e => setFormData({ ...formData, enableSmsNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-[#C6FF00] bg-dark-700"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to factory default?')) {
                resetAllDataToDemo();
              }
            }}
            className="text-rose-400 hover:text-rose-300 font-semibold text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Database</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
