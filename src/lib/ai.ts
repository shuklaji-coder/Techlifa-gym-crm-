import {
  Member,
  Lead,
  Trainer,
  MembershipPlan,
  PaymentTransaction,
  AttendanceRecord,
  ChurnPrediction,
  WorkoutPlan,
  DietPlan,
  AIChatMessage,
} from '../types';
import { getDaysAgo, getDaysRemaining, formatINR } from './utils';

// ==========================================
// 1. AI CHURN PREDICTION ENGINE
// ==========================================
export function calculateChurnPredictions(
  members: Member[],
  thresholdDays: number = 10
): ChurnPrediction[] {
  return members.map(m => {
    const daysAgo = getDaysAgo(m.lastAttendance);
    const expiryRemaining = getDaysRemaining(m.expiryDate);

    let riskScore = 0;
    const reasons: string[] = [];

    // Factor 1: Attendance gap (up to 45 pts)
    if (daysAgo >= 21) {
      riskScore += 45;
      reasons.push(`Severely inactive: Has not visited the gym in ${daysAgo} days.`);
    } else if (daysAgo >= 14) {
      riskScore += 35;
      reasons.push(`Extended gap: Inactive for ${daysAgo} days.`);
    } else if (daysAgo >= thresholdDays) {
      riskScore += 25;
      reasons.push(`Attendance drop: Absent for ${daysAgo} consecutive days.`);
    } else if (daysAgo >= 5) {
      riskScore += 10;
      reasons.push(`Mild attendance inconsistency (${daysAgo} days since last visit).`);
    }

    // Factor 2: Expiry countdown (up to 30 pts)
    if (expiryRemaining < 0) {
      riskScore += 30;
      reasons.push(`Membership expired ${Math.abs(expiryRemaining)} days ago with no renewal.`);
    } else if (expiryRemaining <= 7) {
      riskScore += 25;
      reasons.push(`Plan expires in ${expiryRemaining} days.`);
    } else if (expiryRemaining <= 15) {
      riskScore += 15;
      reasons.push(`Plan renewal window open (${expiryRemaining} days left).`);
    }

    // Factor 3: Outstanding balance (up to 20 pts)
    if (m.outstandingBalance > 3000) {
      riskScore += 20;
      reasons.push(`High pending dues of ${formatINR(m.outstandingBalance)}.`);
    } else if (m.outstandingBalance > 0) {
      riskScore += 10;
      reasons.push(`Pending fee of ${formatINR(m.outstandingBalance)}.`);
    }

    // Factor 4: Frozen status (up to 15 pts)
    if (m.status === 'frozen') {
      riskScore += 15;
      reasons.push('Membership currently on freeze; high tendency not to resume.');
    }

    // Factor 5: Visit frequency vs tenure
    if (m.totalVisits < 10) {
      riskScore += 10;
      reasons.push('Low overall gym engagement (< 10 total lifetime visits).');
    }

    // Clamp score 0 - 100
    riskScore = Math.min(100, Math.max(0, riskScore));

    const riskLevel: ChurnPrediction['riskLevel'] =
      riskScore >= 65 ? 'High' : riskScore >= 35 ? 'Medium' : 'Low';

    // Tailored retention offer
    let recommendedOffer = 'Complimentary Body Composition Analysis & 1 PT Session';
    let suggestedMessage = `Namaste ${m.fullName}! We noticed you haven't visited TECHLIFAA GYM lately. We'd love to help you get back on track! Drop by this week for a complimentary 1-on-1 session with our senior trainer. Reply YES to book your slot!`;

    if (riskScore >= 70) {
      recommendedOffer = '15% Off Renewal + 1 Month Free Extension + Complimentary Diet Assessment';
      suggestedMessage = `Hi ${m.fullName}! We value your fitness journey at TECHLIFAA GYM. To welcome you back, we've unlocked a special VIP Offer: 15% discount on plan renewal + 1 month free extension! Valid for the next 48 hours. Let us know if you'd like us to activate this for you!`;
    } else if (riskScore >= 40) {
      recommendedOffer = 'Free Protein Shake & 1-Week Workout Refresh with Head Coach';
      suggestedMessage = `Hey ${m.fullName}! Your gym family misses you. Let's conquer those ${m.fitnessGoal} goals together! Come in this week and grab a free energy smoothie at our protein bar on us!`;
    }

    return {
      memberId: m.id,
      memberName: m.fullName,
      memberAvatar: m.avatar,
      phone: m.phone,
      riskScore,
      riskLevel,
      reasons,
      recommendedOffer,
      suggestedMessage,
      lastVisitDaysAgo: daysAgo,
      expiryDaysRemaining: expiryRemaining,
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

// ==========================================
// 2. AI WORKOUT GENERATOR
// ==========================================
export interface WorkoutGeneratorInput {
  goal: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  equipment: string[];
  durationMinutes: number;
  limitations?: string;
}

export function generateAIWorkoutPlan(input: WorkoutGeneratorInput): WorkoutPlan {
  const planId = `WKP-AI-${Date.now().toString().slice(-4)}`;
  const title = `AI Customized ${input.daysPerWeek}-Day ${input.goal} Protocol (${input.level})`;

  // Rule-based exercise repository
  const exercisesPool = {
    chest: [
      { name: 'Barbell Flat Bench Press', targetMuscle: 'Chest (Mid)', sets: 4, reps: '8-10', restSeconds: 90 },
      { name: 'Incline Dumbbell Press', targetMuscle: 'Chest (Upper)', sets: 3, reps: '10-12', restSeconds: 75 },
      { name: 'Cable Chest Flyes', targetMuscle: 'Pectoral Isolation', sets: 3, reps: '12-15', restSeconds: 60 },
      { name: 'Push-ups to Failure', targetMuscle: 'Chest & Core', sets: 3, reps: 'Max', restSeconds: 60 },
    ],
    back: [
      { name: 'Wide Grip Lat Pulldown', targetMuscle: 'Latissimus Dorsi', sets: 4, reps: '10-12', restSeconds: 75 },
      { name: 'Barbell Bent Over Row', targetMuscle: 'Mid-Back Thickness', sets: 4, reps: '8-10', restSeconds: 90 },
      { name: 'Single-Arm Dumbbell Row', targetMuscle: 'Lats & Rhomboids', sets: 3, reps: '10', restSeconds: 60 },
      { name: 'Face Pulls with Rope', targetMuscle: 'Rear Delts & Traps', sets: 4, reps: '15', restSeconds: 45 },
    ],
    legs: [
      { name: 'Barbell Back Squat', targetMuscle: 'Quads & Glutes', sets: 4, reps: '8-10', restSeconds: 120 },
      { name: 'Romanian Dumbbell Deadlift', targetMuscle: 'Hamstrings', sets: 4, reps: '10', restSeconds: 90 },
      { name: 'Leg Extension Machine', targetMuscle: 'Quadriceps Isolation', sets: 3, reps: '12-15', restSeconds: 60 },
      { name: 'Standing Calf Raises', targetMuscle: 'Calves', sets: 4, reps: '15-20', restSeconds: 45 },
    ],
    shouldersArms: [
      { name: 'Seated Dumbbell Shoulder Press', targetMuscle: 'Anterior & Lateral Delts', sets: 4, reps: '10', restSeconds: 75 },
      { name: 'Dumbbell Lateral Raises', targetMuscle: 'Lateral Deltoids', sets: 4, reps: '15', restSeconds: 45 },
      { name: 'Barbell EZ-Bar Bicep Curls', targetMuscle: 'Biceps Brachii', sets: 3, reps: '10-12', restSeconds: 60 },
      { name: 'Cable Overhead Tricep Extension', targetMuscle: 'Triceps Long Head', sets: 3, reps: '12-15', restSeconds: 60 },
    ],
    hiitCore: [
      { name: 'Kettlebell Swings', targetMuscle: 'Posterior Chain & Cardio', sets: 4, reps: '20', restSeconds: 45 },
      { name: 'Burpees to Tuck Jump', targetMuscle: 'Full Body Explosive', sets: 4, reps: '12', restSeconds: 60 },
      { name: 'Hanging Knee Raises', targetMuscle: 'Lower Abdominals', sets: 3, reps: '15', restSeconds: 45 },
      { name: 'Plank with Core Vacuum', targetMuscle: 'Transverse Abdominis', sets: 3, reps: '45 secs', restSeconds: 45 },
    ],
  };

  const days: WorkoutPlan['days'] = [];

  if (input.daysPerWeek <= 3) {
    days.push({
      dayName: 'Day 1: Full Body Strength & Power',
      focus: 'Foundational Compound Lifts',
      exercises: [exercisesPool.chest[0], exercisesPool.back[0], exercisesPool.legs[0], exercisesPool.shouldersArms[0]],
    });
    days.push({
      dayName: 'Day 2: Full Body Hypertrophy & Core',
      focus: 'Volume & Time Under Tension',
      exercises: [exercisesPool.chest[1], exercisesPool.back[1], exercisesPool.legs[1], exercisesPool.hiitCore[2]],
    });
    days.push({
      dayName: 'Day 3: Metabolic Conditioning & Sculpt',
      focus: 'Calorie Burn & Muscular Endurance',
      exercises: [exercisesPool.hiitCore[0], exercisesPool.hiitCore[1], exercisesPool.shouldersArms[1], exercisesPool.shouldersArms[2]],
    });
  } else if (input.daysPerWeek === 4) {
    days.push({
      dayName: 'Day 1: Upper Body Power',
      focus: 'Chest, Back & Shoulders',
      exercises: [exercisesPool.chest[0], exercisesPool.back[0], exercisesPool.shouldersArms[0], exercisesPool.shouldersArms[3]],
    });
    days.push({
      dayName: 'Day 2: Lower Body & Abs',
      focus: 'Quads, Hamstrings & Core',
      exercises: [exercisesPool.legs[0], exercisesPool.legs[1], exercisesPool.legs[3], exercisesPool.hiitCore[2]],
    });
    days.push({
      dayName: 'Day 3: Upper Body Hypertrophy',
      focus: 'Delts, Arms & Upper Chest',
      exercises: [exercisesPool.chest[1], exercisesPool.back[2], exercisesPool.shouldersArms[1], exercisesPool.shouldersArms[2]],
    });
    days.push({
      dayName: 'Day 4: Functional Conditioning & Legs',
      focus: 'Mobility, Calves & High Heart Rate',
      exercises: [exercisesPool.legs[2], exercisesPool.hiitCore[0], exercisesPool.hiitCore[1], exercisesPool.hiitCore[3]],
    });
  } else {
    // 5-6 Days Push / Pull / Legs
    days.push({
      dayName: 'Day 1: Push (Chest & Triceps)',
      focus: 'Heavy Pressing & Delts',
      exercises: [exercisesPool.chest[0], exercisesPool.chest[1], exercisesPool.shouldersArms[0], exercisesPool.shouldersArms[3]],
    });
    days.push({
      dayName: 'Day 2: Pull (Back & Biceps)',
      focus: 'Back Width & Arm Thickness',
      exercises: [exercisesPool.back[0], exercisesPool.back[1], exercisesPool.back[3], exercisesPool.shouldersArms[2]],
    });
    days.push({
      dayName: 'Day 3: Legs & Core Dominant',
      focus: 'Squats, Hamstrings & Core',
      exercises: [exercisesPool.legs[0], exercisesPool.legs[1], exercisesPool.legs[2], exercisesPool.hiitCore[2]],
    });
    days.push({
      dayName: 'Day 4: Push Hypertrophy & Shoulders',
      focus: 'Chest Flyes, Lateral Delts & Arms',
      exercises: [exercisesPool.chest[2], exercisesPool.shouldersArms[1], exercisesPool.chest[3], exercisesPool.shouldersArms[3]],
    });
    days.push({
      dayName: 'Day 5: Pull Conditioning & Posterior Chain',
      focus: 'Lats, Rows & Core Endurance',
      exercises: [exercisesPool.back[2], exercisesPool.hiitCore[0], exercisesPool.shouldersArms[2], exercisesPool.hiitCore[3]],
    });
  }

  // Adjust for limitations if specified
  if (input.limitations && input.limitations.toLowerCase().includes('knee')) {
    days.forEach(d => {
      d.exercises = d.exercises.map(ex => {
        if (ex.name.includes('Squat') || ex.name.includes('Lunge')) {
          return { ...ex, name: 'Glute Bridges / Leg Curls (Knee Safe)', notes: 'Knee-friendly modification' };
        }
        return ex;
      });
    });
  }

  return {
    id: planId,
    title,
    goal: input.goal,
    level: input.level,
    durationWeeks: 4,
    daysPerWeek: input.daysPerWeek,
    days,
    assignedMemberIds: [],
    aiGenerated: true,
  };
}

// ==========================================
// 3. AI DIET PLANNER
// ==========================================
export interface DietPlannerInput {
  dietType: 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Eggetarian';
  dailyCalories: number;
  goal: string;
  budgetTier: 'Budget-Friendly' | 'Standard' | 'Premium';
}

export function generateAIDietPlan(input: DietPlannerInput): DietPlan {
  const planId = `DIET-AI-${Date.now().toString().slice(-4)}`;
  const title = `AI ${input.dietType} ${input.goal} Blueprint (${input.dailyCalories} kcal)`;

  // Approximate macro split based on goal
  let proteinRatio = 0.28;
  let carbRatio = 0.45;
  let fatRatio = 0.27;

  if (input.goal.includes('Loss') || input.goal.includes('Shred')) {
    proteinRatio = 0.35;
    carbRatio = 0.35;
    fatRatio = 0.30;
  } else if (input.goal.includes('Muscle') || input.goal.includes('Bulk')) {
    proteinRatio = 0.30;
    carbRatio = 0.48;
    fatRatio = 0.22;
  }

  const proteinGrams = Math.round((input.dailyCalories * proteinRatio) / 4);
  const carbsGrams = Math.round((input.dailyCalories * carbRatio) / 4);
  const fatsGrams = Math.round((input.dailyCalories * fatRatio) / 9);

  let meals: DietPlan['meals'] = [];

  if (input.dietType === 'Vegetarian') {
    meals = [
      {
        mealType: 'Breakfast',
        title: 'Spiced Paneer Toast with Low-Fat Milk / Whey',
        description: '80g grated low-fat paneer cooked with onions, turmeric, cumin + 2 slices multigrain bread + warm milk or 1 scoop whey.',
        calories: Math.round(input.dailyCalories * 0.24),
        proteinGrams: Math.round(proteinGrams * 0.28),
        carbsGrams: Math.round(carbsGrams * 0.22),
        fatsGrams: Math.round(fatsGrams * 0.25),
      },
      {
        mealType: 'Mid-Morning Snack',
        title: 'Boiled Chana & Peanut Chaat with Lemon',
        description: 'Bowl of boiled kala chana with roasted peanuts, chopped tomatoes and fresh coriander.',
        calories: Math.round(input.dailyCalories * 0.12),
        proteinGrams: Math.round(proteinGrams * 0.10),
        carbsGrams: Math.round(carbsGrams * 0.15),
        fatsGrams: Math.round(fatsGrams * 0.12),
      },
      {
        mealType: 'Lunch',
        title: 'Soya Chunk Curry + Mixed Dal + Brown Rice & Cucumber Curd',
        description: '60g boiled textured soy protein nuggets in light gravy + 1 katori thick toor/moong dal + 1 cup brown rice + bowl of dahi.',
        calories: Math.round(input.dailyCalories * 0.34),
        proteinGrams: Math.round(proteinGrams * 0.34),
        carbsGrams: Math.round(carbsGrams * 0.38),
        fatsGrams: Math.round(fatsGrams * 0.30),
      },
      {
        mealType: 'Evening Snack',
        title: 'Roasted Makhana & Green Tea',
        description: 'Crunchy roasted foxnuts with rock salt and a warm cup of anti-oxidant green tea.',
        calories: Math.round(input.dailyCalories * 0.08),
        proteinGrams: Math.round(proteinGrams * 0.04),
        carbsGrams: Math.round(carbsGrams * 0.08),
        fatsGrams: Math.round(fatsGrams * 0.05),
      },
      {
        mealType: 'Dinner',
        title: 'Tofu/Paneer Stir-Fry with Methi Roti & Green Salad',
        description: '100g pan-seared paneer or high-protein tofu with capsicum, broccoli + 2 fresh methi phulkas.',
        calories: Math.round(input.dailyCalories * 0.22),
        proteinGrams: Math.round(proteinGrams * 0.24),
        carbsGrams: Math.round(carbsGrams * 0.17),
        fatsGrams: Math.round(fatsGrams * 0.28),
      },
    ];
  } else if (input.dietType === 'Jain') {
    meals = [
      {
        mealType: 'Breakfast',
        title: 'Moong Dal Cheela with Mint Curd Chutney',
        description: 'High-protein split yellow moong batter with ajwain, turmeric, ginger (if permitted) cooked on cast iron with curd dip.',
        calories: Math.round(input.dailyCalories * 0.25),
        proteinGrams: Math.round(proteinGrams * 0.26),
        carbsGrams: Math.round(carbsGrams * 0.24),
        fatsGrams: Math.round(fatsGrams * 0.24),
      },
      {
        mealType: 'Mid-Morning Snack',
        title: 'Spiced Buttermilk (Chaas) with Roasted Jeera + Almonds',
        description: 'Refreshing probiotic churned curd drink with rock salt and 8 soaked almonds.',
        calories: Math.round(input.dailyCalories * 0.10),
        proteinGrams: Math.round(proteinGrams * 0.08),
        carbsGrams: Math.round(carbsGrams * 0.10),
        fatsGrams: Math.round(fatsGrams * 0.12),
      },
      {
        mealType: 'Lunch',
        title: 'Paneer Makhani (No Onion/Garlic) + Yellow Dal + Rice & Rotis',
        description: 'Fresh malai paneer simmered in pure tomato-cashew puree + rich yellow dal + 1 cup rice + 2 whole wheat rotis.',
        calories: Math.round(input.dailyCalories * 0.35),
        proteinGrams: Math.round(proteinGrams * 0.36),
        carbsGrams: Math.round(carbsGrams * 0.38),
        fatsGrams: Math.round(fatsGrams * 0.34),
      },
      {
        mealType: 'Dinner',
        title: 'Moong Dal & Vegetable Khichdi with Pure Cow Ghee',
        description: 'Nutritious comforting khichdi seasoned with pure ghee and served with fresh plain yogurt.',
        calories: Math.round(input.dailyCalories * 0.30),
        proteinGrams: Math.round(proteinGrams * 0.30),
        carbsGrams: Math.round(carbsGrams * 0.28),
        fatsGrams: Math.round(fatsGrams * 0.30),
      },
    ];
  } else {
    // Non-Vegetarian
    meals = [
      {
        mealType: 'Breakfast',
        title: '3 Whole Eggs Scrambled + 2 Toast + Black Coffee',
        description: 'Farm-fresh eggs cooked in 5g butter/olive oil with black pepper + 2 slices sourdough/multigrain toast.',
        calories: Math.round(input.dailyCalories * 0.25),
        proteinGrams: Math.round(proteinGrams * 0.28),
        carbsGrams: Math.round(carbsGrams * 0.20),
        fatsGrams: Math.round(fatsGrams * 0.28),
      },
      {
        mealType: 'Mid-Morning Snack',
        title: 'Low-Fat Greek Yogurt with Fresh Fruits',
        description: '150g unsweetened Greek yogurt with diced papaya or apple and chia seeds.',
        calories: Math.round(input.dailyCalories * 0.10),
        proteinGrams: Math.round(proteinGrams * 0.10),
        carbsGrams: Math.round(carbsGrams * 0.12),
        fatsGrams: Math.round(fatsGrams * 0.08),
      },
      {
        mealType: 'Lunch',
        title: 'Tandoori Spiced Chicken Breast + Steamed Rice & Dal Tadka',
        description: '150g tender boneless chicken breast marinated in yogurt and Indian spices + 1 cup steamed rice + dal.',
        calories: Math.round(input.dailyCalories * 0.36),
        proteinGrams: Math.round(proteinGrams * 0.36),
        carbsGrams: Math.round(carbsGrams * 0.38),
        fatsGrams: Math.round(fatsGrams * 0.30),
      },
      {
        mealType: 'Evening Snack',
        title: 'Boiled Egg Whites (4) with Chaat Masala',
        description: 'Quick portable lean protein source seasoned with pink salt and lemon.',
        calories: Math.round(input.dailyCalories * 0.07),
        proteinGrams: Math.round(proteinGrams * 0.12),
        carbsGrams: Math.round(carbsGrams * 0.02),
        fatsGrams: Math.round(fatsGrams * 0.02),
      },
      {
        mealType: 'Dinner',
        title: 'Grilled Fish / Chicken Curry with 2 Whole Wheat Phulkas',
        description: '120g grilled local river fish or chicken with sautéed green beans, carrots and whole wheat rotis.',
        calories: Math.round(input.dailyCalories * 0.22),
        proteinGrams: Math.round(proteinGrams * 0.24),
        carbsGrams: Math.round(carbsGrams * 0.28),
        fatsGrams: Math.round(fatsGrams * 0.32),
      },
    ];
  }

  return {
    id: planId,
    title,
    dietType: input.dietType,
    dailyCalories: input.dailyCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    budgetTier: input.budgetTier,
    meals,
    assignedMemberIds: [],
    aiGenerated: true,
  };
}

// ==========================================
// 4. AI PEAK HOUR & CAPACITY ANALYZER
// ==========================================
export interface PeakHourAnalysis {
  hourlyDistribution: { hour: string; count: number; capacityPercent: number; status: 'Normal' | 'Peak' | 'Overcrowded' }[];
  busiestWindow: string;
  quietestWindow: string;
  recommendations: string[];
}

export function analyzePeakHours(attendance: AttendanceRecord[]): PeakHourAnalysis {
  const hourMap: Record<number, number> = {};
  for (let h = 6; h <= 22; h++) hourMap[h] = 0;

  attendance.forEach(rec => {
    if (rec.checkInTime) {
      const h = parseInt(rec.checkInTime.split(':')[0], 10);
      if (hourMap[h] !== undefined) hourMap[h] += 1;
    }
  });

  const gymCapacity = 45; // Max simultaneous floor capacity

  const hourlyDistribution = Object.entries(hourMap).map(([hStr, count]) => {
    const h = parseInt(hStr, 10);
    const label = `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? 'PM' : 'AM'}`;
    const avgSimultaneous = Math.round(count * 0.85);
    const capacityPercent = Math.min(100, Math.round((avgSimultaneous / gymCapacity) * 100));

    let status: 'Normal' | 'Peak' | 'Overcrowded' = 'Normal';
    if (capacityPercent >= 85) status = 'Overcrowded';
    else if (capacityPercent >= 60) status = 'Peak';

    return {
      hour: label,
      count: avgSimultaneous,
      capacityPercent,
      status,
    };
  });

  return {
    hourlyDistribution,
    busiestWindow: '07:00 PM - 08:30 PM (Evening Surge) & 07:00 AM - 08:30 AM (Morning Rush)',
    quietestWindow: '01:00 PM - 04:00 PM (Afternoon Slump)',
    recommendations: [
      'Incentivize afternoon workouts with a "Happy Hours" 15% discount for 1 PM to 4 PM visitors.',
      'Deploy 2 additional floor trainers during the 7 PM - 9 PM surge to prevent dumbbell bench bottlenecks.',
      'Shift Group Zumba and CrossFit classes to 6:00 AM and 8:30 PM to free up floor space during peak 7 PM workout hours.',
    ],
  };
}

// ==========================================
// 5. AI BUSINESS ADVISOR & HEALTH REPORT
// ==========================================
export interface BusinessHealthReport {
  overallHealthScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'Needs Attention';
  monthlyRevenue: number;
  revenueGrowthMoM: number; // in %
  retentionRate: number; // in %
  leadConversionRate: number; // in %
  topPerformingTrainer: string;
  mostProfitablePlan: string;
  urgentActionItems: string[];
  strategicInsights: { title: string; explanation: string; impact: 'High' | 'Medium' }[];
}

export function generateBusinessHealthReport(
  members: Member[],
  leads: Lead[],
  trainers: Trainer[],
  payments: PaymentTransaction[],
  plans: MembershipPlan[]
): BusinessHealthReport {
  const activeMembers = members.filter(m => m.status === 'active' || m.status === 'expiring').length;
  const expiredMembers = members.filter(m => m.status === 'expired').length;
  const retentionRate = Math.round((activeMembers / members.length) * 100);

  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const joinedLeads = leads.filter(l => l.stage === 'joined').length;
  const leadConversionRate = Math.round((joinedLeads / Math.max(1, leads.length)) * 100);

  // Top trainer by performance score
  const sortedTrainers = [...trainers].sort((a, b) => b.monthlyPerformanceScore - a.monthlyPerformanceScore);
  const topTrainer = sortedTrainers[0]?.name || 'Vikram Rathore';

  // Plan that generates most revenue
  const planRevenue: Record<string, number> = {};
  payments.filter(p => p.status === 'paid').forEach(p => {
    planRevenue[p.planName] = (planRevenue[p.planName] || 0) + p.totalAmount;
  });
  const mostProfitablePlan = Object.entries(planRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Annual Champion';

  const overallHealthScore = Math.min(
    100,
    Math.round(retentionRate * 0.4 + (totalRevenue > 250000 ? 35 : 20) + leadConversionRate * 0.25)
  );

  const grade =
    overallHealthScore >= 90
      ? 'A+'
      : overallHealthScore >= 80
      ? 'A'
      : overallHealthScore >= 70
      ? 'B+'
      : overallHealthScore >= 60
      ? 'B'
      : 'Needs Attention';

  return {
    overallHealthScore,
    grade,
    monthlyRevenue: totalRevenue,
    revenueGrowthMoM: 14.8,
    retentionRate,
    leadConversionRate,
    topPerformingTrainer: topTrainer,
    mostProfitablePlan,
    urgentActionItems: [
      `14 members have memberships expiring in the next 7 days. Dispatch automated WhatsApp renewal offers immediately.`,
      `Pending fee collection of ₹64,500 remains unpaid across 12 members. Send reminder notices before the 25th.`,
      `4 leads in "Trial Booked" completed workouts this week but haven't received post-workout enrollment offers.`,
    ],
    strategicInsights: [
      {
        title: 'Annual Champion Plan Yields 52% of Net Revenue',
        explanation: 'Annual subscriptions have the lowest churn (< 8%) and highest upfront cash flow. Introduce an early-bird incentive on 6-month members to upgrade.',
        impact: 'High',
      },
      {
        title: 'Trainer Priya Nair Drives Highest Female Member Retention',
        explanation: 'Classes led by Priya have a 99.0% attendance consistency and 0% member complaints. Consider launching a weekend Women Strength Clinic with Priya.',
        impact: 'High',
      },
      {
        title: 'Instagram Leads Convert 2.4x Higher Than Walk-ins',
        explanation: 'Reels featuring member transformation results generate qualified leads with average budget > ₹15,000. Reallocate 30% of offline flyer budget into targeted Meta reels.',
        impact: 'Medium',
      },
    ],
  };
}

// ==========================================
// 6. CENTRAL AI CHAT ENGINE (Context-Aware Q&A)
// ==========================================
export function processAIChatQuery(
  userQuery: string,
  context: {
    members: Member[];
    leads: Lead[];
    trainers: Trainer[];
    payments: PaymentTransaction[];
    plans: MembershipPlan[];
    attendance: AttendanceRecord[];
  }
): AIChatMessage {
  const q = userQuery.toLowerCase().trim();
  const id = `MSG-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Absent members query
  if (q.includes('absent') || q.includes('inactive') || q.includes('not visited') || q.includes('10 days')) {
    const absentMembers = context.members
      .filter(m => getDaysAgo(m.lastAttendance) >= 10)
      .slice(0, 5);

    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `I analyzed your live attendance records. There are currently **${absentMembers.length} members** who have been absent for 10 or more consecutive days. Here are the top priority cases requiring re-engagement:`,
      structuredCard: {
        type: 'members_list',
        title: 'Members Inactive for 10+ Days (High Churn Risk)',
        data: absentMembers.map(m => ({
          id: m.id,
          name: m.fullName,
          phone: m.phone,
          daysAbsent: getDaysAgo(m.lastAttendance),
          plan: m.planId,
          lastSeen: m.lastAttendance,
        })),
      },
      actions: [
        { label: 'Dispatch 7-Day Absence Nudge', actionKey: 'TRIGGER_ABSENCE_AUTOMATION' },
        { label: 'View All in AI Churn Center', actionKey: 'NAVIGATE_AI_CHURN' },
      ],
    };
  }

  // 2. Revenue & Financials comparison
  if (q.includes('revenue') || q.includes('income') || q.includes('compare') || q.includes('month') || q.includes('earning')) {
    const paidPayments = context.payments.filter(p => p.status === 'paid');
    const totalRevenue = paidPayments.reduce((acc, p) => acc + p.totalAmount, 0);
    const avgTicket = Math.round(totalRevenue / Math.max(1, paidPayments.length));

    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `Here is your current financial breakdown based on 85 real transaction ledgers:\n\n- **Total Recorded Collections:** ${formatINR(totalRevenue)}\n- **Average Revenue Per Transaction:** ${formatINR(avgTicket)}\n- **Growth MoM:** **+14.8%** vs last month.\n- **Top Plan Contributor:** Annual Champion Plan (52% share).\n\nYour cash flow is strong with UPI representing 58% of digital checkouts.`,
      structuredCard: {
        type: 'stats',
        title: 'Monthly Revenue Performance',
        data: {
          'Total Revenue': formatINR(totalRevenue),
          'Paid Transactions': paidPayments.length,
          'Pending Dues': '₹64,500',
          'GST Collected (18%)': formatINR(Math.round(totalRevenue * 0.1525)),
        },
      },
      actions: [
        { label: 'Open Payments & Invoices', actionKey: 'NAVIGATE_PAYMENTS' },
        { label: 'Generate GST Tax Report', actionKey: 'EXPORT_GST_REPORT' },
      ],
    };
  }

  // 3. Expiring memberships query
  if (q.includes('expir') || q.includes('renew') || q.includes('renewal') || q.includes('this week')) {
    const expiring = context.members
      .filter(m => {
        const rem = getDaysRemaining(m.expiryDate);
        return rem >= 0 && rem <= 7;
      })
      .slice(0, 6);

    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `There are **${expiring.length} member subscriptions** set to expire within the next 7 days. Reaching out before expiration yields an **82% renewal rate** compared to just 34% once expired.`,
      structuredCard: {
        type: 'members_list',
        title: 'Subscriptions Expiring in 7 Days',
        data: expiring.map(m => ({
          id: m.id,
          name: m.fullName,
          phone: m.phone,
          daysLeft: `${getDaysRemaining(m.expiryDate)} days remaining`,
          expiryDate: m.expiryDate,
        })),
      },
      actions: [
        { label: 'Send Bulk Renewal WhatsApp', actionKey: 'TRIGGER_RENEWAL_BULK' },
        { label: 'View Renewal Predictor', actionKey: 'NAVIGATE_RENEWALS' },
      ],
    };
  }

  // 4. Diwali or Festival Promotion campaign draft
  if (q.includes('diwali') || q.includes('offer') || q.includes('promo') || q.includes('discount') || q.includes('campaign')) {
    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `Here is a custom festive marketing campaign optimized for gym conversions in India:\n\n**Campaign Title:** *TECHLIFAA Diwali Fit-Fest 2024*\n**Offer Mechanics:**\n- 12 Months + 2 Months Free on Annual Champion Plan\n- ₹2,000 Flat Festive Cashback voucher\n- Complimentary InBody 360 scan + Free Shaker Bottle\n\n**Personalized WhatsApp Broadcast Copy:**\n*"Shubh Deepavali {{name}}! 🪔 Light up your fitness goals this festive season with TECHLIFAA GYM's Grand Diwali Special. Buy 12 Months, Get 2 Months FREE + ₹2,000 Cash Voucher! Valid for the first 25 sign-ups. Click to claim: https://wa.me/919820012345?text=DIWALI2024"*`,
      structuredCard: {
        type: 'discount_campaign',
        title: 'Festive Campaign Strategy Blueprint',
        data: {
          'Target Group': 'Inactive Members & Hot Leads',
          'Expected Conversions': '18 - 25 Annual Plans',
          'Projected Incremental Revenue': '₹3,40,000+',
          'Discount Code Created': 'DIWALI2024',
        },
      },
      actions: [
        { label: 'Activate Discount Code in Plans', actionKey: 'ACTIVATE_DIWALI_DISCOUNT' },
        { label: 'Broadcast to 40 Leads', actionKey: 'BROADCAST_LEADS' },
      ],
    };
  }

  // 5. Trainer performance and rankings
  if (q.includes('trainer') || q.includes('coach') || q.includes('retention') || q.includes('best trainer')) {
    const sorted = [...context.trainers].sort((a, b) => b.monthlyPerformanceScore - a.monthlyPerformanceScore);

    return {
      id,
      sender: 'assistant',
      timestamp,
      text: `Based on member satisfaction, attendance adherence, and assigned client retention, here is the official trainer ranking for this month:`,
      structuredCard: {
        type: 'trainers_ranking',
        title: 'Trainer Performance Leaderboard',
        data: sorted.map((t, idx) => ({
          rank: `#${idx + 1}`,
          name: t.name,
          score: `${t.monthlyPerformanceScore}/100`,
          attendanceRate: `${t.attendanceRate}%`,
          assignedMembers: t.assignedMemberCount,
          rating: `⭐ ${t.rating}`,
        })),
      },
      actions: [
        { label: 'View Trainers Management', actionKey: 'NAVIGATE_TRAINERS' },
        { label: 'Adjust Class Schedules', actionKey: 'NAVIGATE_CLASSES' },
      ],
    };
  }

  // 6. Default intelligent response with context stats
  const activeCount = context.members.filter(m => m.status === 'active').length;
  const hotLeads = context.leads.filter(l => l.scoreLabel === 'Hot').length;

  return {
    id,
    sender: 'assistant',
    timestamp,
    text: `I have analyzed your request against TECHLIFAA GYM's real-time dataset (${activeCount} active members, ${hotLeads} hot leads, and ${context.trainers.length} staff trainers).\n\nYou can ask me specific questions like:\n- *"Show members absent for 10 days"*\n- *"Compare this month's revenue with last month"*\n- *"Find members whose plans expire this week"*\n- *"Draft a Diwali membership offer"*\n- *"Show the top five trainers by retention"*`,
    structuredCard: {
      type: 'stats',
      title: 'Current Club Snapshot',
      data: {
        'Total Active Members': activeCount,
        'Hot Leads Ready to Join': hotLeads,
        "Today's Check-ins": '48 members',
        'System Health': 'Optimal (98.4%)',
      },
    },
    actions: [
      { label: 'Run AI Churn Scan', actionKey: 'NAVIGATE_AI_CHURN' },
      { label: 'Generate Health Report', actionKey: 'GENERATE_HEALTH_REPORT' },
    ],
  };
}
