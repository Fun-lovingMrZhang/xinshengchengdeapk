import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBackendBaseUrl } from '@/utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  height: number;
  weight: number;
  target_weight: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
  body_fat_rate: number;
  daily_fiber: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从本地存储恢复用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || '登录失败' };
      }

      setUser(data.user);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: '网络错误，请重试' };
    }
  }, []);

  // 注册
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || '注册失败' };
      }

      // 注册成功后自动登录
      setUser(data.user);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Register failed:', error);
      return { success: false, error: '网络错误，请重试' };
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/me?userId=${user.id}`);

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
