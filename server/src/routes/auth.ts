import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
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

    // 检查邮箱是否已被注册
    const existingUsers = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 哈希密码
    const passwordHash = hashPassword(password);

    // 创建用户
    const newUsers = await db
      .insert(schema.users)
      .values({
        name,
        email,
        encryptedPassword: passwordHash,
        height: 170,
        weight: 70,
        age: 25,
        gender: 'male',
        activityLevel: 'light',
        goal: 'maintain',
        dietPattern: 'balanced',
        targetCalories: 2000,
        targetProtein: 150,
        targetCarbs: 200,
        targetFat: 67,
        targetFiber: 25,
      })
      .returning();

    if (!newUsers || newUsers.length === 0) {
      return res.status(500).json({ error: '注册失败，请重试' });
    }

    const newUser = newUsers[0];

    // 返回用户信息（不包含密码）
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      height: newUser.height,
      weight: newUser.weight,
      targetWeight: newUser.targetWeight,
      age: newUser.age,
      gender: newUser.gender,
      bodyFatRate: newUser.bodyFatRate,
      dailyFiber: newUser.dailyFiber,
      activityLevel: newUser.activityLevel,
      goal: newUser.goal,
      dietPattern: newUser.dietPattern,
      targetCalories: newUser.targetCalories,
      targetProtein: newUser.targetProtein,
      targetCarbs: newUser.targetCarbs,
      targetFat: newUser.targetFat,
      targetFiber: newUser.targetFiber,
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

    // 查找用户
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const user = users[0];

    // 验证密码
    const passwordHash = hashPassword(password);
    if (user.encryptedPassword !== passwordHash) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 返回用户信息（不包含密码）
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      targetWeight: user.targetWeight,
      age: user.age,
      gender: user.gender,
      bodyFatRate: user.bodyFatRate,
      dailyFiber: user.dailyFiber,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dietPattern: user.dietPattern,
      targetCalories: user.targetCalories,
      targetProtein: user.targetProtein,
      targetCarbs: user.targetCarbs,
      targetFat: user.targetFat,
      targetFiber: user.targetFiber,
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
    // 从 query 或 header 获取用户 ID
    const userId = req.query.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: '未登录' });
    }

    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, parseInt(userId as string)))
      .limit(1);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const user = users[0];

    // 返回用户信息（不包含密码）
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      targetWeight: user.targetWeight,
      age: user.age,
      gender: user.gender,
      bodyFatRate: user.bodyFatRate,
      dailyFiber: user.dailyFiber,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dietPattern: user.dietPattern,
      targetCalories: user.targetCalories,
      targetProtein: user.targetProtein,
      targetCarbs: user.targetCarbs,
      targetFat: user.targetFat,
      targetFiber: user.targetFiber,
    };

    res.json(userResponse);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

export default router;
