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

// 创建自定义预设食物
router.post('/presets', async (req, res) => {
  try {
    const { name, nameEn, category, calories, protein, carbs, fat, fiber } = req.body;

    if (!name) {
      return res.status(400).json({ error: '食物名称不能为空' });
    }

    const client = getSupabaseClient();
    
    // 获取当前最大 ID
    const { data: maxIdData } = await client
      .from('preset_foods')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    const nextId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;
    
    const { data, error } = await client.from('preset_foods').insert({
      id: nextId,
      name,
      name_en: nameEn || null,
      category: category || 'other',
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber: fiber || 0,
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('创建预设食物失败:', error);
    res.status(500).json({ error: '创建预设食物失败' });
  }
});

// 更新预设食物
router.put('/presets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nameEn, category, calories, protein, carbs, fat, fiber } = req.body;

    const client = getSupabaseClient();
    const { data, error } = await client.from('preset_foods').update({
      name,
      name_en: nameEn || null,
      category: category || 'other',
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber: fiber || 0,
    }).eq('id', id).select().single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('更新预设食物失败:', error);
    res.status(500).json({ error: '更新预设食物失败' });
  }
});

// 删除预设食物
router.delete('/presets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { error } = await client.from('preset_foods').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('删除预设食物失败:', error);
    res.status(500).json({ error: '删除预设食物失败' });
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
