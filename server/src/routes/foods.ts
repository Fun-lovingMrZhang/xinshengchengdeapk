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
    const { name, name_en, category, calories, protein, carbs, fat, fiber } = req.body;

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
      name_en,
      category: category || 'other',
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber,
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
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

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('preset_foods')
      .select('*')
      .ilike('name', `%${q}%`)
      .limit(50);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('搜索食物失败:', error);
    res.status(500).json({ error: '搜索食物失败' });
  }
});

export default router;
