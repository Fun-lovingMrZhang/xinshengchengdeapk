import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { eq, and, gte, lte } from 'drizzle-orm';

const router = Router();

// ============ 预设运动相关 ============

// 获取所有预设运动
router.get('/presets', async (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      const exercises = await db
        .select()
        .from(schema.presetExercises)
        .where(eq(schema.presetExercises.category, category as string));
      return res.json(exercises);
    }

    const exercises = await db.select().from(schema.presetExercises);
    res.json(exercises);
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

    let query = db
      .select()
      .from(schema.exerciseRecords)
      .where(eq(schema.exerciseRecords.date, date as string));

    if (userId) {
      const userIdNum = parseInt(userId as string);
      const records = await db
        .select()
        .from(schema.exerciseRecords)
        .where(and(
          eq(schema.exerciseRecords.date, date as string),
          eq(schema.exerciseRecords.userId, userIdNum)
        ));
      return res.json(records);
    }

    const records = await query;
    res.json(records);
  } catch (error) {
    console.error('获取运动记录失败:', error);
    res.status(500).json({ error: '获取运动记录失败' });
  }
});

// 创建运动记录
router.post('/records', async (req, res) => {
  try {
    const { userId, date, exerciseName, duration, caloriesBurned, metValue } = req.body;

    const newRecords = await db
      .insert(schema.exerciseRecords)
      .values({
        userId: userId || null,
        date,
        exerciseName,
        duration: duration || 30,
        caloriesBurned: caloriesBurned || 0,
        metValue,
      })
      .returning();

    res.status(201).json(newRecords[0]);
  } catch (error) {
    console.error('创建运动记录失败:', error);
    res.status(500).json({ error: '创建运动记录失败' });
  }
});

// 删除运动记录
router.delete('/records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db
      .delete(schema.exerciseRecords)
      .where(eq(schema.exerciseRecords.id, id));
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

    const updatedRecords = await db
      .update(schema.exerciseRecords)
      .set({
        exerciseName,
        duration,
        caloriesBurned,
      })
      .where(eq(schema.exerciseRecords.id, id))
      .returning();

    if (updatedRecords.length === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }

    res.json(updatedRecords[0]);
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

    let records;

    if (userId) {
      const userIdNum = parseInt(userId as string);
      records = await db
        .select()
        .from(schema.exerciseRecords)
        .where(and(
          eq(schema.exerciseRecords.userId, userIdNum),
          gte(schema.exerciseRecords.date, startDate as string),
          lte(schema.exerciseRecords.date, endDate as string)
        ));
    } else {
      records = await db
        .select()
        .from(schema.exerciseRecords)
        .where(and(
          gte(schema.exerciseRecords.date, startDate as string),
          lte(schema.exerciseRecords.date, endDate as string)
        ));
    }

    res.json(records);
  } catch (error) {
    console.error('获取运动记录失败:', error);
    res.status(500).json({ error: '获取运动记录失败' });
  }
});

export default router;
