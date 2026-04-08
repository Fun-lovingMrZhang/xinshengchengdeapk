import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';

const router = Router();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await db.select().from(schema.users);
    res.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!users || users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('获取用户失败:', error);
    res.status(500).json({ error: '获取用户失败' });
  }
});

// 创建用户
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      encryptedPassword,
      height,
      weight,
      targetWeight,
      age,
      gender,
      bodyFatRate,
      dailyFiber,
      activityLevel,
      goal,
      dietPattern,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      targetFiber,
    } = req.body;

    const newUsers = await db
      .insert(schema.users)
      .values({
        name,
        email,
        encryptedPassword,
        height,
        weight,
        targetWeight,
        age,
        gender,
        bodyFatRate,
        dailyFiber,
        activityLevel,
        goal,
        dietPattern,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat,
        targetFiber,
      })
      .returning();

    res.status(201).json(newUsers[0]);
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ error: '创建用户失败' });
  }
});

// 更新用户 (PUT)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      email,
      encryptedPassword,
      height,
      weight,
      targetWeight,
      age,
      gender,
      bodyFatRate,
      dailyFiber,
      activityLevel,
      goal,
      dietPattern,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      targetFiber,
    } = req.body;

    const updatedUsers = await db
      .update(schema.users)
      .set({
        name,
        email,
        encryptedPassword,
        height,
        weight,
        targetWeight,
        age,
        gender,
        bodyFatRate,
        dailyFiber,
        activityLevel,
        goal,
        dietPattern,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat,
        targetFiber,
      })
      .where(eq(schema.users.id, id))
      .returning();

    if (!updatedUsers || updatedUsers.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ error: '更新用户失败' });
  }
});

// 更新用户 (PATCH) - 部分更新
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const updatedUsers = await db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning();

    if (!updatedUsers || updatedUsers.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ error: '更新用户失败' });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db
      .delete(schema.users)
      .where(eq(schema.users.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ error: '删除用户失败' });
  }
});

export default router;
