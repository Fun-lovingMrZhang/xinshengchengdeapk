import { pgTable, serial, timestamp, varchar, integer, real } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 系统健康检查表（不要删除）
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  height: real("height").notNull().default(170),
  weight: real("weight").notNull().default(70),
  age: integer("age").notNull().default(25),
  gender: varchar("gender", { length: 10 }).notNull().default('male'),
  bodyFat: real("body_fat"),
  activityLevel: varchar("activity_level", { length: 20 }).notNull().default('moderate'),
  goal: varchar("goal", { length: 20 }).notNull().default('maintain'),
  dietPattern: varchar("diet_pattern", { length: 20 }).notNull().default('balanced'),
  targetCalories: integer("target_calories").notNull().default(2000),
  targetProtein: real("target_protein").notNull().default(150),
  targetCarbs: real("target_carbs").notNull().default(200),
  targetFat: real("target_fat").notNull().default(67),
  targetFiber: real("target_fiber").default(25),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 食物记录表
export const foodRecords = pgTable("food_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  date: varchar("date", { length: 10 }).notNull(),
  mealType: varchar("meal_type", { length: 20 }).notNull().default('snack'),
  foodName: varchar("food_name", { length: 200 }).notNull(),
  weight: real("weight").notNull().default(100),
  calories: real("calories").notNull().default(0),
  protein: real("protein").notNull().default(0),
  carbs: real("carbs").notNull().default(0),
  fat: real("fat").notNull().default(0),
  fiber: real("fiber").default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 运动记录表
export const exerciseRecords = pgTable("exercise_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  date: varchar("date", { length: 10 }).notNull(),
  exerciseName: varchar("exercise_name", { length: 100 }).notNull(),
  duration: integer("duration").notNull().default(30),
  caloriesBurned: integer("calories_burned").notNull().default(0),
  metValue: real("met_value"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 预设食物表
export const presetFoods = pgTable("preset_foods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("name_en", { length: 100 }),
  category: varchar("category", { length: 20 }).notNull(),
  calories: real("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  fiber: real("fiber").default(0),
});

// 预设运动表
export const presetExercises = pgTable("preset_exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 20 }).notNull(),
  metValue: real("met_value").notNull(),
  caloriesPer30min: integer("calories_per_30min"),
});
