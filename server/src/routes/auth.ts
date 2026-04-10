import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';
import crypto from 'crypto';

const router = Router();

// 密码哈希函数
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 验证必填字段
    if (!name || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '请输入有效的邮箱地址' });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少需要6个字符' });
    }

    const client = getSupabaseClient();

    // 检查邮箱是否已被注册
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 哈希密码
    const passwordHash = hashPassword(password);

    // 创建用户
    const { data: newUser, error: createError } = await client
      .from('users')
      .insert({
        name,
        email,
        encrypted_password: passwordHash,
        height: 170,
        weight: 70,
        age: 25,
        gender: 'male',
        activity_level: 'moderate',
        goal: 'maintain',
        diet_pattern: 'balanced',
        target_calories: 2000,
        target_protein: 150,
        target_carbs: 200,
        target_fat: 67,
        target_fiber: 25,
      })
      .select()
      .single();

    if (createError) {
      console.error('创建用户失败:', createError);
      return res.status(500).json({ error: '注册失败，请重试' });
    }

    // 返回用户信息（转换字段名）
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      height: newUser.height,
      weight: newUser.weight,
      target_weight: newUser.target_weight,
      age: newUser.age,
      gender: newUser.gender,
      body_fat_rate: newUser.body_fat_rate,
      daily_fiber: newUser.daily_fiber,
      activity_level: newUser.activity_level,
      goal: newUser.goal,
      diet_pattern: newUser.diet_pattern,
      target_calories: newUser.target_calories,
      target_protein: newUser.target_protein,
      target_carbs: newUser.target_carbs,
      target_fat: newUser.target_fat,
      target_fiber: newUser.target_fiber,
    };

    res.status(201).json({
      user: userResponse,
      message: '注册成功',
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败，请重试' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({ error: '请填写邮箱和密码' });
    }

    const client = getSupabaseClient();

    // 查找用户
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('查询用户失败:', error);
      return res.status(500).json({ error: '登录失败，请重试' });
    }

    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 验证密码
    const passwordHash = hashPassword(password);
    if (user.encrypted_password !== passwordHash) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 返回用户信息（转换字段名）
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      target_weight: user.target_weight,
      age: user.age,
      gender: user.gender,
      body_fat_rate: user.body_fat_rate,
      daily_fiber: user.daily_fiber,
      activity_level: user.activity_level,
      goal: user.goal,
      diet_pattern: user.diet_pattern,
      target_calories: user.target_calories,
      target_protein: user.target_protein,
      target_carbs: user.target_carbs,
      target_fat: user.target_fat,
      target_fiber: user.target_fiber,
    };

    res.json({
      user: userResponse,
      message: '登录成功',
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败，请重试' });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: '未登录' });
    }

    const client = getSupabaseClient();
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', parseInt(userId as string))
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    // 返回用户信息（转换字段名）
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      target_weight: user.target_weight,
      age: user.age,
      gender: user.gender,
      body_fat_rate: user.body_fat_rate,
      daily_fiber: user.daily_fiber,
      activity_level: user.activity_level,
      goal: user.goal,
      diet_pattern: user.diet_pattern,
      target_calories: user.target_calories,
      target_protein: user.target_protein,
      target_carbs: user.target_carbs,
      target_fat: user.target_fat,
      target_fiber: user.target_fiber,
    };

    res.json(userResponse);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

export default router;
