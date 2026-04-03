/**
 * 营养计算工具函数
 */

// 活动系数映射
export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,      // 久坐
  light: 1.375,        // 轻度活动
  moderate: 1.55,      // 中度活动
  very: 1.725,         // 高度活动
  extra: 1.9,          // 极高活动
};

// 目标热量系数
export const GOAL_MULTIPLIERS: Record<string, number> = {
  maintain: 1.0,       // 维持体重
  lose: 0.85,          // 减脂
  gain: 1.1,           // 增肌
};

// 饮食模式 - 宏量营养素比例
export const DIET_PATTERNS: Record<string, { protein: number; fat: number; carbs: number }> = {
  balanced: { protein: 0.30, fat: 0.30, carbs: 0.40 },
  'high-protein': { protein: 0.40, fat: 0.30, carbs: 0.30 },
  'low-carb': { protein: 0.35, fat: 0.40, carbs: 0.25 },
};

/**
 * 计算基础代谢率 (BMR) - Mifflin-St Jeor 公式
 */
export function calculateBMR(
  weight: number,  // kg
  height: number,  // cm
  age: number,
  gender: 'male' | 'female'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * 计算总每日能量消耗 (TDEE)
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return bmr * multiplier;
}

/**
 * 计算目标热量
 */
export function calculateTargetCalories(tdee: number, goal: string): number {
  const multiplier = GOAL_MULTIPLIERS[goal] || 1.0;
  return tdee * multiplier;
}

/**
 * 计算宏量营养素目标
 */
export function calculateMacroTargets(
  targetCalories: number,
  dietPattern: string = 'balanced'
): { protein: number; fat: number; carbs: number; fiber: number } {
  const pattern = DIET_PATTERNS[dietPattern] || DIET_PATTERNS.balanced;
  
  const proteinCalories = targetCalories * pattern.protein;
  const fatCalories = targetCalories * pattern.fat;
  const carbsCalories = targetCalories * pattern.carbs;

  return {
    protein: Math.round(proteinCalories / 4),  // 蛋白质 4kcal/g
    fat: Math.round(fatCalories / 9),          // 脂肪 9kcal/g
    carbs: Math.round(carbsCalories / 4),      // 碳水 4kcal/g
    fiber: 30,
  };
}

/**
 * 根据体重和 MET 值计算运动消耗
 */
export function calculateExerciseCalories(
  metValue: number,
  weightKg: number,
  durationMinutes: number
): number {
  // 公式: Calories = MET × weight(kg) × duration(hours)
  return Math.round(metValue * weightKg * (durationMinutes / 60));
}
