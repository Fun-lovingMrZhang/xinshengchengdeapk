import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';

const router = Router();

// ============ 预设食物相关 ============

// 获取所有预设食物
router.get('/presets', async (req, res) => {
  try {
    const { category } = req.query;
    const client = getSupabaseClient();

    let query = client.from('preset_foods').select('*');
    if (category) {
      query = query.eq('category', category as string);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('获取预设食物失败:', error);
    res.status(500).json({ error: '获取预设食物失败' });
  }
});

// 搜索预设食物
router.get('/presets/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from('preset_foods').select('*');
    if (error) throw error;

    const searchTerm = (q as string).toLowerCase();
    const results = data.filter(
      food => food.name.toLowerCase().includes(searchTerm) ||
              (food.name_en && food.name_en.toLowerCase().includes(searchTerm))
    );
    res.json(results);
  } catch (error) {
    console.error('搜索预设食物失败:', error);
    res.status(500).json({ error: '搜索预设食物失败' });
  }
});

// ============ 食物记录相关 ============

// 获取指定日期的食物记录
router.get('/records', async (req, res) => {
  try {
    const { date, userId } = req.query;

    if (!date) {
      return res.status(400).json({ error: '缺少日期参数' });
    }

    const client = getSupabaseClient();
    let query = client.from('food_records').select('*').eq('date', date);

    if (userId) {
      query = query.eq('user_id', parseInt(userId as string));
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('获取食物记录失败:', error);
    res.status(500).json({ error: '获取食物记录失败' });
  }
});

// 创建食物记录
router.post('/records', async (req, res) => {
  try {
    const { userId, date, mealType, foodName, weight, calories, protein, carbs, fat, fiber } = req.body;

    const client = getSupabaseClient();
    const { data, error } = await client.from('food_records').insert({
      user_id: userId || null,
      date,
      meal_type: mealType || 'snack',
      food_name: foodName,
      weight: weight || 100,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber: fiber || 0,
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('创建食物记录失败:', error);
    res.status(500).json({ error: '创建食物记录失败' });
  }
});

// 删除食物记录
router.delete('/records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { error } = await client.from('food_records').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('删除食物记录失败:', error);
    res.status(500).json({ error: '删除食物记录失败' });
  }
});

export default router;
