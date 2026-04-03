import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 运动记录类型
export interface ExerciseRecord {
  id: number;
  date: string;
  exerciseName: string;
  duration: number;
  caloriesBurned: number;
  metValue?: number;
  created_at?: string;
}

// 预设运动类型
export interface PresetExercise {
  id: number;
  name: string;
  category: string;
  metValue: number;
  caloriesPer30min: number;
}

interface ExerciseContextType {
  // 今日运动记录
  todayRecords: ExerciseRecord[];
  // 所有运动记录（用于记录页面）
  allRecords: ExerciseRecord[];
  // 预设运动列表
  presetExercises: PresetExercise[];
  // 今日运动消耗总热量
  todayCalories: number;
  // 是否正在加载
  isLoading: boolean;
  // 刷新今日运动记录
  refreshTodayRecords: () => Promise<void>;
  // 刷新所有运动记录
  refreshAllRecords: () => Promise<void>;
  // 添加运动记录
  addRecord: (record: Omit<ExerciseRecord, 'id'>) => Promise<ExerciseRecord>;
  // 更新运动记录
  updateRecord: (id: number, record: Partial<ExerciseRecord>) => Promise<void>;
  // 删除运动记录
  deleteRecord: (id: number) => Promise<void>;
  // 加载预设运动
  loadPresetExercises: () => Promise<void>;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

const TODAY_RECORDS_KEY = 'exercise_today_records';
const ALL_RECORDS_KEY = 'exercise_all_records';

// 获取今天日期字符串
const getTodayString = () => new Date().toISOString().split('T')[0];

export function ExerciseProvider({ children }: { children: React.ReactNode }) {
  const [todayRecords, setTodayRecords] = useState<ExerciseRecord[]>([]);
  const [allRecords, setAllRecords] = useState<ExerciseRecord[]>([]);
  const [presetExercises, setPresetExercises] = useState<PresetExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 计算今日消耗总热量
  const todayCalories = todayRecords.reduce((sum, r) => sum + r.caloriesBurned, 0);

  // 从后端获取今日运动记录
  const refreshTodayRecords = useCallback(async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      const today = getTodayString();
      const response = await fetch(`${baseUrl}/api/v1/exercises/records?date=${today}`);
      
      if (response.ok) {
        const data = await response.json();
        // 转换字段名
        const records: ExerciseRecord[] = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          exerciseName: item.exercise_name,
          duration: item.duration,
          caloriesBurned: item.calories_burned,
          metValue: item.met_value,
          created_at: item.created_at,
        }));
        setTodayRecords(records);
        // 缓存到本地
        await AsyncStorage.setItem(TODAY_RECORDS_KEY, JSON.stringify(records));
      }
    } catch (error) {
      console.error('Failed to refresh today exercise records:', error);
      // 尝试从本地缓存读取
      const cached = await AsyncStorage.getItem(TODAY_RECORDS_KEY);
      if (cached) {
        setTodayRecords(JSON.parse(cached));
      }
    }
  }, []);

  // 获取所有运动记录（最近30天）
  const refreshAllRecords = useCallback(async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const response = await fetch(
        `${baseUrl}/api/v1/exercises/records/range?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const records: ExerciseRecord[] = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          exerciseName: item.exercise_name,
          duration: item.duration,
          caloriesBurned: item.calories_burned,
          metValue: item.met_value,
          created_at: item.created_at,
        }));
        setAllRecords(records);
        await AsyncStorage.setItem(ALL_RECORDS_KEY, JSON.stringify(records));
      }
    } catch (error) {
      console.error('Failed to refresh all exercise records:', error);
      const cached = await AsyncStorage.getItem(ALL_RECORDS_KEY);
      if (cached) {
        setAllRecords(JSON.parse(cached));
      }
    }
  }, []);

  // 添加运动记录
  const addRecord = useCallback(async (record: Omit<ExerciseRecord, 'id'>): Promise<ExerciseRecord> => {
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
    const response = await fetch(`${baseUrl}/api/v1/exercises/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: record.date,
        exerciseName: record.exerciseName,
        duration: record.duration,
        caloriesBurned: record.caloriesBurned,
        metValue: record.metValue,
      }),
    });

    if (!response.ok) throw new Error('添加运动记录失败');

    const data = await response.json();
    const newRecord: ExerciseRecord = {
      id: data.id,
      date: data.date,
      exerciseName: data.exercise_name,
      duration: data.duration,
      caloriesBurned: data.calories_burned,
      metValue: data.met_value,
      created_at: data.created_at,
    };

    // 更新本地状态
    setTodayRecords(prev => [...prev, newRecord]);
    setAllRecords(prev => [newRecord, ...prev]);

    return newRecord;
  }, []);

  // 更新运动记录
  const updateRecord = useCallback(async (id: number, record: Partial<ExerciseRecord>) => {
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
    const response = await fetch(`${baseUrl}/api/v1/exercises/records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exerciseName: record.exerciseName,
        duration: record.duration,
        caloriesBurned: record.caloriesBurned,
      }),
    });

    if (!response.ok) throw new Error('更新运动记录失败');

    const data = await response.json();
    const updatedRecord: ExerciseRecord = {
      id: data.id,
      date: data.date,
      exerciseName: data.exercise_name,
      duration: data.duration,
      caloriesBurned: data.calories_burned,
      metValue: data.met_value,
      created_at: data.created_at,
    };

    // 更新本地状态
    setTodayRecords(prev => prev.map(r => r.id === id ? updatedRecord : r));
    setAllRecords(prev => prev.map(r => r.id === id ? updatedRecord : r));
  }, []);

  // 删除运动记录
  const deleteRecord = useCallback(async (id: number) => {
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
    const response = await fetch(`${baseUrl}/api/v1/exercises/records/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('删除运动记录失败');

    // 更新本地状态
    setTodayRecords(prev => prev.filter(r => r.id !== id));
    setAllRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // 加载预设运动
  const loadPresetExercises = useCallback(async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      const response = await fetch(`${baseUrl}/api/v1/exercises/presets`);
      
      if (response.ok) {
        const data = await response.json();
        const exercises: PresetExercise[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          metValue: item.met_value,
          caloriesPer30min: item.calories_per_30min,
        }));
        setPresetExercises(exercises);
      }
    } catch (error) {
      console.error('Failed to load preset exercises:', error);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        refreshTodayRecords(),
        refreshAllRecords(),
        loadPresetExercises(),
      ]);
      setIsLoading(false);
    };
    init();
  }, [refreshTodayRecords, refreshAllRecords, loadPresetExercises]);

  return (
    <ExerciseContext.Provider
      value={{
        todayRecords,
        allRecords,
        presetExercises,
        todayCalories,
        isLoading,
        refreshTodayRecords,
        refreshAllRecords,
        addRecord,
        updateRecord,
        deleteRecord,
        loadPresetExercises,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExerciseRecords() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExerciseRecords must be used within ExerciseProvider');
  }
  return context;
}
