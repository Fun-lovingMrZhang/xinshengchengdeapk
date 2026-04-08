import { db, schema } from '../db/index.js';

// 预设食物数据
export const presetFoodsData = [
  // 蛋白质类
  { name: '鸡胸肉', nameEn: 'Chicken Breast', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { name: '瘦牛肉', nameEn: 'Lean Beef', category: 'protein', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  { name: '三文鱼', nameEn: 'Salmon', category: 'protein', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  { name: '鸡蛋', nameEn: 'Egg', category: 'protein', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  { name: '蛋白', nameEn: 'Egg White', category: 'protein', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
  { name: '虾', nameEn: 'Shrimp', category: 'protein', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  { name: '豆腐', nameEn: 'Tofu', category: 'protein', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
  { name: '瘦猪肉', nameEn: 'Lean Pork', category: 'protein', calories: 143, protein: 21, carbs: 0, fat: 6, fiber: 0 },
  { name: '金枪鱼罐头', nameEn: 'Canned Tuna', category: 'protein', calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0 },

  // 碳水类
  { name: '米饭(熟)', nameEn: 'Cooked Rice', category: 'carbs', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { name: '糙米饭', nameEn: 'Brown Rice', category: 'carbs', calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8 },
  { name: '燕麦', nameEn: 'Oatmeal', category: 'carbs', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11 },
  { name: '全麦面包', nameEn: 'Whole Wheat Bread', category: 'carbs', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7 },
  { name: '红薯', nameEn: 'Sweet Potato', category: 'carbs', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
  { name: '土豆', nameEn: 'Potato', category: 'carbs', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  { name: '意大利面(熟)', nameEn: 'Cooked Pasta', category: 'carbs', calories: 131, protein: 5, carbs: 25, fat: 0.7, fiber: 1.8 },
  { name: '面条(熟)', nameEn: 'Cooked Noodle', category: 'carbs', calories: 138, protein: 4.5, carbs: 25, fat: 2, fiber: 1.2 },

  // 蔬菜类
  { name: '西兰花', nameEn: 'Broccoli', category: 'vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
  { name: '菠菜', nameEn: 'Spinach', category: 'vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  { name: '番茄', nameEn: 'Tomato', category: 'vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  { name: '黄瓜', nameEn: 'Cucumber', category: 'vegetables', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  { name: '生菜', nameEn: 'Lettuce', category: 'vegetables', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 },
  { name: '胡萝卜', nameEn: 'Carrot', category: 'vegetables', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },

  // 水果类
  { name: '香蕉', nameEn: 'Banana', category: 'fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  { name: '苹果', nameEn: 'Apple', category: 'fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  { name: '橙子', nameEn: 'Orange', category: 'fruits', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
  { name: '草莓', nameEn: 'Strawberry', category: 'fruits', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 },
  { name: '蓝莓', nameEn: 'Blueberry', category: 'fruits', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
  { name: '牛油果', nameEn: 'Avocado', category: 'fruits', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },

  // 乳制品
  { name: '全脂牛奶', nameEn: 'Whole Milk', category: 'dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
  { name: '脱脂牛奶', nameEn: 'Skim Milk', category: 'dairy', calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0 },
  { name: '希腊酸奶', nameEn: 'Greek Yogurt', category: 'dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0 },

  // 坚果类
  { name: '杏仁', nameEn: 'Almond', category: 'nuts', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12 },
  { name: '核桃', nameEn: 'Walnut', category: 'nuts', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
  { name: '花生', nameEn: 'Peanut', category: 'nuts', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5 },

  // 其他
  { name: '橄榄油', nameEn: 'Olive Oil', category: 'other', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  { name: '蛋白粉', nameEn: 'Protein Powder', category: 'other', calories: 370, protein: 75, carbs: 10, fat: 5, fiber: 2 },
];

// 预设运动数据
export const presetExercisesData = [
  // 有氧运动
  { name: '跑步(慢跑)', category: 'cardio', metValue: 7.0, caloriesPer30min: 245 },
  { name: '跑步(快跑)', category: 'cardio', metValue: 11.0, caloriesPer30min: 385 },
  { name: '骑自行车', category: 'cardio', metValue: 6.8, caloriesPer30min: 238 },
  { name: '游泳', category: 'cardio', metValue: 8.0, caloriesPer30min: 280 },
  { name: '跳绳', category: 'cardio', metValue: 12.0, caloriesPer30min: 420 },
  { name: '有氧操', category: 'cardio', metValue: 7.5, caloriesPer30min: 263 },
  { name: '椭圆机', category: 'cardio', metValue: 5.0, caloriesPer30min: 175 },
  { name: '动感单车', category: 'cardio', metValue: 8.5, caloriesPer30min: 298 },

  // 力量训练
  { name: '力量训练(轻)', category: 'strength', metValue: 3.5, caloriesPer30min: 123 },
  { name: '力量训练(重)', category: 'strength', metValue: 6.0, caloriesPer30min: 210 },
  { name: '俯卧撑', category: 'strength', metValue: 3.8, caloriesPer30min: 133 },
  { name: '深蹲', category: 'strength', metValue: 5.0, caloriesPer30min: 175 },

  // 球类运动
  { name: '篮球', category: 'sports', metValue: 6.5, caloriesPer30min: 228 },
  { name: '足球', category: 'sports', metValue: 7.0, caloriesPer30min: 245 },
  { name: '羽毛球', category: 'sports', metValue: 5.5, caloriesPer30min: 193 },
  { name: '网球', category: 'sports', metValue: 7.3, caloriesPer30min: 256 },
  { name: '乒乓球', category: 'sports', metValue: 4.0, caloriesPer30min: 140 },

  // 日常活动
  { name: '步行(慢)', category: 'daily', metValue: 2.5, caloriesPer30min: 88 },
  { name: '步行(快)', category: 'daily', metValue: 3.5, caloriesPer30min: 123 },
  { name: '爬楼梯', category: 'daily', metValue: 8.0, caloriesPer30min: 280 },
  { name: '瑜伽', category: 'daily', metValue: 2.5, caloriesPer30min: 88 },
  { name: '普拉提', category: 'daily', metValue: 3.0, caloriesPer30min: 105 },
  { name: '家务劳动', category: 'daily', metValue: 3.5, caloriesPer30min: 123 },
];

// 初始化预设数据
export async function seedPresetData() {
  try {
    // 检查是否已有数据
    const existingFoods = await db.select().from(schema.presetFoods).limit(1);
    const existingExercises = await db.select().from(schema.presetExercises).limit(1);

    if (!existingFoods || existingFoods.length === 0) {
      console.log('正在初始化预设食物数据...');
      await db.insert(schema.presetFoods).values(presetFoodsData);
      console.log(`已插入 ${presetFoodsData.length} 条预设食物数据`);
    }

    if (!existingExercises || existingExercises.length === 0) {
      console.log('正在初始化预设运动数据...');
      await db.insert(schema.presetExercises).values(presetExercisesData);
      console.log(`已插入 ${presetExercisesData.length} 条预设运动数据`);
    }
  } catch (error) {
    console.error('初始化预设数据失败:', error);
  }
}
