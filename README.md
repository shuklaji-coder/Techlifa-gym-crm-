# Techlifa-gym-crm-
# TECHLIFAA GYM AI — Intelligent Fitness Business Management

> **Enterprise Custom SaaS Edition (₹5–10 Lakh Custom Product Feel)**  
> Built for premium Indian fitness centers, health clubs, and sports studios.

![TECHLIFAA GYM AI Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80)

---

## ⚡ Executive Summary

**TECHLIFAA GYM AI** is a state-of-the-art, fully interactive, offline-resilient Gym Management SaaS platform designed to demonstrate modern enterprise fitness management to gym owners across India. It couples operations (members, turnstiles, GST invoicing, Kanban leads) with an explainable AI Neural Command Engine that forecasts member churn, formulates Indian macro-targeted meal plans, optimizes floor capacity, and acts as an executive business advisor.

---

## 🚀 Key Technical Highlights

- **Vite + React 18 + TypeScript:** Strict typing, instantaneous hot module reloading, and zero production runtime errors.
- **Tailwind CSS + Dual Theme Luxury Aesthetic:** 1-Click switch between Futuristic Deep Obsidian Charcoal (`#07090E`) and Apple Health-grade Luxe Pearl White Studio (`#F8FAFC`).
- **LocalStorage State Persistence:** 100% of member edits, new leads, collected payments, and live attendance persist seamlessly across browser refreshes.
- **Deterministic AI Abstraction Layer (`/src/lib/ai.ts`):** 100% reliable rule-based algorithms with zero external API latency, structured for plug-and-play LLM (Gemini 1.5 Pro) integration.
- **Printable Indian GST Invoices & Receipts:** Complete with SAC code 999723, CGST 9% + SGST 9%, GSTIN, and formatted print layouts.
- **One-Click WhatsApp Integration:** Direct `wa.me/91...` routing with personalized message templates for follow-ups, renewals, and retention offers.

---

## 📱 Application Structure (19 Fully Functional Modules)

1. **Login & Role Selection (`/login`):** 1-click switcher between **Gym Owner**, **Head Coach / Trainer**, and **Front Desk Officer** with dynamic permission previews.
2. **Executive Dashboard (`/`):** 8 primary KPI cards, 30-day attendance trend, monthly revenue vs targets, membership tier breakdown, peak hour occupancy, and AI alerts.
3. **Members CRM (`/members`):** 120 seeded Indian members with search, multi-filters, pagination, add/edit/delete, freeze/unfreeze, renew, and CSV export.
4. **Member Profile (`/members/:id`):** 8 interactive tabs:
   - *Overview*, *Attendance Heatmap*, *Payments Ledger*, *Biometric Progress (Charts)*, *Workout Protocols*, *Indian Diet Plan*, *Coaching Notes*, and *Activity Timeline*.
5. **Leads & Sales Pipeline (`/leads`):** 40 seeded leads across 5 Kanban stages (*New*, *Contacted*, *Trial Booked*, *Joined*, *Lost*) with drag-and-drop, AI lead scoring, and 1-click member enrollment.
6. **Membership Plans & Pricing (`/plans`):** 5 Indian subscription tiers (Monthly Starter, Quarterly Pro, Half-Yearly Elite, Annual Champion, and VIP PT) with promo codes and GST rates.
7. **Live Attendance & Turnstile (`/attendance`):** Optical QR scanner simulator, turnstile entry logs, live floor occupancy tracker (e.g. 18/45 members), and peak hours.
8. **Payments, Invoices & GST (`/payments`):** 85+ transaction financial ledger, pending fee collectors, official GST Tax Invoices (SAC 999723), and downloadable CSV ledgers.
9. **Trainers Staff Management (`/trainers`):** 6 coaches with ratings, schedules, client loads, performance scores, and direct WhatsApp routing.
10. **Classes & Timetable Scheduling (`/classes`):** Weekly schedule across Yoga, Zumba, HIIT, CrossFit, Strength Training, and Cardio with capacity counters and member booking.
11. **Workout Protocols & AI Generator (`/workouts`):** 4-week splits with sets, reps, and rest intervals + interactive AI Workout Builder with medical disclaimers.
12. **Indian Diet Plans (`/diets`):** Authentic Indian recipes (Veg, Non-Veg, Jain) with calories and macros, budget tiers, and approximate calorie labeling.
13. **AI Intelligence Command Center (`/ai-intelligence`):** Churn prediction (0–100 score), explainable risk factors, retention offer dispatch, and renewal forecasting.
14. **AI Business Advisor (`/ai-advisor`):** Strategic diagnostics (MoM revenue growth, trainer retention, plan ROI) + weekly club health report generator.
15. **Smart Automations (`/automations`):** 5 configurable workflows (Renewal countdowns, 7-day absence nudges, birthdays, overdue dues) with live variable previews and test execution.
16. **Reports & Analytics (`/reports`):** Full financial and marketing performance reports with **real, browser-downloadable CSV files**.
17. **Notification Center (`/notifications`):** Live alert feed, category filters, mark as read, and simulated push triggers.
18. **Gym Settings & Brand Identity (`/settings`):** Live accent color switcher (Electric Lime, Cyber Cyan, Gold, Rose, Violet, Emerald, or custom Hex), theme modes, and GST profile.
19. **AI Model Settings (`/ai-settings`):** Language settings (English, Hindi, Hinglish), coaching tone, churn threshold slider, and Gemini API key config.

---

## 🛠️ Quick Local Setup

```bash
# 1. Clone repository
git clone https://github.com/shuklaji-coder/Techlifa-gym-crm-.git

# 2. Navigate into project
cd Techlifa-gym-crm-

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## 📄 License & Commercial Rights

Developed by **TECHLIFAA**. All commercial rights reserved.
