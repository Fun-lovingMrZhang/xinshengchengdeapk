import type { User, FoodRecord, ExerciseRecord, PresetFood, PresetExercise } from '@/types';

// 优先使用环境变量，其次使用生产环境地址作为默认值
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://health-assistant-api-dy1i.onrender.com';

// ============ 用户相关 API ============

/**
 * 获取所有用户
 */
export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/api/v1/users`);
  if (!response.ok) throw new Error('获取用户列表失败');
  return response.json();
}

/**
 * 获取单个用户
 */
export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/users/${id}`);
  if (!response.ok) throw new Error('获取用户失败');
  return response.json();
}

/**
 * 创建用户
 */
export async function createUser(data: Partial<User>): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('创建用户失败');
  return response.json();
}

/**
 * 更新用户
 */
export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('更新用户失败');
  return response.json();
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('删除用户失败');
}

// ============ 食物相关 API ============

/**
 * 获取预设食物
 */
export async function getPresetFoods(category?: string): Promise<PresetFood[]> {
  const url = category 
    ? `${BASE_URL}/api/v1/foods/presets?category=${category}`
    : `${BASE_URL}/api/v1/foods/presets`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('获取预设食物失败');
  return response.json();
}

/**
 * 搜索预设食物
 */
export async function searchPresetFoods(query: string): Promise<PresetFood[]> {
  const response = await fetch(`${BASE_URL}/api/v1/foods/presets/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('搜索食物失败');
  return response.json();
}

/**
 * 获取食物记录
 */
export async function getFoodRecords(date: string, userId?: number): Promise<FoodRecord[]> {
  const url = userId
    ? `${BASE_URL}/api/v1/foods/records?date=${date}&userId=${userId}`
    : `${BASE_URL}/api/v1/foods/records?date=${date}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('获取食物记录失败');
  return response.json();
}

/**
 * 创建食物记录
 */
export async function createFoodRecord(data: Partial<FoodRecord>): Promise<FoodRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/foods/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('创建食物记录失败');
  return response.json();
}

/**
 * 删除食物记录
 */
export async function deleteFoodRecord(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/foods/records/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('删除食物记录失败');
}

// ============ 运动相关 API ============

/**
 * 获取预设运动
 */
export async function getPresetExercises(category?: string): Promise<PresetExercise[]> {
  const url = category
    ? `${BASE_URL}/api/v1/exercises/presets?category=${category}`
    : `${BASE_URL}/api/v1/exercises/presets`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('获取预设运动失败');
  return response.json();
}

/**
 * 获取运动记录
 */
export async function getExerciseRecords(date: string, userId?: number): Promise<ExerciseRecord[]> {
  const url = userId
    ? `${BASE_URL}/api/v1/exercises/records?date=${date}&userId=${userId}`
    : `${BASE_URL}/api/v1/exercises/records?date=${date}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('获取运动记录失败');
  return response.json();
}

/**
 * 创建运动记录
 */
export async function createExerciseRecord(data: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
  const response = await fetch(`${BASE_URL}/api/v1/exercises/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('创建运动记录失败');
  return response.json();
}

/**
 * 删除运动记录
 */
export async function deleteExerciseRecord(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/exercises/records/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('删除运动记录失败');
}
