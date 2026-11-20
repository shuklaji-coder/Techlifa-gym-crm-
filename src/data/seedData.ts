import {
  Member,
  Lead,
  Trainer,
  MembershipPlan,
  AttendanceRecord,
  PaymentTransaction,
  PaymentMethod,
  FitnessClass,
  WorkoutPlan,
  DietPlan,
  AutomationRule,
  NotificationItem,
  AppSettings,
} from '../types';
import { subDays, format, addDays } from 'date-fns';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');

// ==========================================
// 1. TRAINERS (6 Seeded Trainers)
// ==========================================
export const initialTrainers: Trainer[] = [
  {
    id: 'TRN-101',
    name: 'Vikram "Titan" Rathore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialization: ['Heavy Strength', 'Hypertrophy', 'Olympic Lifting'],
    experienceYears: 8,
    assignedMemberCount: 28,
    monthlyPerformanceScore: 94,
    attendanceRate: 98.2,
    schedule: '06:00 AM - 02:00 PM',
    rating: 4.9,
    phone: '+91-98201-11223',
    email: 'vikram.rathore@techlifaa.com',
    bio: 'Former National Powerlifting competitor specializing in progressive overload, biomechanics, and body transformation.',
    commissionRate: 20,
  },
  {
    id: 'TRN-102',
    name: 'Priya "Zenith" Nair',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialization: ['Hatha Yoga', 'Functional Mobility', 'Posture Correction'],
    experienceYears: 6,
    assignedMemberCount: 24,
    monthlyPerformanceScore: 96,
    attendanceRate: 99.0,
    schedule: '07:00 AM - 03:00 PM',
    rating: 4.95,
    phone: '+91-98334-44556',
    email: 'priya.nair@techlifaa.com',
    bio: 'Certified 500-hour Ashtanga & Vinyasa instructor with deep expertise in spine rehabilitation and athletic mobility.',
    commissionRate: 18,
  },
  {
    id: 'TRN-103',
    name: 'Rajesh "Blaze" Khanna',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialization: ['CrossFit Level 2', 'HIIT Circuit', 'Fat Loss Conditioning'],
    experienceYears: 5,
    assignedMemberCount: 22,
    monthlyPerformanceScore: 91,
    attendanceRate: 96.5,
    schedule: '01:00 PM - 09:00 PM',
    rating: 4.8,
    phone: '+91-98765-88990',
    email: 'rajesh.khanna@techlifaa.com',
    bio: 'High-energy coach driving extreme calorie-burning metabolic circuits, boot camps, and athletic agility.',
    commissionRate: 18,
  },
  {
    id: 'TRN-104',
    name: 'Kavita "Pulse" Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialization: ['Zumba Pro', 'Cardio Dance', 'Women Functional Fitness'],
    experienceYears: 7,
    assignedMemberCount: 20,
    monthlyPerformanceScore: 93,
    attendanceRate: 97.4,
    schedule: '08:00 AM - 04:00 PM',
    rating: 4.88,
    phone: '+91-98112-33445',
    email: 'kavita.deshmukh@techlifaa.com',
    bio: 'Licensed Zumba Network (ZIN) instructor combining Latin rhythms, core sculpting, and high-aerobic endurance.',
    commissionRate: 15,
  },
  {
    id: 'TRN-105',
    name: 'Sameer "Apex" Qureshi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    specialization: ['Bodybuilding Prep', 'Kettlebell Sport', 'Nutrition Planning'],
    experienceYears: 9,
    assignedMemberCount: 16,
    monthlyPerformanceScore: 89,
    attendanceRate: 95.0,
    schedule: '02:00 PM - 10:00 PM',
    rating: 4.75,
    phone: '+91-99300-77661',
    email: 'sameer.qureshi@techlifaa.com',
    bio: 'Precision coach for competition prep, severe muscle hypertrophy, and customized macronutrient periodization.',
    commissionRate: 22,
  },
  {
    id: 'TRN-106',
    name: 'Amit "Core" Sengupta',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    specialization: ['Sports Rehab', 'Senior Fitness', 'Endurance Triathlon'],
    experienceYears: 10,
    assignedMemberCount: 10,
    monthlyPerformanceScore: 92,
    attendanceRate: 98.8,
    schedule: '06:00 AM - 02:00 PM',
    rating: 4.9,
    phone: '+91-98210-99887',
    email: 'amit.sengupta@techlifaa.com',
    bio: 'Physiotherapist & sports conditioner helping members overcome chronic knee/back pain while breaking personal records.',
    commissionRate: 25,
  },
];

// ==========================================
// 2. MEMBERSHIP PLANS (5 Realistic Indian Plans)
// ==========================================
export const initialPlans: MembershipPlan[] = [
  {
    id: 'PLAN-M1',
    name: 'Monthly Kickstart',
    durationMonths: 1,
    price: 2499,
    gstPercent: 18,
    description: 'Perfect for beginners starting their fitness journey or short-term visitors.',
    features: ['General Gym Access', 'Locker & Shower Facility', '1 Complimentary Fitness Assessment', 'Standard Gym Hours Access'],
    activeMembersCount: 22,
    isPopular: false,
    discountCode: 'FIRSTFIT',
    discountPercent: 10,
  },
  {
    id: 'PLAN-Q3',
    name: 'Quarterly Accelerator',
    durationMonths: 3,
    price: 6499,
    gstPercent: 18,
    description: 'Our most balanced plan for visible body recomposition and stamina building.',
    features: ['Unlimited Gym Floor Access', 'Access to Group Yoga & Zumba', 'Free InBody Composition Analysis', 'Steam & Sauna (Weekends)', '1 Guest Pass per month'],
    activeMembersCount: 38,
    isPopular: false,
    discountCode: 'SUMMER20',
    discountPercent: 15,
  },
  {
    id: 'PLAN-H6',
    name: 'Half-Yearly Elite',
    durationMonths: 6,
    price: 11499,
    gstPercent: 18,
    description: 'Serious fitness enthusiasts committed to substantial strength and fat loss goals.',
    features: ['All Group Classes (HIIT, CrossFit, Zumba)', 'Dedicated Locker', 'Dietician Macro Blueprint', '4 Guest Passes', '2 Complimentary PT Sessions', 'Free Gym Kit (Bag & Shaker)'],
    activeMembersCount: 26,
    isPopular: false,
    discountCode: 'ELITE500',
    discountPercent: 5,
  },
  {
    id: 'PLAN-Y12',
    name: 'Annual Champion (Best Value)',
    durationMonths: 12,
    price: 18999,
    gstPercent: 18,
    description: 'Ultimate year-round transformation commitment with VIP club privileges.',
    features: ['Priority All-Access 365 Days', 'Unlimited Group Classes', 'Free 1-Month Freeze Option', '6 PT Sessions Included', 'Monthly Body Composition Scans', 'VIP Steam & Spa Lounge Access', 'Discounts at In-House Protein Bar'],
    activeMembersCount: 30,
    isPopular: true,
    discountCode: 'ANNUAL3000',
    discountPercent: 15,
  },
  {
    id: 'PLAN-PT',
    name: 'Personal Training VIP Pro',
    durationMonths: 3,
    price: 34999,
    gstPercent: 18,
    description: '1-on-1 dedicated Master Trainer guidance, custom daily nutrition & bi-weekly tracking.',
    features: ['Dedicated Tier-1 Personal Trainer', '36 Private Training Sessions', 'Custom AI Daily Diet & Macro Plan', '24/7 WhatsApp Trainer Support', 'Injury Screening & Sports Rehab', 'Complete Supplement Consultation'],
    activeMembersCount: 14,
    isPopular: false,
    discountCode: 'VIPTRANSFORM',
    discountPercent: 10,
  },
];

// ==========================================
// 3. 120 REALISTIC INDIAN MEMBERS GENERATION
// ==========================================
const firstNamesMale = [
  'Aarav', 'Rohan', 'Vikram', 'Arjun', 'Kabir', 'Ishaan', 'Tanmay', 'Aditya', 'Rohit', 'Kunal',
  'Dev', 'Sahil', 'Varun', 'Nikhil', 'Manish', 'Siddharth', 'Gautam', 'Karan', 'Pranav', 'Yash',
  'Abhishek', 'Mayank', 'Harsh', 'Tushar', 'Aniket', 'Ritesh', 'Suresh', 'Deepak', 'Alok', 'Mohit',
  'Vivek', 'Anand', 'Chirag', 'Rakesh', 'Sanjay', 'Hemant', 'Sunil', 'Chetan', 'Akshay', 'Neeraj'
];

const firstNamesFemale = [
  'Priya', 'Ananya', 'Sneha', 'Pooja', 'Divya', 'Rhea', 'Kavya', 'Neha', 'Shreya', 'Isha',
  'Tanvi', 'Meera', 'Aditi', 'Roshni', 'Sunita', 'Nandini', 'Simran', 'Kritika', 'Swati', 'Anjali',
  'Bhavna', 'Deepika', 'Radhika', 'Payal', 'Mallika', 'Sonali', 'Geeta', 'Monika', 'Juhi', 'Rashmi',
  'Garima', 'Aarti', 'Karishma', 'Shikha', 'Vandana', 'Pallavi', 'Sapna', 'Preeti', 'Anita', 'Smita'
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Malhotra', 'Iyer', 'Reddy', 'Deshmukh', 'Mehta', 'Kapoor', 'Nair',
  'Singhania', 'Joshi', 'Gupta', 'Bansal', 'Chopra', 'Rao', 'Bhatia', 'Kulkarni', 'Choudhury', 'Aggarwal',
  'Saxena', 'Pandey', 'Mishra', 'Trivedi', 'Thakur', 'Gokhale', 'Chatterjee', 'Sen', 'Menon', 'Pillai',
  'Venkatesh', 'Bose', 'Dutta', 'Bhardwaj', 'Dubey', 'Soni', 'Kohli', 'Dhawan', 'Mittal', 'Goel'
];

const goals = ['Fat Loss', 'Muscle Building', 'Endurance', 'Flexibility', 'General Fitness', 'Strength'] as const;

export function generateSeedMembers(): Member[] {
  const members: Member[] = [];
  const trainerIds = initialTrainers.map(t => t.id);
  const planIds = initialPlans.map(p => p.id);

  for (let i = 1; i <= 120; i++) {
    const isMale = i % 2 !== 0;
    const fNames = isMale ? firstNamesMale : firstNamesFemale;
    const fName = fNames[(i * 7) % fNames.length];
    const lName = lastNames[(i * 11) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const id = `MEM-${1000 + i}`;

    const age = 19 + ((i * 3) % 42); // 19 to 60
    const gender = isMale ? 'male' : 'female';
    const planId = planIds[i % planIds.length];
    const trainerId = trainerIds[i % trainerIds.length];

    // Distribute join dates across the past 360 days
    const daysSinceJoin = (i * 3) % 350 + 10;
    const joinDate = format(subDays(today, daysSinceJoin), 'yyyy-MM-dd');

    // Status: mostly active, some expiring, some expired, some frozen
    let status: Member['status'] = 'active';
    let daysRemaining = 45;

    if (i % 15 === 0) {
      status = 'frozen';
      daysRemaining = 60;
    } else if (i % 9 === 0) {
      status = 'expired';
      daysRemaining = -((i % 25) + 3);
    } else if (i % 6 === 0) {
      status = 'expiring';
      daysRemaining = (i % 7) + 1; // 1-7 days remaining
    } else {
      status = 'active';
      daysRemaining = (i * 5) % 180 + 10;
    }

    const expiryDate = format(addDays(today, daysRemaining), 'yyyy-MM-dd');

    // Last attendance: active members came recently, expired or frozen came longer ago
    let lastVisitDaysAgo = 1;
    if (status === 'active') {
      lastVisitDaysAgo = (i % 6); // 0 to 5 days ago
    } else if (status === 'expiring') {
      lastVisitDaysAgo = (i % 12); // could be tapering off
    } else if (status === 'frozen') {
      lastVisitDaysAgo = 30 + (i % 30);
    } else {
      lastVisitDaysAgo = 20 + (i % 40);
    }
    const lastAttendance = format(subDays(today, lastVisitDaysAgo), 'yyyy-MM-dd');

    // Outstanding balance: most 0, some have pending dues
    let outstandingBalance = 0;
    if (i % 8 === 0) {
      outstandingBalance = (i % 3 === 0) ? 2499 : (i % 2 === 0 ? 5000 : 1200);
    }

    // Phone: +91 98XXX XXXXX
    const p1 = 98000 + ((i * 137) % 19999);
    const p2 = 10000 + ((i * 359) % 89999);
    const phone = `+91-${p1}-${p2}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i % 99}@gmail.com`;

    const emergencyNames = ['Sunil', 'Rajeev', 'Ramesh', 'Alka', 'Sunita', 'Kamala', 'Sanjay', 'Mahesh'];
    const emergencyContact = {
      name: `${emergencyNames[i % emergencyNames.length]} ${lName}`,
      relationship: i % 3 === 0 ? 'Spouse' : i % 2 === 0 ? 'Father' : 'Sibling',
      phone: `+91-${p1 - 100}-${p2 + 50}`,
    };

    const fitnessGoal = goals[i % goals.length];
    const totalVisits = Math.max(8, Math.floor(daysSinceJoin * 0.55) - (status === 'expired' ? 30 : 0));

    // Dynamic avatar from Unsplash portraits
    const avatar = isMale
      ? `https://images.unsplash.com/photo-${1500000000000 + ((i * 73921) % 90000000)}?w=120&auto=format&fit=crop&q=80`
      : `https://images.unsplash.com/photo-${1540000000000 + ((i * 62911) % 90000000)}?w=120&auto=format&fit=crop&q=80`;

    // Body measurements history (3 entries: start, mid, current)
    const baseWeight = isMale ? 78 + (i % 18) - 5 : 62 + (i % 15) - 4;
    const baseFat = isMale ? 24 + (i % 8) : 29 + (i % 7);
    const measurements: Member['measurements'] = [
      {
        date: format(subDays(today, 60), 'yyyy-MM-dd'),
        weightKg: baseWeight + 2.5,
        bodyFatPercent: baseFat + 1.8,
        chestCm: isMale ? 101 : 92,
        waistCm: isMale ? 89 : 78,
        armsCm: isMale ? 35 : 28,
        hipsCm: isMale ? 99 : 98,
      },
      {
        date: format(subDays(today, 30), 'yyyy-MM-dd'),
        weightKg: baseWeight + 1.0,
        bodyFatPercent: baseFat + 0.6,
        chestCm: isMale ? 102 : 91,
        waistCm: isMale ? 87 : 76,
        armsCm: isMale ? 36 : 28.5,
        hipsCm: isMale ? 98 : 96,
      },
      {
        date: format(subDays(today, 5), 'yyyy-MM-dd'),
        weightKg: baseWeight,
        bodyFatPercent: baseFat,
        chestCm: isMale ? 103 : 90,
        waistCm: isMale ? 85 : 74,
        armsCm: isMale ? 36.8 : 29,
        hipsCm: isMale ? 97 : 95,
      },
    ];

    members.push({
      id,
      fullName,
      avatar: avatar.includes('undefined') 
        ? (isMale ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120') 
        : avatar,
      phone,
      email,
      age,
      gender,
      joinDate,
      planId,
      status,
      assignedTrainerId: trainerId,
      emergencyContact,
      fitnessGoal,
      lastAttendance,
      outstandingBalance,
      expiryDate,
      totalVisits,
      notes: i % 4 === 0 ? 'Prefers morning strength training, mild lower back tightness.' : undefined,
      measurements,
    });
  }

  return members;
}

// ==========================================
// 4. 40 REALISTIC LEADS (Kanban Pipeline)
// ==========================================
export const initialLeads: Lead[] = [
  {
    id: 'LEAD-2001',
    fullName: 'Rahul Deshmukh',
    phone: '+91-98210-44112',
    email: 'rahul.deshmukh@gmail.com',
    source: 'Instagram',
    stage: 'new',
    followUpDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    score: 85,
    scoreLabel: 'Hot',
    fitnessGoal: 'Muscle Gain & Bulk',
    notes: 'Clicked Instagram reel on 12-week transformation. Asked about evening batches.',
    budget: '₹15,000 - ₹20,000',
    createdAt: format(subDays(today, 1), 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2002',
    fullName: 'Meenakshi Iyer',
    phone: '+91-98711-22334',
    email: 'meenakshi.iyer@outlook.com',
    source: 'Google Search',
    stage: 'contacted',
    followUpDate: format(today, 'yyyy-MM-dd'),
    score: 72,
    scoreLabel: 'Warm',
    fitnessGoal: 'Weight Loss & Yoga',
    notes: 'Looking for 7 AM morning yoga batches. Sent plan brochure on WhatsApp.',
    budget: '₹8,000 - ₹12,000',
    createdAt: format(subDays(today, 3), 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2003',
    fullName: 'Kunal Singhania',
    phone: '+91-99882-33441',
    email: 'kunal.singhania@yahoo.com',
    source: 'Walk-in',
    stage: 'trial_booked',
    followUpDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    trialDate: format(addDays(today, 1), 'yyyy-MM-dd') + ' 06:30 PM',
    score: 92,
    scoreLabel: 'Hot',
    fitnessGoal: 'Strength Training',
    notes: 'Visited gym yesterday. Impressed by Hammer Strength equipment. Free trial booked with Vikram.',
    assignedTrainerId: 'TRN-101',
    budget: '₹18,000 (Annual)',
    createdAt: format(subDays(today, 2), 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2004',
    fullName: 'Tanvi Agarwal',
    phone: '+91-98330-99881',
    email: 'tanvi.agarwal@gmail.com',
    source: 'Member Referral',
    stage: 'joined',
    followUpDate: format(subDays(today, 1), 'yyyy-MM-dd'),
    score: 98,
    scoreLabel: 'Hot',
    fitnessGoal: 'Zumba & Cardio',
    notes: 'Referred by active member Priya Verma. Converted to Quarterly Pro plan!',
    budget: '₹6,499',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2005',
    fullName: 'Deepak Bansal',
    phone: '+91-98110-55667',
    email: 'deepak.b@rediffmail.com',
    source: 'Facebook Ads',
    stage: 'lost',
    followUpDate: format(subDays(today, 7), 'yyyy-MM-dd'),
    score: 30,
    scoreLabel: 'Cold',
    fitnessGoal: 'General Fitness',
    notes: 'Relocating to Bangalore next month. Follow up again after 6 months.',
    budget: 'Low',
    createdAt: format(subDays(today, 15), 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2006',
    fullName: 'Siddharth Rao',
    phone: '+91-97690-12345',
    email: 'sid.rao@gmail.com',
    source: 'Instagram',
    stage: 'new',
    followUpDate: format(today, 'yyyy-MM-dd'),
    score: 80,
    scoreLabel: 'Hot',
    fitnessGoal: 'Lean Muscle & Six Pack',
    notes: 'Software engineer at Powai. Wants late-night access (9 PM to 10 PM).',
    budget: '₹12,000+',
    createdAt: format(today, 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2007',
    fullName: 'Ananya Roy',
    phone: '+91-98205-67890',
    email: 'ananya.roy@gmail.com',
    source: 'Member Referral',
    stage: 'trial_booked',
    followUpDate: format(addDays(today, 2), 'yyyy-MM-dd'),
    trialDate: format(addDays(today, 2), 'yyyy-MM-dd') + ' 08:00 AM',
    score: 95,
    scoreLabel: 'Hot',
    fitnessGoal: 'Functional HIIT',
    notes: 'Colleague of member Rohan Malhotra. Wants to test Rajesh’s CrossFit class.',
    assignedTrainerId: 'TRN-103',
    budget: '₹18,000+',
    createdAt: format(subDays(today, 2), 'yyyy-MM-dd'),
  },
  {
    id: 'LEAD-2008',
    fullName: 'Gautam Chopra',
    phone: '+91-99201-98765',
    email: 'gautam.chopra@corp.in',
    source: 'Google Search',
    stage: 'contacted',
    followUpDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    score: 65,
    scoreLabel: 'Warm',
    fitnessGoal: 'Post-Surgery Knee Rehab',
    notes: 'Needs certified physiotherapist supervision. Recommend Amit Sengupta.',
    assignedTrainerId: 'TRN-106',
    budget: '₹35,000 (VIP PT)',
    createdAt: format(subDays(today, 4), 'yyyy-MM-dd'),
  },
];

// Dynamically generate remaining 32 leads to reach 40 realistic leads
const leadSources: Lead['source'][] = ['Walk-in', 'Instagram', 'Google Search', 'Member Referral', 'Facebook Ads', 'Flyer / Offline'];
const leadStages: Lead['stage'][] = ['new', 'contacted', 'trial_booked', 'joined', 'lost'];
const leadNames = [
  'Varun Kapoor', 'Shruti Saxena', 'Karan Johar', 'Neha Dhupia', 'Mohit Suri', 'Juhi Chawla',
  'Sunil Gavaskar', 'Ritesh Batra', 'Isha Ambani', 'Pranav Mistry', 'Aditi Rao', 'Yash Raj',
  'Shreya Ghoshal', 'Nikhil Advani', 'Rhea Chakraborty', 'Alok Nath', 'Bhavna Pandey', 'Chetan Bhagat',
  'Garima Tiwari', 'Harsh Goenka', 'Kavya Madhavan', 'Manish Malhotra', 'Nandini Bhalla', 'Omkar Salvi',
  'Pooja Hegde', 'Radhika Apte', 'Sachin Pilot', 'Tanmay Bhat', 'Urvashi Rautela', 'Vicky Kaushal',
  'Zoya Akhtar', 'Abhay Deol'
];

leadNames.forEach((name, idx) => {
  const leadIdNum = 2009 + idx;
  const stage = leadStages[idx % leadStages.length];
  const source = leadSources[(idx * 3) % leadSources.length];
  const score = stage === 'joined' ? 99 : stage === 'trial_booked' ? 88 : stage === 'new' ? 78 : stage === 'contacted' ? 64 : 28;
  const scoreLabel: Lead['scoreLabel'] = score >= 75 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold';

  initialLeads.push({
    id: `LEAD-${leadIdNum}`,
    fullName: name,
    phone: `+91-${98100 + idx * 11}-${10200 + idx * 73}`,
    email: `${name.toLowerCase().replace(' ', '.')}${idx}@gmail.com`,
    source,
    stage,
    followUpDate: format(addDays(today, (idx % 5) - 2), 'yyyy-MM-dd'),
    trialDate: stage === 'trial_booked' ? format(addDays(today, 1), 'yyyy-MM-dd') + ' 07:00 PM' : undefined,
    score,
    scoreLabel,
    fitnessGoal: goals[idx % goals.length],
    notes: `Inquired via ${source} regarding ${goals[idx % goals.length]} program. Discussed flexible schedules.`,
    budget: idx % 2 === 0 ? '₹11,499 (Half-Yearly)' : '₹18,999 (Annual)',
    createdAt: format(subDays(today, (idx % 12) + 1), 'yyyy-MM-dd'),
  });
});

// ==========================================
// 5. 3 MONTHS OF REALISTIC ATTENDANCE RECORDS
// ==========================================
export function generateSeedAttendance(members: Member[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const methods: AttendanceRecord['method'][] = ['QR Scan', 'Biometric', 'Manual', 'Facial AI'];

  // Generate today's live check-ins (approx 45 check-ins across the day)
  const peakMorningHours = ['06:15', '06:45', '07:10', '07:35', '08:00', '08:25', '08:50', '09:15'];
  const peakEveningHours = ['17:05', '17:40', '18:15', '18:50', '19:20', '19:55', '20:30', '21:10'];
  const allHours = [...peakMorningHours, ...peakEveningHours];

  // Today's attendance
  for (let i = 0; i < 48; i++) {
    const member = members[i % members.length];
    const checkIn = allHours[i % allHours.length];
    const checkInHour = parseInt(checkIn.split(':')[0], 10);
    const checkOutMin = (parseInt(checkIn.split(':')[1], 10) + 55) % 60;
    const checkOutHour = checkInHour + 1;
    const checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMin.toString().padStart(2, '0')}`;

    records.push({
      id: `ATT-TODAY-${100 + i}`,
      memberId: member.id,
      memberName: member.fullName,
      memberAvatar: member.avatar,
      date: todayStr,
      checkInTime: checkIn,
      checkOutTime: i < 35 ? checkOut : undefined, // Some currently working out!
      status: 'present',
      method: methods[i % methods.length],
    });
  }

  // Previous 30-60 days historical samples (around 20-40 check-ins per day for trend charts)
  for (let dayOffset = 1; dayOffset <= 45; dayOffset++) {
    const dateStr = format(subDays(today, dayOffset), 'yyyy-MM-dd');
    const dayCheckInCount = 35 + ((dayOffset * 7) % 25); // fluctuates between 35 and 60 check-ins per day

    for (let c = 0; c < dayCheckInCount; c++) {
      const member = members[(dayOffset * 3 + c) % members.length];
      const checkInTime = allHours[c % allHours.length];
      records.push({
        id: `ATT-HIST-${dayOffset}-${c}`,
        memberId: member.id,
        memberName: member.fullName,
        date: dateStr,
        checkInTime,
        checkOutTime: '19:45',
        status: 'present',
        method: methods[(dayOffset + c) % methods.length],
      });
    }
  }

  return records;
}

// ==========================================
// 6. 3 MONTHS OF PAYMENT TRANSACTIONS
// ==========================================
export function generateSeedPayments(members: Member[]): PaymentTransaction[] {
  const transactions: PaymentTransaction[] = [];
  const paymentMethods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'];

  let invoiceCounter = 1001;

  // Generate 85 realistic historical and recent transactions
  for (let i = 0; i < 85; i++) {
    const member = members[(i * 3) % members.length];
    const plan = initialPlans[i % initialPlans.length];
    const daysAgo = (i * 2) % 85;
    const dateStr = format(subDays(today, daysAgo), 'yyyy-MM-dd');

    const totalAmount = plan.price;
    const baseAmount = Math.round(totalAmount / 1.18);
    const gstAmount = totalAmount - baseAmount;
    const method = paymentMethods[i % paymentMethods.length];

    transactions.push({
      id: `TXN-${9000 + i}`,
      invoiceNumber: `INV-2024-${invoiceCounter++}`,
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      planId: plan.id,
      planName: plan.name,
      baseAmount,
      gstAmount,
      totalAmount,
      date: dateStr,
      paymentMethod: method,
      status: i === 7 ? 'pending' : i === 19 ? 'failed' : 'paid',
      transactionRef: method === 'UPI' ? `UPI/${100234000000 + i}` : `CRD-${40120000 + i}`,
      notes: `Subscription renewal for ${plan.name} (GST 18% inclusive)`,
    });
  }

  return transactions;
}

// ==========================================
// 7. FITNESS CLASSES & WEEKLY TIMETABLE
// ==========================================
export const initialClasses: FitnessClass[] = [
  {
    id: 'CLS-101',
    name: 'Morning Power Vinyasa Yoga',
    category: 'Yoga',
    trainerId: 'TRN-102',
    trainerName: 'Priya Nair',
    dayOfWeek: 'Monday',
    timeSlot: '07:00 AM - 08:00 AM',
    capacity: 20,
    enrolledCount: 18,
    enrolledMemberIds: ['MEM-1001', 'MEM-1002', 'MEM-1005', 'MEM-1008'],
    room: 'Studio A (Zen Hall)',
    description: 'Dynamic breath-synchronized movement building core strength, balance, and mindful flexibility.',
  },
  {
    id: 'CLS-102',
    name: 'Metabolic HIIT & Core Burner',
    category: 'HIIT',
    trainerId: 'TRN-103',
    trainerName: 'Rajesh Khanna',
    dayOfWeek: 'Monday',
    timeSlot: '06:30 PM - 07:30 PM',
    capacity: 25,
    enrolledCount: 24,
    enrolledMemberIds: ['MEM-1003', 'MEM-1004', 'MEM-1010', 'MEM-1012'],
    room: 'Main Arena / Turf',
    description: 'High-intensity tabata and kettlebell blast maximizing calorie afterburn (EPOC) for 24 hours.',
  },
  {
    id: 'CLS-103',
    name: 'Bollywood Cardio Zumba',
    category: 'Zumba',
    trainerId: 'TRN-104',
    trainerName: 'Kavita Deshmukh',
    dayOfWeek: 'Tuesday',
    timeSlot: '08:00 AM - 09:00 AM',
    capacity: 30,
    enrolledCount: 29,
    enrolledMemberIds: ['MEM-1002', 'MEM-1006', 'MEM-1014'],
    room: 'Studio B (Dance Mirror)',
    description: 'Electrifying Bollywood beats and rhythmic Latin choreography that melts up to 600 calories.',
  },
  {
    id: 'CLS-104',
    name: 'CrossFit WOD & Barbell Tech',
    category: 'CrossFit',
    trainerId: 'TRN-101',
    trainerName: 'Vikram Rathore',
    dayOfWeek: 'Wednesday',
    timeSlot: '06:00 AM - 07:00 AM',
    capacity: 15,
    enrolledCount: 15, // Sold out
    enrolledMemberIds: ['MEM-1001', 'MEM-1007', 'MEM-1015'],
    room: 'CrossFit Box / Rig Area',
    description: 'Clean and jerks, box jumps, rope climbs, and heavy sled pushes for all-round conditioning.',
  },
  {
    id: 'CLS-105',
    name: 'Glutes & Core Sculpt',
    category: 'Strength Training',
    trainerId: 'TRN-105',
    trainerName: 'Sameer Qureshi',
    dayOfWeek: 'Thursday',
    timeSlot: '07:00 PM - 08:00 PM',
    capacity: 20,
    enrolledCount: 16,
    enrolledMemberIds: ['MEM-1008', 'MEM-1011'],
    room: 'Studio A (Zen Hall)',
    description: 'Targeted resistance bands, hip thrusts, and abdominal vacuum techniques for lower body power.',
  },
  {
    id: 'CLS-106',
    name: 'Cardio Spin & Sprint Challenge',
    category: 'Cardio',
    trainerId: 'TRN-106',
    trainerName: 'Amit Sengupta',
    dayOfWeek: 'Saturday',
    timeSlot: '08:30 AM - 09:30 AM',
    capacity: 22,
    enrolledCount: 20,
    enrolledMemberIds: ['MEM-1003', 'MEM-1009', 'MEM-1013'],
    room: 'Spinning Studio',
    description: 'Climb steep hills, race high-RPM intervals, and boost cardiovascular VO2 max.',
  },
];

// ==========================================
// 8. WORKOUT PLANS LIBRARY
// ==========================================
export const initialWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'WKP-1',
    title: '4-Week Hypertrophy Push-Pull-Legs Split',
    goal: 'Muscle Building',
    level: 'Intermediate',
    durationWeeks: 4,
    daysPerWeek: 5,
    assignedMemberIds: ['MEM-1001', 'MEM-1003', 'MEM-1007'],
    aiGenerated: false,
    days: [
      {
        dayName: 'Day 1: Push (Chest, Shoulders & Triceps)',
        focus: 'Upper Body Pressing Power',
        exercises: [
          { name: 'Barbell Incline Bench Press', targetMuscle: 'Upper Chest', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Control eccentric descent for 3 seconds.' },
          { name: 'Flat Dumbbell Press', targetMuscle: 'Mid Chest', sets: 3, reps: '10-12', restSeconds: 75 },
          { name: 'Standing Overhead Barbell Military Press', targetMuscle: 'Front Deltoids', sets: 4, reps: '8', restSeconds: 90 },
          { name: 'Dumbbell Lateral Raises', targetMuscle: 'Side Deltoids', sets: 4, reps: '15-20', restSeconds: 45, notes: 'Hold contraction at the peak.' },
          { name: 'Cable Rope Tricep Pushdowns', targetMuscle: 'Triceps Lateral Head', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        dayName: 'Day 2: Pull (Back, Rear Delts & Biceps)',
        focus: 'Back Width & Thickness',
        exercises: [
          { name: 'Conventional Deadlift', targetMuscle: 'Posterior Chain & Erector Spinae', sets: 4, reps: '6', restSeconds: 120 },
          { name: 'Lat Pulldowns (Wide Grip)', targetMuscle: 'Latissimus Dorsi', sets: 4, reps: '10-12', restSeconds: 75 },
          { name: 'Seated Cable Row (Close V-Grip)', targetMuscle: 'Mid Back & Rhomboids', sets: 3, reps: '10', restSeconds: 75 },
          { name: 'Face Pulls with External Rotation', targetMuscle: 'Rear Delts & Rotator Cuff', sets: 4, reps: '15', restSeconds: 60 },
          { name: 'Incline Dumbbell Bicep Curls', targetMuscle: 'Bicep Long Head', sets: 3, reps: '12', restSeconds: 60 },
        ],
      },
      {
        dayName: 'Day 3: Legs & Abs (Quad & Hamstring Dominant)',
        focus: 'Lower Body Strength & Core',
        exercises: [
          { name: 'Barbell Back Squat', targetMuscle: 'Quadriceps & Glutes', sets: 4, reps: '8-10', restSeconds: 120, notes: 'Maintain neutral spine, deep past parallel.' },
          { name: 'Romanian Deadlifts (RDL)', targetMuscle: 'Hamstrings & Glutes', sets: 4, reps: '10', restSeconds: 90 },
          { name: 'Leg Press 45-Degree', targetMuscle: 'Quadriceps', sets: 3, reps: '12-15', restSeconds: 90 },
          { name: 'Standing Calf Raises', targetMuscle: 'Gastrocnemius', sets: 4, reps: '15-20', restSeconds: 45 },
          { name: 'Hanging Leg Raises', targetMuscle: 'Lower Abdominals', sets: 3, reps: '15', restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: 'WKP-2',
    title: 'Fat Loss Shred & Metabolic Conditioning',
    goal: 'Fat Loss',
    level: 'Beginner',
    durationWeeks: 4,
    daysPerWeek: 4,
    assignedMemberIds: ['MEM-1002', 'MEM-1005', 'MEM-1011'],
    aiGenerated: true,
    days: [
      {
        dayName: 'Day 1: Full Body Functional Circuit',
        focus: 'High Heart Rate & Calorie Torch',
        exercises: [
          { name: 'Goblet Squats', targetMuscle: 'Quads & Glutes', sets: 4, reps: '15', restSeconds: 45 },
          { name: 'Dumbbell Push Press', targetMuscle: 'Shoulders & Triceps', sets: 4, reps: '12', restSeconds: 45 },
          { name: 'Kettlebell Swings', targetMuscle: 'Posterior Chain', sets: 4, reps: '20', restSeconds: 45 },
          { name: 'Mountain Climbers', targetMuscle: 'Core & Cardio', sets: 3, reps: '30 secs', restSeconds: 30 },
          { name: 'Rowing Machine Sprint', targetMuscle: 'Cardio VO2', sets: 5, reps: '250m', restSeconds: 60 },
        ],
      },
      {
        dayName: 'Day 2: Upper Body Sculpt & Core Intervals',
        focus: 'Tone & Muscle Retention',
        exercises: [
          { name: 'Dumbbell Chest Supported Rows', targetMuscle: 'Upper Back', sets: 3, reps: '12', restSeconds: 60 },
          { name: 'Incline Push-ups', targetMuscle: 'Chest', sets: 3, reps: '12', restSeconds: 45 },
          { name: 'Dumbbell Arnold Press', targetMuscle: 'Deltoids', sets: 3, reps: '12', restSeconds: 60 },
          { name: 'Plank with Shoulder Taps', targetMuscle: 'Core Stability', sets: 3, reps: '40 secs', restSeconds: 45 },
        ],
      },
    ],
  },
];

// ==========================================
// 9. DIET PLANS LIBRARY (Authentic Indian Macro Plans)
// ==========================================
export const initialDietPlans: DietPlan[] = [
  {
    id: 'DIET-1',
    title: 'High Protein Indian Vegetarian Muscle Fuel',
    dietType: 'Vegetarian',
    dailyCalories: 2250,
    proteinGrams: 140,
    carbsGrams: 230,
    fatsGrams: 65,
    budgetTier: 'Budget-Friendly',
    assignedMemberIds: ['MEM-1001', 'MEM-1004'],
    aiGenerated: true,
    meals: [
      {
        mealType: 'Breakfast',
        title: 'Paneer Bhurji & Multigrain Toast + Whey Protein',
        description: '100g low-fat paneer sautéed with onions, tomatoes, turmeric, green chillies + 2 slices multigrain bread + 1 scoop whey in water.',
        calories: 520,
        proteinGrams: 42,
        carbsGrams: 48,
        fatsGrams: 16,
      },
      {
        mealType: 'Mid-Morning Snack',
        title: 'Sprouted Moong Chaat with Roasted Almonds',
        description: '1 cup boiled sprouted moong with diced cucumber, lemon juice, chaat masala + 10 soaked almonds.',
        calories: 260,
        proteinGrams: 14,
        carbsGrams: 32,
        fatsGrams: 8,
      },
      {
        mealType: 'Lunch',
        title: 'Dal Makhani Light + Soya Chunks Curry + Brown Rice & Curd',
        description: '50g soya chunks in tomato-onion gravy + 1 katori yellow/black dal + 1 cup steamed brown rice + 100g low-fat curd + cucumber salad.',
        calories: 680,
        proteinGrams: 45,
        carbsGrams: 85,
        fatsGrams: 18,
      },
      {
        mealType: 'Evening Snack',
        title: 'Roasted Chana (Chickpeas) + Black Coffee / Green Tea',
        description: '50g crunchy roasted chana with spices and an unsweetened Americano or green tea.',
        calories: 190,
        proteinGrams: 11,
        carbsGrams: 28,
        fatsGrams: 3,
      },
      {
        mealType: 'Dinner',
        title: 'Tofu Palak / Paneer Stir-Fry with Jowar Roti',
        description: '120g sautéed tofu or paneer in fresh spinach puree + 2 thin Jowar/Bajra rotis + mixed greens.',
        calories: 600,
        proteinGrams: 28,
        carbsGrams: 47,
        fatsGrams: 20,
      },
    ],
  },
  {
    id: 'DIET-2',
    title: 'Lean Shredding Non-Veg Athletic Plan',
    dietType: 'Non-Vegetarian',
    dailyCalories: 2050,
    proteinGrams: 165,
    carbsGrams: 190,
    fatsGrams: 52,
    budgetTier: 'Standard',
    assignedMemberIds: ['MEM-1002', 'MEM-1003'],
    aiGenerated: false,
    meals: [
      {
        mealType: 'Breakfast',
        title: '4 Whole Egg Masala Omelette + Rolled Oats Porridge',
        description: '3 egg whites + 1 whole egg cooked with chillies, coriander + 50g rolled oats cooked in water with cinnamon and 1 chopped banana.',
        calories: 490,
        proteinGrams: 36,
        carbsGrams: 54,
        fatsGrams: 14,
      },
      {
        mealType: 'Mid-Morning Snack',
        title: 'Greek Yogurt with Seasonal Berries or Pomegranate',
        description: '150g unsweetened Greek yogurt topped with fresh pomegranate seeds and chia seeds.',
        calories: 220,
        proteinGrams: 16,
        carbsGrams: 22,
        fatsGrams: 6,
      },
      {
        mealType: 'Lunch',
        title: 'Grilled Tandoori Chicken Breast + Quinoa / Brown Rice + Dal',
        description: '150g skinless chicken breast marinated in hung curd and tandoori spices + 1 cup boiled quinoa or brown rice + green salad.',
        calories: 620,
        proteinGrams: 52,
        carbsGrams: 60,
        fatsGrams: 12,
      },
      {
        mealType: 'Evening Snack',
        title: 'Boiled Egg Whites (3) + Coconut Water',
        description: '3 hard-boiled egg whites with black pepper + 1 fresh tender coconut water.',
        calories: 150,
        proteinGrams: 15,
        carbsGrams: 10,
        fatsGrams: 1,
      },
      {
        mealType: 'Dinner',
        title: 'Steamed Fish Fillet (Rohu/Basa) with Stir-Fried Broccoli & Roti',
        description: '150g pan-seared fish in mustard-garlic sauce + steamed vegetables (beans, carrot, broccoli) + 1 whole wheat phulka.',
        calories: 570,
        proteinGrams: 46,
        carbsGrams: 44,
        fatsGrams: 19,
      },
    ],
  },
  {
    id: 'DIET-3',
    title: 'Pure Jain High Protein Fitness Plan',
    dietType: 'Jain',
    dailyCalories: 1950,
    proteinGrams: 125,
    carbsGrams: 220,
    fatsGrams: 55,
    budgetTier: 'Budget-Friendly',
    assignedMemberIds: ['MEM-1006'],
    aiGenerated: true,
    meals: [
      {
        mealType: 'Breakfast',
        title: 'Besan & Moong Dal Cheela with Mint Curd Chutney',
        description: '2 savory gram flour & split green gram pancakes with crushed cumin, turmeric and homemade mint-curd dip.',
        calories: 440,
        proteinGrams: 24,
        carbsGrams: 58,
        fatsGrams: 12,
      },
      {
        mealType: 'Mid-Morning Snack',
        title: 'Whey Protein Isolate Shake + Roasted Makhana (Foxnuts)',
        description: '1 scoop certified whey protein in water + 30g roasted spiced makhana.',
        calories: 240,
        proteinGrams: 27,
        carbsGrams: 21,
        fatsGrams: 3,
      },
      {
        mealType: 'Lunch',
        title: 'Fresh Paneer Tikka + Toor Dal + Steamed Rice & 2 Phulkas',
        description: '120g fresh cow milk paneer with bell peppers (no onion, no garlic) + yellow toor dal + phulkas with drop of pure ghee.',
        calories: 640,
        proteinGrams: 38,
        carbsGrams: 78,
        fatsGrams: 22,
      },
      {
        mealType: 'Dinner',
        title: 'Moong Dal Khichdi with Low-Fat Cow Ghee & Plain Curd',
        description: 'Lightly seasoned yellow moong khichdi with cumin, asafoetida (hing) + 150g set curd.',
        calories: 480,
        proteinGrams: 22,
        carbsGrams: 68,
        fatsGrams: 12,
      },
    ],
  },
];

// ==========================================
// 10. CONFIGURABLE AUTOMATIONS
// ==========================================
export const initialAutomations: AutomationRule[] = [
  {
    id: 'AUTO-1',
    title: 'Membership Renewal Countdown (3 Days Before)',
    type: 'renewal_reminder',
    description: 'Sends automated WhatsApp reminder when membership has 3 days remaining with one-click UPI renewal link.',
    triggerCondition: 'Membership expiry in 3 days',
    delayDays: 3,
    isActive: true,
    template: 'Namaste {{name}}! 🏋️‍♂️ Your TECHLIFAA GYM membership expires in 3 days on {{expiry_date}}. Renew today to lock in your current rate and keep your training streak unbroken! Click here to renew online: {{payment_link}}',
    targetCount: 14,
    lastTriggered: format(subDays(today, 1), 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'AUTO-2',
    title: '7-Day Absence Re-Engagement Nudge',
    type: 'absence_nudge',
    description: 'Triggers when an active member has not checked in for 7 consecutive days to prevent churn.',
    triggerCondition: 'No check-in for 7+ days',
    delayDays: 7,
    isActive: true,
    template: 'Hey {{name}}! We missed you on the gym floor this week! 💪 Consistency is where the magic happens. Your trainer {{trainer_name}} has saved a killer workout for you tomorrow. Drop by before 8 PM for a free energy smoothie!',
    targetCount: 8,
    lastTriggered: format(today, 'yyyy-MM-dd 09:30'),
  },
  {
    id: 'AUTO-3',
    title: 'Birthday Celebration & Complimentary Shake',
    type: 'birthday_wish',
    description: 'Sends heartfelt birthday greetings along with a free recovery shake coupon at our in-house protein bar.',
    triggerCondition: 'Member birthday today',
    delayDays: 0,
    isActive: true,
    template: 'Happy Birthday {{name}}! 🎂🎉 May this year bring you PRs, boundless energy, and peak health! Claim your Free Signature Whey Shake at the TECHLIFAA Protein Bar today. Keep crushing it!',
    targetCount: 3,
    lastTriggered: format(today, 'yyyy-MM-dd 08:00'),
  },
  {
    id: 'AUTO-4',
    title: 'Pending Fee & Due Date Reminder',
    type: 'payment_reminder',
    description: 'Politely alerts members with outstanding balances past 5 days with GST breakdown.',
    triggerCondition: 'Outstanding balance > 0 past 5 days',
    delayDays: 5,
    isActive: true,
    template: 'Dear {{name}}, this is a friendly reminder regarding your pending balance of {{amount}} for invoice {{invoice_number}}. Please clear via UPI: techlifaa@okaxis or visit the front desk to avoid service interruptions.',
    targetCount: 12,
    lastTriggered: format(subDays(today, 2), 'yyyy-MM-dd 11:15'),
  },
  {
    id: 'AUTO-5',
    title: 'Trial Booking Post-Session Conversion',
    type: 'trial_followup',
    description: 'Follows up 2 hours after a lead completes their free trial workout with an exclusive same-day discount offer.',
    triggerCondition: '2 hours post-trial check-out',
    delayDays: 0,
    isActive: true,
    template: 'Hey {{name}}! Hope you had an exhilarating workout today with Coach {{trainer_name}}! 🚀 If you join today, we are unlocking an exclusive 15% Welcome Discount + Free Fitness Kit. Reply YES to reserve your spot!',
    targetCount: 5,
    lastTriggered: format(today, 'yyyy-MM-dd 12:45'),
  },
];

// ==========================================
// 11. NOTIFICATIONS
// ==========================================
export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'High Churn Alert: 5 Members Inactive',
    message: 'AI detected 5 long-tenured members with sudden attendance drops > 10 days. Review retention suggestions.',
    type: 'warning',
    timestamp: '10 mins ago',
    read: false,
    link: '/ai-intelligence',
    actionLabel: 'Review AI Churn',
  },
  {
    id: 'NOTIF-2',
    title: 'Payment Received: ₹18,999 (Annual Champion)',
    message: 'Aarav Sharma cleared invoice INV-2024-1048 via UPI. Membership extended to Nov 2025.',
    type: 'payment',
    timestamp: '45 mins ago',
    read: false,
    link: '/payments',
    actionLabel: 'View Invoice',
  },
  {
    id: 'NOTIF-3',
    title: 'New Lead: Kunal Singhania Booked Trial',
    message: 'Walk-in lead booked free trial session with Trainer Vikram Rathore for tomorrow 6:30 PM.',
    type: 'info',
    timestamp: '2 hours ago',
    read: false,
    link: '/leads',
    actionLabel: 'Open Kanban',
  },
  {
    id: 'NOTIF-4',
    title: 'Class Capacity Alert: CrossFit WOD Sold Out',
    message: 'Wednesday 6:00 AM CrossFit class has hit 15/15 capacity. Consider opening a secondary batch.',
    type: 'info',
    timestamp: '4 hours ago',
    read: true,
    link: '/classes',
  },
  {
    id: 'NOTIF-5',
    title: 'Monthly Revenue Goal Reached: ₹3,85,000',
    message: 'Congratulations! The gym achieved 105% of its November target ahead of month-end.',
    type: 'success',
    timestamp: 'Yesterday',
    read: true,
    link: '/reports',
  },
];

// ==========================================
// 12. DEFAULT APP SETTINGS
// ==========================================
export const defaultSettings: AppSettings = {
  gymName: 'TECHLIFAA GYM AI',
  tagline: 'Intelligent Fitness Business Management',
  contactPhone: '+91 98200 12345',
  email: 'director@techlifaa.com',
  address: 'Level 3 & 4, Apex Tower, Linking Road, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra - 400050',
  gstNumber: '27AAAAA0000A1Z5',
  currencySymbol: '₹',
  primaryColor: '#C6FF00', // Electric Lime default
  theme: 'dark',
  aiLanguage: 'English',
  aiTone: 'Professional',
  enableSmsNotifications: true,
  enableWhatsAppAlerts: true,
  enableAutoRenewals: true,
  churnThresholdDays: 10,
};
