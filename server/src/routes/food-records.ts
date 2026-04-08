import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { eq, and, gte, lte } from 'drizzle-orm';

const router = Router();

/**
 * 获取所有饮食记录
 * Query: date (可选，YYYY-MM-DD格式)
 */
router.get('/', async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;

    let records;

    if (date) {
      // 查询特定日期
      records = await db
        .select()
        .from(schema.foodRecords)
        .where(eq(schema.foodRecords.date, date as string));
    } else if (startDate && endDate) {
      // 查询日期范围
      records = await db
        .select()
        .from(schema.foodRecords)
        .where(and(
          gte(schema.foodRecords.date, startDate as string),
          lte(schema.foodRecords.date, endDate as string)
        ));
    } else {
      // 查询所有
      records = await db.select().from(schema.foodRecords);
    }

    res.json(records || []);
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
    const records = await db
      .select()
      .from(schema.foodRecords)
      .where(eq(schema.foodRecords.id, id))
      .limit(1);

    if (!records || records.length === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }

    res.json(records[0]);
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

    const newRecords = await db
      .insert(schema.foodRecords)
      .values({
        userId: userId || 1,
        foodName,
        mealType: mealType || 'snack',
        weight: weight || 100,
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        fiber: fiber || 0,
        date: date || new Date().toISOString().split('T')[0],
      })
      .returning();

    res.status(201).json(newRecords[0]);
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

    const updatedRecords = await db
      .update(schema.foodRecords)
      .set({
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
      })
      .where(eq(schema.foodRecords.id, id))
      .returning();

    if (!updatedRecords || updatedRecords.length === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }

    res.json(updatedRecords[0]);
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
    await db
      .delete(schema.foodRecords)
      .where(eq(schema.foodRecords.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('删除饮食记录失败:', error);
    res.status(500).json({ error: '删除饮食记录失败' });
  }
});

export default router;
