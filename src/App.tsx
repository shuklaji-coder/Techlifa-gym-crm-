import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { LoginRoleSelection } from './pages/LoginRoleSelection';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { MemberProfile } from './pages/MemberProfile';
import { LeadsPipeline } from './pages/LeadsPipeline';
import { MembershipPlans } from './pages/MembershipPlans';
import { Attendance } from './pages/Attendance';
import { PaymentsInvoices } from './pages/PaymentsInvoices';
import { Trainers } from './pages/Trainers';
import { ClassesScheduling } from './pages/ClassesScheduling';
import { WorkoutPlans } from './pages/WorkoutPlans';
import { DietPlans } from './pages/DietPlans';
import { AIIntelligenceCenter } from './pages/AIIntelligenceCenter';
import { AIBusinessAdvisor } from './pages/AIBusinessAdvisor';
import { Automations } from './pages/Automations';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { AISettings } from './pages/AISettings';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Login / Demo Role Selection */}
      <Route path="/login" element={<LoginRoleSelection />} />

      {/* Main SaaS Platform Layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="members/:id" element={<MemberProfile />} />
        <Route path="leads" element={<LeadsPipeline />} />
        <Route path="plans" element={<MembershipPlans />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="payments" element={<PaymentsInvoices />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="classes" element={<ClassesScheduling />} />
        <Route path="workouts" element={<WorkoutPlans />} />
        <Route path="diets" element={<DietPlans />} />
        <Route path="ai-intelligence" element={<AIIntelligenceCenter />} />
        <Route path="ai-advisor" element={<AIBusinessAdvisor />} />
        <Route path="automations" element={<Automations />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="ai-settings" element={<AISettings />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
