import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBackendBaseUrl } from '@/utils/api';

interface FoodRecord {
  id: number;
  date: string;
  meal_type: string;
  food_name: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at?: string;
}

interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  records: FoodRecord[];
}

interface FoodRecordContextType {
  // 今日数据
  todayRecords: FoodRecord[];
  todayStats: DailyStats | null;
  
  // 所有记录（按日期分组）
  allRecords: { [date: string]: FoodRecord[] };
  
  // 刷新数据
  refreshTodayRecords: () => Promise<void>;
  refreshAllRecords: () => Promise<void>;
  
  // 添加记录
  addRecord: (record: Omit<FoodRecord, 'id' | 'created_at'>) => Promise<FoodRecord>;
  
  // 删除记录
  deleteRecord: (id: number) => Promise<void>;
  
  // 获取指定日期的记录
  getRecordsByDate: (date: string) => FoodRecord[];
  
  // 加载中状态
  isLoading: boolean;
}

const FoodRecordContext = createContext<FoodRecordContextType | undefined>(undefined);

const STORAGE_KEY_TODAY = 'food_records_today';
const STORAGE_KEY_ALL = 'food_records_all';

export function FoodRecordProvider({ children }: { children: React.ReactNode }) {
  const [todayRecords, setTodayRecords] = useState<FoodRecord[]>([]);
  const [allRecords, setAllRecords] = useState<{ [date: string]: FoodRecord[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  // 获取今日日期字符串
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // 计算今日统计数据
  const todayStats: DailyStats | null = todayRecords.length > 0 ? {
    date: getTodayString(),
    totalCalories: todayRecords.reduce((sum, r) => sum + r.calories, 0),
    // 保留一位小数，避免浮点数精度问题
    totalProtein: Math.round(todayRecords.reduce((sum, r) => sum + r.protein, 0) * 10) / 10,
    totalCarbs: Math.round(todayRecords.reduce((sum, r) => sum + r.carbs, 0) * 10) / 10,
    totalFat: Math.round(todayRecords.reduce((sum, r) => sum + r.fat, 0) * 10) / 10,
    records: todayRecords,
  } : {
    date: getTodayString(),
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    records: [],
  };

  // 从服务器获取今日记录
  const refreshTodayRecords = useCallback(async () => {
    try {
      const today = getTodayString();
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/food-records?date=${today}`);
      const data = await res.json();
      const records: FoodRecord[] = Array.isArray(data) ? data : [];
      
      setTodayRecords(records);
      
      // 同时更新 allRecords
      setAllRecords(prev => ({
        ...prev,
        [today]: records,
      }));
      
      // 保存到本地存储
      await AsyncStorage.setItem(STORAGE_KEY_TODAY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to refresh today records:', error);
      
      // 网络失败时从本地存储读取
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY_TODAY);
        if (cached) {
          setTodayRecords(JSON.parse(cached));
        }
      } catch (e) {
        console.error('Failed to load cached records:', e);
      }
    }
  }, []);

  // 获取所有记录
  const refreshAllRecords = useCallback(async () => {
    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/food-records`);
      const data = await res.json();
      const records: FoodRecord[] = Array.isArray(data) ? data : [];
      
      // 按日期分组
      const grouped: { [date: string]: FoodRecord[] } = {};
      records.forEach(record => {
        if (!grouped[record.date]) {
          grouped[record.date] = [];
        }
        grouped[record.date].push(record);
      });
      
      setAllRecords(grouped);
      
      // 更新今日记录
      const today = getTodayString();
      if (grouped[today]) {
        setTodayRecords(grouped[today]);
      }
      
      // 保存到本地存储
      await AsyncStorage.setItem(STORAGE_KEY_ALL, JSON.stringify(grouped));
    } catch (error) {
      console.error('Failed to refresh all records:', error);
      
      // 网络失败时从本地存储读取
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY_ALL);
        if (cached) {
          setAllRecords(JSON.parse(cached));
        }
      } catch (e) {
        console.error('Failed to load cached records:', e);
      }
    }
  }, []);

  // 添加记录
  const addRecord = useCallback(async (recordData: Omit<FoodRecord, 'id' | 'created_at'>) => {
    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/food-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          date: recordData.date,
          mealType: recordData.meal_type,
          foodName: recordData.food_name,
          weight: recordData.weight,
          calories: recordData.calories,
          protein: recordData.protein,
          carbs: recordData.carbs,
          fat: recordData.fat,
        }),
      });
      
      const newRecord: FoodRecord = await res.json();
      const today = getTodayString();
      
      // 更新今日记录 - 使用函数式更新确保拿到最新状态
      setTodayRecords(prev => {
        const updated = [...prev, newRecord];
        // 异步更新本地存储
        AsyncStorage.setItem(STORAGE_KEY_TODAY, JSON.stringify(updated));
        return updated;
      });
      
      // 更新所有记录 - 使用函数式更新
      setAllRecords(prev => {
        const updated = {
          ...prev,
          [recordData.date]: [...(prev[recordData.date] || []), newRecord],
        };
        // 异步更新本地存储
        AsyncStorage.setItem(STORAGE_KEY_ALL, JSON.stringify(updated));
        return updated;
      });
      
      return newRecord;
      
    } catch (error) {
      console.error('Failed to add record:', error);
      throw error;
    }
  }, []);

  // 删除记录
  const deleteRecord = useCallback(async (id: number) => {
    try {
      const baseUrl = getBackendBaseUrl();
      await fetch(`${baseUrl}/api/v1/food-records/${id}`, {
        method: 'DELETE',
      });
      
      // 更新今日记录
      setTodayRecords(prev => prev.filter(r => r.id !== id));
      
      // 更新所有记录
      setAllRecords(prev => {
        const updated = { ...prev };
        for (const date in updated) {
          updated[date] = updated[date].filter(r => r.id !== id);
        }
        return updated;
      });
      
    } catch (error) {
      console.error('Failed to delete record:', error);
      throw error;
    }
  }, []);

  // 获取指定日期的记录
  const getRecordsByDate = useCallback((date: string): FoodRecord[] => {
    return allRecords[date] || [];
  }, [allRecords]);

  // 初始化加载
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // 先从本地存储加载（快速显示）
      try {
        const [cachedToday, cachedAll] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_TODAY),
          AsyncStorage.getItem(STORAGE_KEY_ALL),
        ]);
        
        if (cachedToday) {
          setTodayRecords(JSON.parse(cachedToday));
        }
        if (cachedAll) {
          setAllRecords(JSON.parse(cachedAll));
        }
      } catch (e) {
        console.error('Failed to load cached data:', e);
      }
      
      // 然后从服务器刷新
      await refreshAllRecords();
      setIsLoading(false);
    };
    
    loadData();
  }, [refreshAllRecords]);

  return (
    <FoodRecordContext.Provider value={{
      todayRecords,
      todayStats,
      allRecords,
      refreshTodayRecords,
      refreshAllRecords,
      addRecord,
      deleteRecord,
      getRecordsByDate,
      isLoading,
    }}>
      {children}
    </FoodRecordContext.Provider>
  );
}

export function useFoodRecords() {
  const context = useContext(FoodRecordContext);
  if (context === undefined) {
    throw new Error('useFoodRecords must be used within a FoodRecordProvider');
  }
  return context;
}
