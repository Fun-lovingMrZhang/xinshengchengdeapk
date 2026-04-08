import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';

const router = Router();

// 字段映射：camelCase -> snake_case
const camelToSnake: Record<string, string> = {
  bodyFatRate: 'body_fat_rate',
  dailyFiber: 'daily_fiber',
  activityLevel: 'activity_level',
  dietPattern: 'diet_pattern',
  targetCalories: 'target_calories',
  targetProtein: 'target_protein',
  targetCarbs: 'target_carbs',
  targetFat: 'target_fat',
  targetFiber: 'target_fiber',
  targetWeight: 'target_weight',
};

// 转换字段名
function toSnakeCase(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = camelToSnake[key] || key;
    result[snakeKey] = value;
  }
  return result;
}

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { data, error } = await client.from('users').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(data);
  } catch (error) {
    console.error('获取用户失败:', error);
    res.status(500).json({ error: '获取用户失败' });
  }
});

// 创建用户
router.post('/', async (req, res) => {
  try {
    const client = getSupabaseClient();
    const snakeCaseData = toSnakeCase(req.body);
    snakeCaseData.updated_at = new Date().toISOString();

    const { data, error } = await client.from('users').insert(snakeCaseData).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ error: '创建用户失败' });
  }
});

// 更新用户 (PUT)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const snakeCaseData = toSnakeCase(req.body);
    snakeCaseData.updated_at = new Date().toISOString();

    const client = getSupabaseClient();
    const { data, error } = await client.from('users').update(snakeCaseData).eq('id', id).select().maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(data);
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ error: '更新用户失败' });
  }
});

// 更新用户 (PATCH) - 部分更新
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const snakeCaseData = toSnakeCase(req.body);
    snakeCaseData.updated_at = new Date().toISOString();

    const client = getSupabaseClient();
    const { data, error } = await client.from('users').update(snakeCaseData).eq('id', id).select().maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(data);
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ error: '更新用户失败' });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = getSupabaseClient();
    const { error } = await client.from('users').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ error: '删除用户失败' });
  }
});

export default router;
