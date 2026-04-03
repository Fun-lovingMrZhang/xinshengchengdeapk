import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';

const router = Router();

// ============ 预设运动相关 ============

// 获取所有预设运动
router.get('/presets', async (req, res) => {
  try {
    const { category } = req.query;
    const client = getSupabaseClient();

    let query = client.from('preset_exercises').select('*');
    if (category) {
      query = query.eq('category', category as string);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('获取预设运动失败:', error);
    res.status(500).json({ error: '获取预设运动失败' });
  }
});

// ============ 运动记录相关 ============

// 获取指定日期的运动记录
router.get('/records', async (req, res) => {
  try {
    const { date, userId } = req.query;

    if (!date) {
      return res.status(400).json({ error: '缺少日期参数' });
    }

    const client = getSupabaseClient();
    let query = client.from('exercise_records').select('*').eq('date', date);

    if (userId) {
      query = query.eq('user_id', parseInt(userId as string));
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('获取运动记录失败:', error);
    res.status(500).json({ error: '获取运动记录失败' });
  }
});

// 创建运动记录
router.post('/records', async (req, res) => {
  try {
    const { userId, date, exerciseName, duration, caloriesBurned, metValue } = req.body;

    const client = getSupabaseClient();
    const { data, error } = await client.from('exercise_records').insert({
      user_id: userId || null,
      date,
      exercise_name: exerciseName,
      duration: duration || 30,
      calories_burned: caloriesBurned || 0,
      met_value: metValue || null,
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('创建运动记录失败:', error);
    res.status(500).json({ error: '创建运动记录失败' });
  }
});

// 删除运动记录
router.delete('/records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { error } = await client.from('exercise_records').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('删除运动记录失败:', error);
    res.status(500).json({ error: '删除运动记录失败' });
  }
});

// 更新运动记录
router.put('/records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { exerciseName, duration, caloriesBurned } = req.body;
    
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('exercise_records')
      .update({
        exercise_name: exerciseName,
        duration,
        calories_burned: caloriesBurned,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('更新运动记录失败:', error);
    res.status(500).json({ error: '更新运动记录失败' });
  }
});

// 获取指定日期范围的运动记录
router.get('/records/range', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: '缺少日期参数' });
    }

    const client = getSupabaseClient();
    let query = client
      .from('exercise_records')
      .select('*')
      .gte('date', startDate as string)
      .lte('date', endDate as string);

    if (userId) {
      query = query.eq('user_id', parseInt(userId as string));
    }

    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('获取运动记录失败:', error);
    res.status(500).json({ error: '获取运动记录失败' });
  }
});

export default router;
