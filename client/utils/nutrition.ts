import type { NutritionTargets } from '@/types';

// 活动系数映射
export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

// 目标热量系数
export const GOAL_MULTIPLIERS: Record<string, number> = {
  maintain: 1.0,
  lose: 0.85,
  gain: 1.1,
};

// 饮食模式 - 宏量营养素比例
export const DIET_PATTERNS: Record<string, { protein: number; fat: number; carbs: number }> = {
  balanced: { protein: 0.30, fat: 0.30, carbs: 0.40 },
  'high-protein': { protein: 0.40, fat: 0.30, carbs: 0.30 },
  'low-carb': { protein: 0.35, fat: 0.40, carbs: 0.25 },
};

// 活动水平名称
export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: '久坐（几乎不运动）',
  light: '轻度活动（每周1-3次）',
  moderate: '中度活动（每周3-5次）',
  very: '高度活动（每周6-7次）',
  extra: '极高活动（体力劳动）',
};

// 目标名称
export const GOAL_LABELS: Record<string, string> = {
  maintain: '维持体重',
  lose: '减脂',
  gain: '增肌',
};

// 饮食模式名称
export const DIET_LABELS: Record<string, string> = {
  balanced: '均衡饮食',
  'high-protein': '高蛋白饮食',
  'low-carb': '低碳水饮食',
};

// 食物类别名称
export const FOOD_CATEGORY_LABELS: Record<string, string> = {
  protein: '蛋白质',
  carbs: '碳水',
  vegetables: '蔬菜',
  fruits: '水果',
  dairy: '乳制品',
  nuts: '坚果',
  other: '其他',
};

// 运动类别名称
export const EXERCISE_CATEGORY_LABELS: Record<string, string> = {
  cardio: '有氧运动',
  strength: '力量训练',
  sports: '球类运动',
  daily: '日常活动',
};

/**
 * 计算基础代谢率 (BMR)
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * 计算营养目标
 */
export function calculateNutritionTargets(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string,
  dietPattern: string
): NutritionTargets {
  const bmr = calculateBMR(weight, height, age, gender);
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  const goalMultiplier = GOAL_MULTIPLIERS[goal] || 1.0;
  const pattern = DIET_PATTERNS[dietPattern] || DIET_PATTERNS.balanced;

  const tdee = bmr * activityMultiplier;
  const targetCalories = Math.round(tdee * goalMultiplier);

  const proteinCalories = targetCalories * pattern.protein;
  const fatCalories = targetCalories * pattern.fat;
  const carbsCalories = targetCalories * pattern.carbs;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    targetProtein: Math.round(proteinCalories / 4),
    targetFat: Math.round(fatCalories / 9),
    targetCarbs: Math.round(carbsCalories / 4),
    targetFiber: 30,
    proteinPercent: Math.round(pattern.protein * 100),
    fatPercent: Math.round(pattern.fat * 100),
    carbsPercent: Math.round(pattern.carbs * 100),
  };
}

/**
 * 计算运动消耗
 */
export function calculateExerciseCalories(
  metValue: number,
  weightKg: number,
  durationMinutes: number
): number {
  return Math.round(metValue * weightKg * (durationMinutes / 60));
}

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 格式化数字
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toFixed(decimals);
}
