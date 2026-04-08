import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { eq, like, sql } from 'drizzle-orm';

const router = Router();

// ============ 预设食物相关 ============

// 获取所有预设食物
router.get('/presets', async (req, res) => {
  try {
    const { category } = req.query;

    let query = db.select().from(schema.presetFoods);
    
    if (category) {
      const foods = await db
        .select()
        .from(schema.presetFoods)
        .where(eq(schema.presetFoods.category, category as string));
      return res.json(foods);
    }

    const foods = await query;
    res.json(foods);
  } catch (error) {
    console.error('获取预设食物失败:', error);
    res.status(500).json({ error: '获取预设食物失败' });
  }
});

// 创建自定义预设食物
router.post('/presets', async (req, res) => {
  try {
    const { name, nameEn, category, calories, protein, carbs, fat, fiber } = req.body;

    if (!name) {
      return res.status(400).json({ error: '食物名称不能为空' });
    }

    const newFoods = await db
      .insert(schema.presetFoods)
      .values({
        name,
        nameEn,
        category: category || 'other',
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        fiber,
      })
      .returning();

    res.status(201).json(newFoods[0]);
  } catch (error) {
    console.error('创建预设食物失败:', error);
    res.status(500).json({ error: '创建预设食物失败' });
  }
});

// 搜索食物
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || (q as string).trim().length === 0) {
      return res.status(400).json({ error: '请输入搜索关键词' });
    }

    const searchTerm = `%${q}%`;
    const foods = await db
      .select()
      .from(schema.presetFoods)
      .where(like(schema.presetFoods.name, searchTerm))
      .limit(50);

    res.json(foods);
  } catch (error) {
    console.error('搜索食物失败:', error);
    res.status(500).json({ error: '搜索食物失败' });
  }
});

export default router;
