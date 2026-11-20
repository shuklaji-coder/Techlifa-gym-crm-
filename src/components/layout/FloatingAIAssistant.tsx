import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { processAIChatQuery } from '../../lib/ai';
import { AIChatMessage } from '../../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Namaste! I am your **TECHLIFAA AI Business & Coaching Assistant**. I have live access to your 120 gym members, attendance logs, and financial ledgers.\n\nHow can I help you scale your gym today?`,
    },
  ]);

  const { members, leads, trainers, payments, plans, attendance, addToast, triggerAutomationTest } = useApp();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'Show members absent for 10 days',
    'Compare this month with last month',
    'Find members whose plans expire this week',
    'Draft a Diwali membership offer',
    'Show the top five trainers by retention',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate streaming AI thinking
    setTimeout(() => {
      const response = processAIChatQuery(query, {
        members,
        leads,
        trainers,
        payments,
        plans,
        attendance,
      });

      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    }, 700);
  };

  const handleActionClick = (actionKey: string, payload?: any) => {
    switch (actionKey) {
      case 'NAVIGATE_AI_CHURN':
        navigate('/ai-intelligence');
        setIsOpen(false);
        break;
      case 'TRIGGER_ABSENCE_AUTOMATION':
        triggerAutomationTest('AUTO-2');
        addToast('success', 'Nudge Automation Executed', 'Dispatched 7-day absence reminders.');
        break;
      case 'NAVIGATE_PAYMENTS':
        navigate('/payments');
        setIsOpen(false);
        break;
      case 'EXPORT_GST_REPORT':
        navigate('/reports');
        setIsOpen(false);
        break;
      case 'TRIGGER_RENEWAL_BULK':
        triggerAutomationTest('AUTO-1');
        addToast('success', 'Renewal Push Sent', 'Dispatched WhatsApp renewal nudges to expiring members.');
        break;
      case 'NAVIGATE_RENEWALS':
        navigate('/ai-intelligence');
        setIsOpen(false);
        break;
      case 'ACTIVATE_DIWALI_DISCOUNT':
        navigate('/plans');
        addToast('success', 'Promo Code Ready', 'DIWALI2024 applied to promotional offerings.');
        setIsOpen(false);
        break;
      case 'NAVIGATE_TRAINERS':
        navigate('/trainers');
        setIsOpen(false);
        break;
      case 'NAVIGATE_CLASSES':
        navigate('/classes');
        setIsOpen(false);
        break;
      case 'GENERATE_HEALTH_REPORT':
        navigate('/ai-advisor');
        setIsOpen(false);
        break;
      default:
        addToast('info', 'AI Action Executed', actionKey);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-dark-900 border-2 border-[#C6FF00] text-white rounded-full shadow-[0_0_25px_rgba(198,255,0,0.35)] hover:scale-105 active:scale-95 transition-all group"
          title="Open TECHLIFAA AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#C6FF00] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C6FF00] animate-ping" />
          </div>
          <span className="font-bold text-xs tracking-wider uppercase font-display hidden sm:inline">
            Ask TECHLIFAA AI
          </span>
          <span className="text-[10px] bg-[#C6FF00] text-black font-extrabold px-1.5 py-0.2 rounded-full">
            LIVE
          </span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 bg-dark-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-10'
              : 'bottom-5 right-5 w-[92vw] sm:w-[440px] h-[620px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-dark-850">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C6FF00] to-emerald-500 flex items-center justify-center text-black font-extrabold shadow-[0_0_12px_rgba(198,255,0,0.3)]">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white tracking-wide font-display">
                    TECHLIFAA AI Assistant
                  </h3>
                  <span
                    className="text-[9px] px-1.5 py-0.2 rounded bg-[#C6FF00]/15 text-[#C6FF00] font-mono border border-[#C6FF00]/30 cursor-help"
                    title="Deterministic Mock Intelligence analyzing actual local application state. Ready for Gemini LLM API integration."
                  >
                    DEMO AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Context-Aware Fitness SaaS Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
                title={isExpanded ? 'Restore' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#C6FF00]/15 border border-[#C6FF00]/30 flex items-center justify-center shrink-0 text-[#C6FF00]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#C6FF00] text-black font-medium shadow-[0_0_15px_rgba(198,255,0,0.15)] rounded-tr-none'
                      : 'bg-dark-800 border border-slate-700/70 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Structured Response Cards if attached */}
                  {msg.structuredCard && (
                    <div className="mt-3 p-3 rounded-xl bg-dark-850/90 border border-slate-700 text-slate-200">
                      <p className="font-bold text-[11px] text-[#C6FF00] uppercase tracking-wider mb-2">
                        {msg.structuredCard.title}
                      </p>

                      {msg.structuredCard.type === 'stats' && (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(msg.structuredCard.data).map(([k, v]) => (
                            <div key={k} className="p-2 rounded bg-dark-800 border border-slate-750">
                              <span className="text-[10px] text-slate-400 block">{k}</span>
                              <span className="font-bold text-white text-xs mt-0.5 block">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.structuredCard.type === 'members_list' && (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                          {(msg.structuredCard.data as any[]).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded bg-dark-800 border border-slate-750"
                            >
                              <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-[10px] text-slate-400">
                                  {item.daysAbsent ? `${item.daysAbsent} days absent` : item.daysLeft}
                                </p>
                              </div>
                              <span className="text-[10px] text-slate-300 font-mono">{item.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.structuredCard.type === 'trainers_ranking' && (
                        <div className="space-y-1 max-h-44 overflow-y-auto custom-scrollbar">
                          {(msg.structuredCard.data as any[]).map((t, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-1.5 rounded bg-dark-800 border border-slate-750 text-[11px]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#C6FF00]">{t.rank}</span>
                                <span className="font-semibold text-white">{t.name}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span className="text-slate-300">{t.score}</span>
                                <span>{t.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.structuredCard.type === 'discount_campaign' && (
                        <div className="space-y-1.5">
                          {Object.entries(msg.structuredCard.data).map(([k, v]) => (
                            <div key={k} className="flex justify-between p-1.5 rounded bg-dark-800 border border-slate-750">
                              <span className="text-slate-400">{k}:</span>
                              <span className="font-bold text-white">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.actionKey, act.payload)}
                          className="px-2.5 py-1 rounded-lg bg-[#C6FF00]/15 hover:bg-[#C6FF00]/25 text-[#C6FF00] border border-[#C6FF00]/30 font-semibold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-2 font-mono text-right ${
                      msg.sender === 'user' ? 'text-black/60' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#C6FF00]/15 border border-[#C6FF00]/30 flex items-center justify-center shrink-0 text-[#C6FF00]">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-dark-800 border border-slate-700/70 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] ml-1">Analyzing club dataset...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pill Carousel */}
          <div className="p-2 border-t border-slate-800 bg-dark-850/60 overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-1.5">
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-dark-800 hover:bg-dark-700 border border-slate-700/60 text-[10px] text-slate-300 hover:text-white transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-dark-850 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about gym revenue, member churn, diet..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-1 bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-[#C6FF00] transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-[#C6FF00] text-black hover:bg-[#B5EB00] disabled:opacity-40 disabled:hover:bg-[#C6FF00] transition-all font-bold shadow-[0_0_12px_rgba(198,255,0,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
