// 用户类型
export interface User {
  id: number;
  name: string;
  height: number;
  weight: number;
  age: number;
  gender: string;
  bodyFat: number | null;
  activityLevel: string;
  goal: string;
  dietPattern: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number | null;
  createdAt: string;
  updatedAt: string;
}

// 食物记录类型
export interface FoodRecord {
  id: number;
  userId: number | null;
  date: string;
  mealType: string;
  foodName: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  createdAt: string;
}

// 运动记录类型
export interface ExerciseRecord {
  id: number;
  userId: number | null;
  date: string;
  exerciseName: string;
  duration: number;
  caloriesBurned: number;
  metValue: number | null;
  createdAt: string;
}

// 预设食物类型
export interface PresetFood {
  id: number;
  name: string;
  nameEn: string | null;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
}

// 预设运动类型
export interface PresetExercise {
  id: number;
  name: string;
  category: string;
  metValue: number;
  caloriesPer30min: number | null;
}

// 营养目标类型
export interface NutritionTargets {
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  proteinPercent: number;
  fatPercent: number;
  carbsPercent: number;
}

// 今日统计类型
export interface TodayStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  burned: number;
  netCalories: number;
}
