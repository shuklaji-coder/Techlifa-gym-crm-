import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  Lead,
  Trainer,
  MembershipPlan,
  AttendanceRecord,
  PaymentTransaction,
  FitnessClass,
  WorkoutPlan,
  DietPlan,
  AutomationRule,
  NotificationItem,
  AppSettings,
  UserRole,
  LeadStage,
} from '../types';
import {
  initialTrainers,
  initialPlans,
  generateSeedMembers,
  initialLeads,
  generateSeedAttendance,
  generateSeedPayments,
  initialClasses,
  initialWorkoutPlans,
  initialDietPlans,
  initialAutomations,
  initialNotifications,
  defaultSettings,
} from '../data/seedData';
import { format, addMonths, addDays } from 'date-fns';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Roles & Permissions
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Data Collections
  members: Member[];
  leads: Lead[];
  trainers: Trainer[];
  plans: MembershipPlan[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  classes: FitnessClass[];
  workoutPlans: WorkoutPlan[];
  dietPlans: DietPlan[];
  automations: AutomationRule[];
  notifications: NotificationItem[];
  settings: AppSettings;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Member Actions
  addMember: (memberData: Omit<Member, 'id' | 'totalVisits' | 'measurements'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  freezeMember: (id: string) => void;
  unfreezeMember: (id: string) => void;
  renewMember: (id: string, planId: string, paymentMethod?: string) => void;
  assignTrainerToMember: (memberId: string, trainerId: string) => void;

  // Lead Actions
  addLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'score' | 'scoreLabel'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (id: string, newStage: LeadStage) => void;
  convertLeadToMember: (leadId: string, planId: string) => void;

  // Payment Actions
  recordPayment: (paymentData: {
    memberId: string;
    planId: string;
    amount: number;
    paymentMethod: PaymentTransaction['paymentMethod'];
    notes?: string;
  }) => PaymentTransaction;

  // Plan Actions
  addPlan: (plan: Omit<MembershipPlan, 'id' | 'activeMembersCount'>) => void;
  updatePlan: (id: string, updates: Partial<MembershipPlan>) => void;
  deletePlan: (id: string) => void;

  // Attendance Actions
  checkInMember: (memberId: string, method?: AttendanceRecord['method']) => boolean;

  // Class Actions
  bookClass: (classId: string, memberId: string) => boolean;
  cancelClassBooking: (classId: string, memberId: string) => void;

  // Workout & Diet Actions
  saveWorkoutPlan: (plan: WorkoutPlan) => void;
  assignWorkoutToMember: (planId: string, memberId: string) => void;
  saveDietPlan: (plan: DietPlan) => void;
  assignDietToMember: (planId: string, memberId: string) => void;

  // Automations Actions
  toggleAutomation: (id: string) => void;
  updateAutomationTemplate: (id: string, template: string) => void;
  triggerAutomationTest: (id: string) => void;

  // Notifications Actions
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Settings Actions
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetAllDataToDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_ROLE: 'codexa_user_role',
  MEMBERS: 'codexa_members_v1',
  LEADS: 'codexa_leads_v1',
  TRAINERS: 'codexa_trainers_v1',
  PLANS: 'codexa_plans_v1',
  ATTENDANCE: 'codexa_attendance_v1',
  PAYMENTS: 'codexa_payments_v1',
  CLASSES: 'codexa_classes_v1',
  WORKOUTS: 'codexa_workouts_v1',
  DIETS: 'codexa_diets_v1',
  AUTOMATIONS: 'codexa_automations_v1',
  NOTIFICATIONS: 'codexa_notifications_v1',
  SETTINGS: 'codexa_settings_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 2. User Role
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return (saved as UserRole) || 'owner';
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    addToast('info', 'Role Switched', `Logged in as ${role === 'owner' ? 'Gym Owner' : role === 'trainer' ? 'Senior Trainer' : 'Front Desk Officer'}`);
  };

  // 3. Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.gymName || parsed.gymName.includes('CODEXA') || parsed.gymName.includes('Codexa')) {
          parsed.gymName = 'TECHLIFAA GYM AI';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
        return parsed;
      }
      return defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Apply Primary Accent Color and Theme dynamically to root
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor || '#C6FF00');
    document.documentElement.style.setProperty('--glow-color', settings.primaryColor ? `${settings.primaryColor}40` : 'rgba(198, 255, 0, 0.25)');
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.primaryColor, settings.theme]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'Settings Updated', 'Preferences and branding saved.');
  };

  // 4. Data states with LocalStorage persistence
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : generateSeedMembers();
    } catch {
      return generateSeedMembers();
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      return saved ? JSON.parse(saved) : initialLeads;
    } catch {
      return initialLeads;
    }
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRAINERS);
      return saved ? JSON.parse(saved) : initialTrainers;
    } catch {
      return initialTrainers;
    }
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      return saved ? JSON.parse(saved) : initialPlans;
    } catch {
      return initialPlans;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : generateSeedAttendance(members);
    } catch {
      return generateSeedAttendance(members);
    }
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : generateSeedPayments(members);
    } catch {
      return generateSeedPayments(members);
    }
  });

  const [classes, setClasses] = useState<FitnessClass[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : initialClasses;
    } catch {
      return initialClasses;
    }
  });

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return saved ? JSON.parse(saved) : initialWorkoutPlans;
    } catch {
      return initialWorkoutPlans;
    }
  });

  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIETS);
      return saved ? JSON.parse(saved) : initialDietPlans;
    } catch {
      return initialDietPlans;
    }
  });

  const [automations, setAutomations] = useState<AutomationRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTOMATIONS);
      return saved ? JSON.parse(saved) : initialAutomations;
    } catch {
      return initialAutomations;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIETS, JSON.stringify(dietPlans));
  }, [dietPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTOMATIONS, JSON.stringify(automations));
  }, [automations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // ==========================================
  // MEMBER CRUD OPERATIONS
  // ==========================================
  const addMember = (data: Omit<Member, 'id' | 'totalVisits' | 'measurements'>): Member => {
    const nextIdNum = 1000 + members.length + 1;
    const newMember: Member = {
      ...data,
      id: `MEM-${nextIdNum}`,
      totalVisits: 1,
      measurements: [
        {
          date: format(new Date(), 'yyyy-MM-dd'),
          weightKg: data.gender === 'male' ? 75 : 58,
          bodyFatPercent: data.gender === 'male' ? 20 : 25,
          chestCm: data.gender === 'male' ? 100 : 88,
          waistCm: data.gender === 'male' ? 84 : 72,
          armsCm: data.gender === 'male' ? 35 : 27,
          hipsCm: data.gender === 'male' ? 96 : 94,
        },
      ],
    };

    setMembers(prev => [newMember, ...prev]);
    addToast('success', 'Member Registered', `${newMember.fullName} enrolled successfully.`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
    addToast('success', 'Member Updated', 'Profile changes saved.');
  };

  const deleteMember = (id: string) => {
    const mem = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Member Removed', `${mem?.fullName || 'Member'} has been archived.`);
  };

  const freezeMember = (id: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'frozen' } : m))
    );
    addToast('warning', 'Membership Frozen', 'Member account suspended temporarily.');
  };

  const unfreezeMember = (id: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'active' } : m))
    );
    addToast('success', 'Membership Reactivated', 'Member status restored to active.');
  };

  const renewMember = (id: string, planId: string, paymentMethod: string = 'UPI') => {
    const member = members.find(m => m.id === id);
    const plan = plans.find(p => p.id === planId) || plans[0];
    if (!member) return;

    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    const newExpiry = format(addMonths(baseDate, plan.durationMonths), 'yyyy-MM-dd');

    // Update member
    setMembers(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status: 'active',
              planId: plan.id,
              expiryDate: newExpiry,
              outstandingBalance: 0,
            }
          : m
      )
    );

    // Record payment
    recordPayment({
      memberId: member.id,
      planId: plan.id,
      amount: plan.price,
      paymentMethod: (paymentMethod as any) || 'UPI',
      notes: `Renewal of ${plan.name} (${plan.durationMonths} months)`,
    });

    addToast('success', 'Membership Renewed! 🚀', `${member.fullName}'s plan extended until ${newExpiry}.`);
  };

  const assignTrainerToMember = (memberId: string, trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    setMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, assignedTrainerId: trainerId } : m))
    );
    addToast('success', 'Trainer Assigned', `Assigned Coach ${trainer?.name || 'Trainer'}.`);
  };

  // ==========================================
  // LEAD ACTIONS (Kanban)
  // ==========================================
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'score' | 'scoreLabel'>): Lead => {
    const nextIdNum = 2000 + leads.length + 1;
    const score = leadData.stage === 'trial_booked' ? 85 : 70;
    const scoreLabel = score >= 75 ? 'Hot' : 'Warm';

    const newLead: Lead = {
      ...leadData,
      id: `LEAD-${nextIdNum}`,
      score,
      scoreLabel,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };

    setLeads(prev => [newLead, ...prev]);
    addToast('success', 'New Lead Added', `${newLead.fullName} added to pipeline.`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, ...updates } : l))
    );
    addToast('info', 'Lead Updated', 'Lead details saved.');
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    addToast('info', 'Lead Deleted', 'Lead removed from CRM.');
  };

  const moveLeadStage = (id: string, newStage: LeadStage) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === id) {
          let score = l.score;
          if (newStage === 'joined') score = 99;
          else if (newStage === 'trial_booked') score = 88;
          else if (newStage === 'contacted') score = 70;
          else if (newStage === 'lost') score = 25;

          const scoreLabel = score >= 75 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold';
          return { ...l, stage: newStage, score, scoreLabel };
        }
        return l;
      })
    );
    addToast('success', 'Stage Moved', `Lead moved to ${newStage.toUpperCase().replace('_', ' ')}`);
  };

  const convertLeadToMember = (leadId: string, planId: string) => {
    const lead = leads.find(l => l.id === leadId);
    const plan = plans.find(p => p.id === planId) || plans[0];
    if (!lead) return;

    // Create member from lead
    const newMember = addMember({
      fullName: lead.fullName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      phone: lead.phone,
      email: lead.email,
      age: 26,
      gender: 'male',
      joinDate: format(new Date(), 'yyyy-MM-dd'),
      planId: plan.id,
      status: 'active',
      assignedTrainerId: lead.assignedTrainerId || trainers[0].id,
      emergencyContact: {
        name: 'Family',
        relationship: 'Guardian',
        phone: lead.phone,
      },
      fitnessGoal: (lead.fitnessGoal as any) || 'General Fitness',
      lastAttendance: format(new Date(), 'yyyy-MM-dd'),
      outstandingBalance: 0,
      expiryDate: format(addMonths(new Date(), plan.durationMonths), 'yyyy-MM-dd'),
    });

    // Mark lead as joined
    moveLeadStage(leadId, 'joined');

    // Record payment
    recordPayment({
      memberId: newMember.id,
      planId: plan.id,
      amount: plan.price,
      paymentMethod: 'UPI',
      notes: `First enrollment from lead pipeline (${lead.source})`,
    });

    addToast('success', 'Lead Converted to Member! 🎉', `${lead.fullName} is now an active member!`);
  };

  // ==========================================
  // PAYMENT ACTIONS
  // ==========================================
  const recordPayment = (paymentData: {
    memberId: string;
    planId: string;
    amount: number;
    paymentMethod: PaymentTransaction['paymentMethod'];
    notes?: string;
  }): PaymentTransaction => {
    const member = members.find(m => m.id === paymentData.memberId);
    const plan = plans.find(p => p.id === paymentData.planId) || plans[0];

    const baseAmount = Math.round(paymentData.amount / 1.18);
    const gstAmount = paymentData.amount - baseAmount;
    const invNum = `INV-${new Date().getFullYear()}-${1050 + payments.length}`;

    const newPayment: PaymentTransaction = {
      id: `TXN-${9500 + payments.length}`,
      invoiceNumber: invNum,
      memberId: paymentData.memberId,
      memberName: member?.fullName || 'Valued Member',
      memberPhone: member?.phone || '+91 98000 00000',
      planId: paymentData.planId,
      planName: plan.name,
      baseAmount,
      gstAmount,
      totalAmount: paymentData.amount,
      date: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: paymentData.paymentMethod,
      status: 'paid',
      transactionRef: `${paymentData.paymentMethod === 'UPI' ? 'UPI' : 'REF'}/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      notes: paymentData.notes || `Subscription payment for ${plan.name}`,
    };

    setPayments(prev => [newPayment, ...prev]);

    // Clear member outstanding balance
    if (member) {
      setMembers(prev =>
        prev.map(m =>
          m.id === member.id
            ? { ...m, outstandingBalance: Math.max(0, m.outstandingBalance - paymentData.amount) }
            : m
        )
      );
    }

    addToast('success', 'Payment Recorded! 💰', `Received ₹${paymentData.amount.toLocaleString('en-IN')} via ${paymentData.paymentMethod}`);
    return newPayment;
  };

  // ==========================================
  // MEMBERSHIP PLAN CRUD
  // ==========================================
  const addPlan = (planData: Omit<MembershipPlan, 'id' | 'activeMembersCount'>) => {
    const newPlan: MembershipPlan = {
      ...planData,
      id: `PLAN-CUSTOM-${Date.now().toString().slice(-4)}`,
      activeMembersCount: 0,
    };
    setPlans(prev => [...prev, newPlan]);
    addToast('success', 'Plan Created', `${newPlan.name} is now available.`);
  };

  const updatePlan = (id: string, updates: Partial<MembershipPlan>) => {
    setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    addToast('info', 'Plan Updated', 'Membership plan modifications saved.');
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    addToast('info', 'Plan Removed', 'Plan deleted from active offerings.');
  };

  // ==========================================
  // ATTENDANCE ACTIONS
  // ==========================================
  const checkInMember = (memberId: string, method: AttendanceRecord['method'] = 'QR Scan'): boolean => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      addToast('error', 'Member Not Found', 'No active member matches this ID.');
      return false;
    }

    // Check if already checked in today
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existing = attendance.find(a => a.memberId === memberId && a.date === todayStr);

    if (existing && !existing.checkOutTime) {
      // Mark check-out
      const checkOutTime = format(new Date(), 'HH:mm');
      setAttendance(prev =>
        prev.map(a => (a.id === existing.id ? { ...a, checkOutTime } : a))
      );
      addToast('info', 'Checked Out 👋', `${member.fullName} checked out at ${checkOutTime}.`);
      return true;
    }

    const checkInTime = format(new Date(), 'HH:mm');
    const newRecord: AttendanceRecord = {
      id: `ATT-LIVE-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      memberAvatar: member.avatar,
      date: todayStr,
      checkInTime,
      status: 'present',
      method,
    };

    setAttendance(prev => [newRecord, ...prev]);

    // Update member's last attendance & total visits
    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? {
              ...m,
              lastAttendance: todayStr,
              totalVisits: (m.totalVisits || 0) + 1,
            }
          : m
      )
    );

    addToast('success', 'Access Granted! ✅', `${member.fullName} checked in (${method}).`);
    return true;
  };

  // ==========================================
  // CLASS BOOKINGS
  // ==========================================
  const bookClass = (classId: string, memberId: string): boolean => {
    const cls = classes.find(c => c.id === classId);
    const member = members.find(m => m.id === memberId);
    if (!cls || !member) return false;

    if (cls.enrolledCount >= cls.capacity) {
      addToast('error', 'Class Full', `${cls.name} has reached maximum capacity (${cls.capacity} spots).`);
      return false;
    }

    if (cls.enrolledMemberIds.includes(memberId)) {
      addToast('warning', 'Already Booked', `${member.fullName} is already enrolled in this class.`);
      return false;
    }

    setClasses(prev =>
      prev.map(c =>
        c.id === classId
          ? {
              ...c,
              enrolledCount: c.enrolledCount + 1,
              enrolledMemberIds: [...c.enrolledMemberIds, memberId],
            }
          : c
      )
    );

    addToast('success', 'Seat Reserved! 🧘‍♂️', `${member.fullName} enrolled in ${cls.name}.`);
    return true;
  };

  const cancelClassBooking = (classId: string, memberId: string) => {
    setClasses(prev =>
      prev.map(c =>
        c.id === classId
          ? {
              ...c,
              enrolledCount: Math.max(0, c.enrolledCount - 1),
              enrolledMemberIds: c.enrolledMemberIds.filter(id => id !== memberId),
            }
          : c
      )
    );
    addToast('info', 'Booking Cancelled', 'Slot released.');
  };

  // ==========================================
  // WORKOUT & DIET ACTIONS
  // ==========================================
  const saveWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = plan;
        return copy;
      }
      return [plan, ...prev];
    });
    addToast('success', 'Workout Plan Saved', plan.title);
  };

  const assignWorkoutToMember = (planId: string, memberId: string) => {
    setWorkoutPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? { ...p, assignedMemberIds: Array.from(new Set([...p.assignedMemberIds, memberId])) }
          : p
      )
    );
    const m = members.find(mem => mem.id === memberId);
    addToast('success', 'Workout Protocol Assigned', `Assigned to ${m?.fullName || 'Member'}.`);
  };

  const saveDietPlan = (plan: DietPlan) => {
    setDietPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = plan;
        return copy;
      }
      return [plan, ...prev];
    });
    addToast('success', 'Diet Plan Saved', plan.title);
  };

  const assignDietToMember = (planId: string, memberId: string) => {
    setDietPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? { ...p, assignedMemberIds: Array.from(new Set([...p.assignedMemberIds, memberId])) }
          : p
      )
    );
    const m = members.find(mem => mem.id === memberId);
    addToast('success', 'Nutrition Plan Assigned', `Assigned to ${m?.fullName || 'Member'}.`);
  };

  // ==========================================
  // AUTOMATION ACTIONS
  // ==========================================
  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    addToast('info', 'Automation Updated', 'Workflow toggle state changed.');
  };

  const updateAutomationTemplate = (id: string, template: string) => {
    setAutomations(prev =>
      prev.map(a => (a.id === id ? { ...a, template } : a))
    );
    addToast('success', 'Template Saved', 'WhatsApp copy updated.');
  };

  const triggerAutomationTest = (id: string) => {
    const auto = automations.find(a => a.id === id);
    if (!auto) return;
    setAutomations(prev =>
      prev.map(a =>
        a.id === id ? { ...a, lastTriggered: format(new Date(), 'yyyy-MM-dd HH:mm') } : a
      )
    );
    addToast('success', 'Automation Test Executed 🚀', `Dispatched sample message for: ${auto.title}`);
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('info', 'Notifications Cleared', 'All alerts marked read and dismissed.');
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // ==========================================
  // RESET ALL DATA TO DEMO
  // ==========================================
  const resetAllDataToDemo = () => {
    localStorage.clear();
    const freshMembers = generateSeedMembers();
    setMembers(freshMembers);
    setLeads(initialLeads);
    setTrainers(initialTrainers);
    setPlans(initialPlans);
    setAttendance(generateSeedAttendance(freshMembers));
    setPayments(generateSeedPayments(freshMembers));
    setClasses(initialClasses);
    setWorkoutPlans(initialWorkoutPlans);
    setDietPlans(initialDietPlans);
    setAutomations(initialAutomations);
    setNotifications(initialNotifications);
    setSettings(defaultSettings);
    setUserRoleState('owner');
    addToast('success', 'Demo Reset Completed! ⚡', 'All 120 members, 40 leads & financials restored.');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        members,
        leads,
        trainers,
        plans,
        attendance,
        payments,
        classes,
        workoutPlans,
        dietPlans,
        automations,
        notifications,
        settings,
        toasts,
        addToast,
        removeToast,
        addMember,
        updateMember,
        deleteMember,
        freezeMember,
        unfreezeMember,
        renewMember,
        assignTrainerToMember,
        addLead,
        updateLead,
        deleteLead,
        moveLeadStage,
        convertLeadToMember,
        recordPayment,
        addPlan,
        updatePlan,
        deletePlan,
        checkInMember,
        bookClass,
        cancelClassBooking,
        saveWorkoutPlan,
        assignWorkoutToMember,
        saveDietPlan,
        assignDietToMember,
        toggleAutomation,
        updateAutomationTemplate,
        triggerAutomationTest,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        updateSettings,
        resetAllDataToDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
