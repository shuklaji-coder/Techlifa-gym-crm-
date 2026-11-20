export type UserRole = 'owner' | 'trainer' | 'front_desk';

export type MemberStatus = 'active' | 'expiring' | 'expired' | 'frozen';

export type Gender = 'male' | 'female' | 'other';

export interface BodyMeasurement {
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  chestCm: number;
  waistCm: number;
  armsCm: number;
  hipsCm: number;
}

export interface Member {
  id: string; // e.g., 'MEM-1001'
  fullName: string;
  avatar: string;
  phone: string; // +91-XXXXX-XXXXX
  email: string;
  age: number;
  gender: Gender;
  joinDate: string; // YYYY-MM-DD
  planId: string;
  status: MemberStatus;
  assignedTrainerId?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  fitnessGoal: 'Fat Loss' | 'Muscle Building' | 'Endurance' | 'Flexibility' | 'General Fitness' | 'Strength';
  lastAttendance: string; // YYYY-MM-DD
  outstandingBalance: number; // in INR (₹)
  expiryDate: string; // YYYY-MM-DD
  totalVisits: number;
  notes?: string;
  measurements: BodyMeasurement[];
}

export type LeadStage = 'new' | 'contacted' | 'trial_booked' | 'joined' | 'lost';

export type LeadSource = 'Walk-in' | 'Instagram' | 'Google Search' | 'Member Referral' | 'Facebook Ads' | 'Flyer / Offline';

export interface Lead {
  id: string; // e.g., 'LEAD-2001'
  fullName: string;
  phone: string;
  email: string;
  source: LeadSource;
  stage: LeadStage;
  followUpDate: string; // YYYY-MM-DD
  score: number; // 0 - 100
  scoreLabel: 'Hot' | 'Warm' | 'Cold';
  fitnessGoal: string;
  notes: string;
  trialDate?: string;
  assignedTrainerId?: string;
  budget?: string;
  createdAt: string;
}

export interface Trainer {
  id: string;
  name: string;
  avatar: string;
  specialization: string[];
  experienceYears: number;
  assignedMemberCount: number;
  monthlyPerformanceScore: number; // 0 - 100
  attendanceRate: number; // e.g. 96.5%
  schedule: string; // e.g. "06:00 AM - 02:00 PM"
  rating: number; // 4.8 / 5.0
  phone: string;
  email: string;
  bio: string;
  commissionRate: number; // in %
}

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number; // in INR
  gstPercent: number; // 18% standard in India
  features: string[];
  activeMembersCount: number;
  isPopular?: boolean;
  discountCode?: string;
  discountPercent?: number;
  description: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm
  checkOutTime?: string; // HH:mm
  status: 'present' | 'late' | 'excused';
  method: 'QR Scan' | 'Biometric' | 'Manual' | 'Facial AI';
}

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash';

export interface PaymentTransaction {
  id: string; // e.g., 'TXN-9821'
  invoiceNumber: string; // e.g., 'INV-2024-001'
  memberId: string;
  memberName: string;
  memberPhone: string;
  planId: string;
  planName: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  notes?: string;
  transactionRef?: string;
}

export type ClassCategory = 'Yoga' | 'Zumba' | 'HIIT' | 'CrossFit' | 'Strength Training' | 'Cardio';

export interface FitnessClass {
  id: string;
  name: string;
  category: ClassCategory;
  trainerId: string;
  trainerName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timeSlot: string; // e.g. "07:00 AM - 08:00 AM"
  capacity: number;
  enrolledCount: number;
  enrolledMemberIds: string[];
  room: string;
  description: string;
}

export interface ExerciseItem {
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string; // e.g. "10-12"
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string; // e.g. "Day 1: Chest & Triceps"
  focus: string;
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  goal: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  daysPerWeek: number;
  days: WorkoutDay[];
  assignedMemberIds: string[];
  aiGenerated?: boolean;
}

export interface MealItem {
  mealType: 'Breakfast' | 'Mid-Morning Snack' | 'Lunch' | 'Evening Snack' | 'Dinner';
  title: string;
  description: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface DietPlan {
  id: string;
  title: string;
  dietType: 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Eggetarian' | 'Vegan';
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  budgetTier: 'Budget-Friendly' | 'Standard' | 'Premium';
  meals: MealItem[];
  assignedMemberIds: string[];
  aiGenerated?: boolean;
}

export interface AutomationRule {
  id: string;
  title: string;
  type: 'renewal_reminder' | 'birthday_wish' | 'absence_nudge' | 'payment_reminder' | 'trial_followup';
  description: string;
  triggerCondition: string;
  delayDays: number;
  isActive: boolean;
  template: string;
  targetCount: number;
  lastTriggered?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info' | 'payment';
  timestamp: string;
  read: boolean;
  link?: string;
  actionLabel?: string;
}

export interface AppSettings {
  gymName: string;
  tagline: string;
  contactPhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  currencySymbol: string;
  primaryColor: string; // Hex color
  theme: 'dark' | 'light';
  aiLanguage: 'English' | 'Hindi' | 'Hinglish';
  aiTone: 'Professional' | 'Friendly' | 'Hinglish Coach';
  enableSmsNotifications: boolean;
  enableWhatsAppAlerts: boolean;
  enableAutoRenewals: boolean;
  churnThresholdDays: number;
}

export interface ChurnPrediction {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  phone: string;
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High';
  reasons: string[];
  recommendedOffer: string;
  suggestedMessage: string;
  lastVisitDaysAgo: number;
  expiryDaysRemaining: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  isStreaming?: boolean;
  structuredCard?: {
    type: 'stats' | 'members_list' | 'lead_alert' | 'discount_campaign' | 'trainers_ranking';
    title: string;
    data: any;
  };
  actions?: {
    label: string;
    actionKey: string;
    payload?: any;
  }[];
}
