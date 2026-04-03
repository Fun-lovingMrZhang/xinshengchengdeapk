import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID = 1;
const WATER_GOAL_KEY = '@water_goal';

interface UserPlanData {
  targetWeight: string;
  targetCalories: string;
  targetProtein: string;
  targetCarbs: string;
  targetFat: string;
  targetWater: string;
}

export default function PlanSettingsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  // 目标设置
  const [targetWeight, setTargetWeight] = useState('');
  const [targetCalories, setTargetCalories] = useState('');
  const [targetProtein, setTargetProtein] = useState('');
  const [targetCarbs, setTargetCarbs] = useState('');
  const [targetFat, setTargetFat] = useState('');
  const [targetWater, setTargetWater] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 从后端加载用户数据
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      
      // 获取用户数据
      const userRes = await fetch(`${baseUrl}/api/v1/users/${USER_ID}`);
      const userData = await userRes.json();
      
      // 获取喝水目标（本地存储）
      const waterGoal = await AsyncStorage.getItem(WATER_GOAL_KEY);
      
      if (userData) {
        setTargetWeight(String(userData.target_weight || ''));
        setTargetCalories(String(userData.target_calories || ''));
        setTargetProtein(String(userData.target_protein || ''));
        setTargetCarbs(String(userData.target_carbs || ''));
        setTargetFat(String(userData.target_fat || ''));
        setTargetWater(waterGoal || String(2000));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      Alert.alert('错误', '加载用户数据失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  // 保存设置
  const handleSave = async () => {
    // 验证输入
    const weight = parseFloat(targetWeight);
    const calories = parseInt(targetCalories);
    const protein = parseFloat(targetProtein);
    const carbs = parseFloat(targetCarbs);
    const fat = parseFloat(targetFat);
    const water = parseInt(targetWater);

    if (targetWeight && (isNaN(weight) || weight <= 0 || weight > 500)) {
      Alert.alert('提示', '请输入有效的目标体重（1-500 kg）');
      return;
    }
    if (targetCalories && (isNaN(calories) || calories < 500 || calories > 5000)) {
      Alert.alert('提示', '请输入有效的热量目标（500-5000 kcal）');
      return;
    }

    setIsSaving(true);
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      
      // 构建更新数据
      const updateData: Record<string, number | undefined> = {};
      if (targetWeight) updateData.targetWeight = weight;
      if (targetCalories) updateData.targetCalories = calories;
      if (targetProtein) updateData.targetProtein = protein;
      if (targetCarbs) updateData.targetCarbs = carbs;
      if (targetFat) updateData.targetFat = fat;

      // 更新用户数据到后端
      if (Object.keys(updateData).length > 0) {
        const res = await fetch(`${baseUrl}/api/v1/users/${USER_ID}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
        
        if (!res.ok) {
          throw new Error('Failed to update user');
        }
      }

      // 保存喝水目标到本地
      if (targetWater) {
        await AsyncStorage.setItem(WATER_GOAL_KEY, String(water));
      }

      Alert.alert('成功', '目标设置已保存', [
        { text: '确定', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>制定计划</Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>制定计划</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Text style={[styles.saveBtnText, { color: theme.primary }]}>保存</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 体重目标 */}
          <ThemedView level="default" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#FEF3C7' }]}>
                <FontAwesome6 name="weight-scale" size={20} color="#F59E0B" />
              </View>
              <View>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>体重目标</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>设定你的理想体重</ThemedText>
              </View>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.backgroundTertiary,
                  color: theme.textPrimary,
                }]}
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="decimal-pad"
                placeholder="目标体重"
                placeholderTextColor={theme.textMuted}
              />
              <Text style={[styles.inputUnit, { color: theme.textMuted }]}>kg</Text>
            </View>
          </ThemedView>

          {/* 热量目标 */}
          <ThemedView level="default" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#FEE2E2' }]}>
                <FontAwesome6 name="fire" size={20} color="#EF4444" />
              </View>
              <View>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>每日热量目标</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>控制每日摄入热量</ThemedText>
              </View>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.backgroundTertiary,
                  color: theme.textPrimary,
                }]}
                value={targetCalories}
                onChangeText={setTargetCalories}
                keyboardType="number-pad"
                placeholder="每日热量"
                placeholderTextColor={theme.textMuted}
              />
              <Text style={[styles.inputUnit, { color: theme.textMuted }]}>kcal</Text>
            </View>
          </ThemedView>

          {/* 三大营养素 */}
          <ThemedView level="default" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#E0E7FF' }]}>
                <FontAwesome6 name="chart-pie" size={20} color="#6366F1" />
              </View>
              <View>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>三大营养素目标</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>均衡营养更健康</ThemedText>
              </View>
            </View>
            
            {/* 蛋白质 */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <View style={[styles.nutrientDot, { backgroundColor: '#A78BFA' }]} />
                <Text style={[styles.nutrientName, { color: theme.textSecondary }]}>蛋白质</Text>
              </View>
              <View style={styles.nutrientInput}>
                <TextInput
                  style={[styles.smallInput, { 
                    backgroundColor: theme.backgroundTertiary,
                    color: theme.textPrimary,
                  }]}
                  value={targetProtein}
                  onChangeText={setTargetProtein}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                />
                <Text style={[styles.inputUnit, { color: theme.textMuted }]}>g</Text>
              </View>
            </View>

            {/* 碳水 */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <View style={[styles.nutrientDot, { backgroundColor: '#60A5FA' }]} />
                <Text style={[styles.nutrientName, { color: theme.textSecondary }]}>碳水化合物</Text>
              </View>
              <View style={styles.nutrientInput}>
                <TextInput
                  style={[styles.smallInput, { 
                    backgroundColor: theme.backgroundTertiary,
                    color: theme.textPrimary,
                  }]}
                  value={targetCarbs}
                  onChangeText={setTargetCarbs}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                />
                <Text style={[styles.inputUnit, { color: theme.textMuted }]}>g</Text>
              </View>
            </View>

            {/* 脂肪 */}
            <View style={[styles.nutrientRow, { borderBottomWidth: 0 }]}>
              <View style={styles.nutrientLabel}>
                <View style={[styles.nutrientDot, { backgroundColor: '#FB923C' }]} />
                <Text style={[styles.nutrientName, { color: theme.textSecondary }]}>脂肪</Text>
              </View>
              <View style={styles.nutrientInput}>
                <TextInput
                  style={[styles.smallInput, { 
                    backgroundColor: theme.backgroundTertiary,
                    color: theme.textPrimary,
                  }]}
                  value={targetFat}
                  onChangeText={setTargetFat}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                />
                <Text style={[styles.inputUnit, { color: theme.textMuted }]}>g</Text>
              </View>
            </View>
          </ThemedView>

          {/* 喝水目标 */}
          <ThemedView level="default" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                <FontAwesome6 name="droplet" size={20} color="#3B82F6" />
              </View>
              <View>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>每日喝水目标</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>保持充足水分摄入</ThemedText>
              </View>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.backgroundTertiary,
                  color: theme.textPrimary,
                }]}
                value={targetWater}
                onChangeText={setTargetWater}
                keyboardType="number-pad"
                placeholder="每日水量"
                placeholderTextColor={theme.textMuted}
              />
              <Text style={[styles.inputUnit, { color: theme.textMuted }]}>ml</Text>
            </View>
          </ThemedView>
        </ScrollView>
      </View>
    </Screen>
  );
}
