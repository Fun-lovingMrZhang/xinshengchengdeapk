import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';
import { getAllUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const CURRENT_USER_KEY = 'currentUserId';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  refreshUsers: () => Promise<void>;
  createUser: (data: Partial<User>) => Promise<User | null>;
  updateUser: (id: number, data: Partial<User>) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser, isAuthenticated } = useAuth();

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);

      // 如果用户已登录，优先使用 AuthContext 中的用户
      if (isAuthenticated && authUser) {
        const loggedInUser = allUsers.find((u: User) => u.id === authUser.id);
        if (loggedInUser) {
          setCurrentUserState(loggedInUser);
          await AsyncStorage.setItem(CURRENT_USER_KEY, loggedInUser.id.toString());
          return;
        }
      }

      // 从 AsyncStorage 恢复当前用户
      const savedUserId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (savedUserId) {
        const saved = allUsers.find((u: User) => u.id === parseInt(savedUserId));
        if (saved) {
          setCurrentUserState(saved);
        } else if (allUsers.length > 0) {
          setCurrentUserState(allUsers[0]);
          await AsyncStorage.setItem(CURRENT_USER_KEY, allUsers[0].id.toString());
        }
      } else if (allUsers.length > 0) {
        setCurrentUserState(allUsers[0]);
        await AsyncStorage.setItem(CURRENT_USER_KEY, allUsers[0].id.toString());
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const setCurrentUser = useCallback(async (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  }, []);

  const createUser = useCallback(async (data: Partial<User>): Promise<User | null> => {
    try {
      const user = await apiCreateUser({
        name: data.name || '',
        height: data.height || 170,
        weight: data.weight || 70,
        age: data.age || 25,
        gender: data.gender || 'male',
        bodyFat: data.bodyFat || null,
        activityLevel: data.activityLevel || 'moderate',
        goal: data.goal || 'maintain',
        dietPattern: data.dietPattern || 'balanced',
        targetCalories: data.targetCalories || 2000,
        targetProtein: data.targetProtein || 150,
        targetCarbs: data.targetCarbs || 200,
        targetFat: data.targetFat || 67,
        targetFiber: data.targetFiber || 25,
      });

      await refreshUsers();
      return user;
    } catch (error) {
      console.error('创建用户失败:', error);
      return null;
    }
  }, [refreshUsers]);

  const updateUser = useCallback(async (id: number, data: Partial<User>): Promise<User | null> => {
    try {
      const updated = await apiUpdateUser(id, data);
      await refreshUsers();
      return updated;
    } catch (error) {
      console.error('更新用户失败:', error);
      return null;
    }
  }, [refreshUsers]);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      await apiDeleteUser(id);
      await refreshUsers();
      return true;
    } catch (error) {
      console.error('删除用户失败:', error);
      return false;
    }
  }, [refreshUsers]);

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        loading,
        setCurrentUser,
        refreshUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
