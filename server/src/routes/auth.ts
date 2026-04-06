import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';
import crypto from 'crypto';

const router = Router();

// 密码哈希函数
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 生成简单的 token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
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
        activity_level: 'light',
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

    // 返回用户信息（不包含密码）
    const { encrypted_password, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
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

    // 更新最后登录时间
    await client
      .from('users')
      .update({ last_sign_in_at: new Date().toISOString() })
      .eq('id', user.id);

    // 返回用户信息（不包含密码）
    const { encrypted_password, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
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
    // 从 query 或 header 获取用户 ID
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

    const { encrypted_password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

export default router;
