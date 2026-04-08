import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';

const router = Router();

/**
 * 获取所有饮食记录
 * Query: date (可选，YYYY-MM-DD格式)
 */
router.get('/', async (req, res) => {
  try {
    const client = getSupabaseClient();
    const { date, startDate, endDate } = req.query;

    let query = client.from('food_records').select('*');

    if (date) {
      query = query.eq('date', date);
    } else if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('获取饮食记录失败:', error);
    res.status(500).json({ error: '获取饮食记录失败' });
  }
});

/**
 * 获取单个饮食记录
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { data, error } = await client.from('food_records').select('*').eq('id', id).maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: '记录不存在' });
    }
    res.json(data);
  } catch (error) {
    console.error('获取饮食记录失败:', error);
    res.status(500).json({ error: '获取饮食记录失败' });
  }
});

/**
 * 创建饮食记录
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      foodName,
      mealType,
      weight,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      date,
    } = req.body;

    const client = getSupabaseClient();
    const { data, error } = await client.from('food_records').insert({
      user_id: userId || 1,
      food_name: foodName,
      meal_type: mealType || 'snack',
      weight: weight || 100,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber: fiber || 0,
      date: date || new Date().toISOString().split('T')[0],
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('创建饮食记录失败:', error);
    res.status(500).json({ error: '创建饮食记录失败' });
  }
});

/**
 * 更新饮食记录
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    // 转换 camelCase 到 snake_case
    const snakeCaseData: Record<string, unknown> = {};
    const mapping: Record<string, string> = {
      userId: 'user_id',
      foodId: 'food_id',
      foodName: 'food_name',
      mealType: 'meal_type',
      recordDate: 'record_date',
    };

    for (const [key, value] of Object.entries(updateData)) {
      const snakeKey = mapping[key] || key;
      snakeCaseData[snakeKey] = value;
    }
    snakeCaseData.updated_at = new Date().toISOString();

    const client = getSupabaseClient();
    const { data, error } = await client.from('food_records').update(snakeCaseData).eq('id', id).select().maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: '记录不存在' });
    }
    res.json(data);
  } catch (error) {
    console.error('更新饮食记录失败:', error);
    res.status(500).json({ error: '更新饮食记录失败' });
  }
});

/**
 * 删除饮食记录
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { error } = await client.from('food_records').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('删除饮食记录失败:', error);
    res.status(500).json({ error: '删除饮食记录失败' });
  }
});

export default router;
