-- 健康助手数据库初始化脚本
-- 请在 Supabase SQL Editor 中执行此脚本

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  height REAL NOT NULL DEFAULT 170,
  weight REAL NOT NULL DEFAULT 70,
  target_weight REAL DEFAULT 60,
  age INTEGER NOT NULL DEFAULT 25,
  gender VARCHAR(10) NOT NULL DEFAULT 'male',
  body_fat_rate REAL,
  daily_fiber REAL,
  activity_level VARCHAR(20) NOT NULL DEFAULT 'moderate',
  goal VARCHAR(20) NOT NULL DEFAULT 'maintain',
  diet_pattern VARCHAR(20) NOT NULL DEFAULT 'balanced',
  target_calories INTEGER NOT NULL DEFAULT 2000,
  target_protein REAL NOT NULL DEFAULT 150,
  target_carbs REAL NOT NULL DEFAULT 200,
  target_fat REAL NOT NULL DEFAULT 67,
  target_fiber REAL DEFAULT 25,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 食物记录表
CREATE TABLE IF NOT EXISTS food_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date VARCHAR(10) NOT NULL,
  meal_type VARCHAR(20) NOT NULL DEFAULT 'snack',
  food_name VARCHAR(200) NOT NULL,
  weight REAL NOT NULL DEFAULT 100,
  calories REAL NOT NULL DEFAULT 0,
  protein REAL NOT NULL DEFAULT 0,
  carbs REAL NOT NULL DEFAULT 0,
  fat REAL NOT NULL DEFAULT 0,
  fiber REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 运动记录表
CREATE TABLE IF NOT EXISTS exercise_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date VARCHAR(10) NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  calories_burned INTEGER NOT NULL DEFAULT 0,
  met_value REAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 预设食物表
CREATE TABLE IF NOT EXISTS preset_foods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  category VARCHAR(20) NOT NULL,
  calories REAL NOT NULL,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fat REAL NOT NULL,
  fiber REAL DEFAULT 0
);

-- 5. 预设运动表
CREATE TABLE IF NOT EXISTS preset_exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL,
  met_value REAL NOT NULL,
  calories_per_30min INTEGER
);

-- 6. 插入默认用户
INSERT INTO users (name, height, weight, target_weight, age, gender, activity_level, goal, diet_pattern, target_calories, target_protein, target_carbs, target_fat)
VALUES ('用户', 170, 70, 65, 25, 'male', 'moderate', 'lose', 'balanced', 1800, 120, 180, 60)
ON CONFLICT DO NOTHING;

-- 7. 插入预设食物数据
INSERT INTO preset_foods (name, name_en, category, calories, protein, carbs, fat, fiber) VALUES
-- 蛋白质类
('鸡胸肉', 'Chicken Breast', 'protein', 165, 31, 0, 3.6, 0),
('瘦牛肉', 'Lean Beef', 'protein', 250, 26, 0, 15, 0),
('三文鱼', 'Salmon', 'protein', 208, 20, 0, 13, 0),
('鸡蛋', 'Egg', 'protein', 155, 13, 1.1, 11, 0),
('蛋白', 'Egg White', 'protein', 52, 11, 0.7, 0.2, 0),
('虾', 'Shrimp', 'protein', 99, 24, 0.2, 0.3, 0),
('豆腐', 'Tofu', 'protein', 76, 8, 1.9, 4.8, 0.3),
('瘦猪肉', 'Lean Pork', 'protein', 143, 21, 0, 6, 0),
('金枪鱼罐头', 'Canned Tuna', 'protein', 116, 26, 0, 0.8, 0),
-- 碳水类
('米饭(熟)', 'Cooked Rice', 'carbs', 130, 2.7, 28, 0.3, 0.4),
('糙米饭', 'Brown Rice', 'carbs', 112, 2.6, 24, 0.9, 1.8),
('燕麦', 'Oatmeal', 'carbs', 389, 17, 66, 7, 11),
('全麦面包', 'Whole Wheat Bread', 'carbs', 247, 13, 41, 3.4, 7),
('红薯', 'Sweet Potato', 'carbs', 86, 1.6, 20, 0.1, 3),
('土豆', 'Potato', 'carbs', 77, 2, 17, 0.1, 2.2),
('意大利面(熟)', 'Cooked Pasta', 'carbs', 131, 5, 25, 0.7, 1.8),
('面条(熟)', 'Cooked Noodle', 'carbs', 138, 4.5, 25, 2, 1.2),
-- 蔬菜类
('西兰花', 'Broccoli', 'vegetables', 34, 2.8, 7, 0.4, 2.6),
('菠菜', 'Spinach', 'vegetables', 23, 2.9, 3.6, 0.4, 2.2),
('番茄', 'Tomato', 'vegetables', 18, 0.9, 3.9, 0.2, 1.2),
('黄瓜', 'Cucumber', 'vegetables', 15, 0.7, 3.6, 0.1, 0.5),
('生菜', 'Lettuce', 'vegetables', 15, 1.4, 2.9, 0.2, 1.3),
('胡萝卜', 'Carrot', 'vegetables', 41, 0.9, 10, 0.2, 2.8),
-- 水果类
('香蕉', 'Banana', 'fruits', 89, 1.1, 23, 0.3, 2.6),
('苹果', 'Apple', 'fruits', 52, 0.3, 14, 0.2, 2.4),
('橙子', 'Orange', 'fruits', 47, 0.9, 12, 0.1, 2.4),
('草莓', 'Strawberry', 'fruits', 32, 0.7, 7.7, 0.3, 2),
('蓝莓', 'Blueberry', 'fruits', 57, 0.7, 14, 0.3, 2.4),
('牛油果', 'Avocado', 'fruits', 160, 2, 9, 15, 7),
-- 乳制品
('全脂牛奶', 'Whole Milk', 'dairy', 61, 3.2, 4.8, 3.3, 0),
('脱脂牛奶', 'Skim Milk', 'dairy', 34, 3.4, 5, 0.1, 0),
('希腊酸奶', 'Greek Yogurt', 'dairy', 59, 10, 3.6, 0.7, 0),
-- 坚果类
('杏仁', 'Almond', 'nuts', 579, 21, 22, 50, 12),
('核桃', 'Walnut', 'nuts', 654, 15, 14, 65, 6.7),
('花生', 'Peanut', 'nuts', 567, 26, 16, 49, 8.5),
-- 其他
('橄榄油', 'Olive Oil', 'other', 884, 0, 0, 100, 0),
('蛋白粉', 'Protein Powder', 'other', 370, 75, 10, 5, 2)
ON CONFLICT DO NOTHING;

-- 8. 插入预设运动数据
INSERT INTO preset_exercises (name, category, met_value, calories_per_30min) VALUES
-- 有氧运动
('跑步(慢跑)', 'cardio', 7.0, 245),
('跑步(快跑)', 'cardio', 11.0, 385),
('骑自行车', 'cardio', 6.8, 238),
('游泳', 'cardio', 8.0, 280),
('跳绳', 'cardio', 12.0, 420),
('有氧操', 'cardio', 7.5, 263),
('椭圆机', 'cardio', 5.0, 175),
('动感单车', 'cardio', 8.5, 298),
-- 力量训练
('力量训练(轻)', 'strength', 3.5, 123),
('力量训练(重)', 'strength', 6.0, 210),
('俯卧撑', 'strength', 3.8, 133),
('深蹲', 'strength', 5.0, 175),
-- 球类运动
('篮球', 'sports', 6.5, 228),
('足球', 'sports', 7.0, 245),
('羽毛球', 'sports', 5.5, 193),
('网球', 'sports', 7.3, 256),
('乒乓球', 'sports', 4.0, 140),
-- 日常活动
('步行(慢)', 'daily', 2.5, 88),
('步行(快)', 'daily', 3.5, 123),
('爬楼梯', 'daily', 8.0, 280),
('瑜伽', 'daily', 2.5, 88),
('普拉提', 'daily', 3.0, 105),
('家务劳动', 'daily', 3.5, 123)
ON CONFLICT DO NOTHING;

-- 9. 启用 RLS (行级安全)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_exercises ENABLE ROW LEVEL SECURITY;

-- 10. 创建公开访问策略（开发环境使用，生产环境请修改）
CREATE POLICY "公开访问" ON users FOR ALL USING (true);
CREATE POLICY "公开访问" ON food_records FOR ALL USING (true);
CREATE POLICY "公开访问" ON exercise_records FOR ALL USING (true);
CREATE POLICY "公开访问" ON preset_foods FOR ALL USING (true);
CREATE POLICY "公开访问" ON preset_exercises FOR ALL USING (true);

-- 完成
SELECT '数据库初始化完成！' AS status;
