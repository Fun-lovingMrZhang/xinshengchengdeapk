import { pgTable, serial, text, integer, real, timestamp, varchar } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  encryptedPassword: varchar('encrypted_password', { length: 64 }).notNull(),
  height: real('height').notNull().default(170), // cm
  weight: real('weight').notNull().default(70), // kg
  targetWeight: real('target_weight').default(60), // 目标体重 kg
  age: integer('age').notNull().default(25),
  gender: varchar('gender', { length: 10 }).notNull().default('male'),
  bodyFatRate: real('body_fat_rate'), // 体脂率 %
  dailyFiber: real('daily_fiber'), // 每日膳食纤维目标 g
  activityLevel: varchar('activity_level', { length: 20 }).notNull().default('moderate'),
  goal: varchar('goal', { length: 20 }).notNull().default('maintain'), // maintain, lose, gain
  dietPattern: varchar('diet_pattern', { length: 20 }).notNull().default('balanced'), // balanced, high-protein, low-carb
  targetCalories: integer('target_calories').notNull().default(2000),
  targetProtein: real('target_protein').notNull().default(150),
  targetCarbs: real('target_carbs').notNull().default(200),
  targetFat: real('target_fat').notNull().default(67),
  targetFiber: real('target_fiber').default(25),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 食物记录表
export const foodRecords = pgTable('food_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  mealType: varchar('meal_type', { length: 20 }).notNull().default('snack'), // breakfast, lunch, dinner, snack
  foodName: varchar('food_name', { length: 200 }).notNull(),
  weight: real('weight').notNull().default(100), // g
  calories: real('calories').notNull().default(0),
  protein: real('protein').notNull().default(0),
  carbs: real('carbs').notNull().default(0),
  fat: real('fat').notNull().default(0),
  fiber: real('fiber').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 运动记录表
export const exerciseRecords = pgTable('exercise_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  exerciseName: varchar('exercise_name', { length: 100 }).notNull(),
  duration: integer('duration').notNull().default(30), // minutes
  caloriesBurned: integer('calories_burned').notNull().default(0),
  metValue: real('met_value'), // MET 值
  createdAt: timestamp('created_at').defaultNow(),
});

// 预设食物表
export const presetFoods = pgTable('preset_foods', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameEn: varchar('name_en', { length: 100 }),
  category: varchar('category', { length: 20 }).notNull(), // protein, carbs, vegetables, fruits, dairy, nuts, other
  calories: real('calories').notNull(), // per 100g
  protein: real('protein').notNull(),
  carbs: real('carbs').notNull(),
  fat: real('fat').notNull(),
  fiber: real('fiber').default(0),
});

// 预设运动表
export const presetExercises = pgTable('preset_exercises', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 20 }).notNull(), // cardio, strength, sports, daily
  metValue: real('met_value').notNull(),
  caloriesPer30min: integer('calories_per_30min'), // 预估 30 分钟消耗（70kg 体重）
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type FoodRecord = typeof foodRecords.$inferSelect;
export type NewFoodRecord = typeof foodRecords.$inferInsert;
export type ExerciseRecord = typeof exerciseRecords.$inferSelect;
export type NewExerciseRecord = typeof exerciseRecords.$inferInsert;
export type PresetFood = typeof presetFoods.$inferSelect;
export type NewPresetFood = typeof presetFoods.$inferInsert;
export type PresetExercise = typeof presetExercises.$inferSelect;
export type NewPresetExercise = typeof presetExercises.$inferInsert;
