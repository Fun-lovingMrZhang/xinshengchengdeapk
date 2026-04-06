import React, { useMemo, useState, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SwipeableTabScreen } from '@/components/SwipeableTabScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import { getBackendBaseUrl } from '@/utils/api';

// 活动水平配置
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: '久坐不动', coefficient: 1.2, desc: '办公室工作，几乎不运动' },
  { value: 'light', label: '轻度活动', coefficient: 1.375, desc: '每周运动1-3次' },
  { value: 'moderate', label: '中度活动', coefficient: 1.55, desc: '每周运动3-5次' },
  { value: 'high', label: '高度活动', coefficient: 1.725, desc: '每周运动6-7次' },
  { value: 'extreme', label: '极高强度', coefficient: 1.9, desc: '体力劳动或每天训练2次' },
];

// 目标配置
const GOALS = [
  { value: 'lose', label: '减脂', coefficient: 0.8, color: '#22C55E', 
    proteinRatio: 0.30, carbsRatio: 0.40, fatRatio: 0.30 },
  { value: 'maintain', label: '维持', coefficient: 1.0, color: '#3B82F6',
    proteinRatio: 0.25, carbsRatio: 0.45, fatRatio: 0.30 },
  { value: 'gain', label: '增肌', coefficient: 1.1, color: '#F59E0B',
    proteinRatio: 0.30, carbsRatio: 0.50, fatRatio: 0.20 },
];

interface UserData {
  name: string;
  height: number;
  weight: number;
  targetWeight: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
  bodyFatRate: number;
  dailyFiber: number;
}

interface Stats {
  recordDays: number;
  totalWeightLost: number;
  totalCalories: number;
}

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [userData, setUserData] = useState<UserData>({
    name: '用户',
    height: 170,
    weight: 70,
    targetWeight: 60,
    age: 25,
    gender: 'male',
    activityLevel: 'light',
    goal: 'lose',
    bodyFatRate: 0,
    dailyFiber: 0,
  });

  // 个人参数设置弹窗状态
  const [paramsModalVisible, setParamsModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    bodyFatRate: '',
    dailyFiber: '',
    activityLevel: 'light',
    goal: 'lose',
  });

  // 目标体重设置弹窗状态
  const [targetWeightModalVisible, setTargetWeightModalVisible] = useState(false);
  const [targetWeightInput, setTargetWeightInput] = useState('');

  const [stats, setStats] = useState<Stats>({
    recordDays: 0,
    totalWeightLost: 0,
    totalCalories: 0,
  });

  // 今日营养素摄入
  const [todayIntake, setTodayIntake] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const fetchUserData = async () => {
    try {
      const baseUrl = getBackendBaseUrl();
      
      // 获取用户信息（使用单个用户接口）
      const userRes = await fetch(`${baseUrl}/api/v1/users/1`);
      const user = await userRes.json();
      
      if (user) {
        setUserData({
          name: user.name || '用户',
          height: user.height || 170,
          weight: user.weight || 70,
          targetWeight: user.target_weight || 60,
          age: user.age || 25,
          gender: user.gender || 'male',
          activityLevel: user.activity_level || 'light',
          goal: user.goal || 'lose',
          bodyFatRate: user.body_fat_rate || 0,
          dailyFiber: user.daily_fiber || 0,
        });
      }

      // 获取统计数据
      const foodsRes = await fetch(`${baseUrl}/api/v1/food-records?userId=1`);
      const foodRecordsData = await foodsRes.json();
      const foodRecords = Array.isArray(foodRecordsData) ? foodRecordsData : [];
      
      // 计算记录天数
      const uniqueDates = new Set(foodRecords.map((r: any) => r.record_date || r.date));
      
      setStats({
        recordDays: uniqueDates.size,
        totalWeightLost: 0,
        totalCalories: foodRecords.reduce((sum: number, r: any) => sum + (r.calories || 0), 0),
      });

      // 获取今日的食物记录，计算营养素摄入
      const today = new Date().toISOString().split('T')[0];
      const todayFoods = foodRecords.filter((r: any) => (r.record_date || r.date) === today);
      
      // 保留一位小数，避免浮点数精度问题
      const todayProtein = Math.round(todayFoods.reduce((sum: number, r: any) => sum + (r.protein || 0), 0) * 10) / 10;
      const todayCarbs = Math.round(todayFoods.reduce((sum: number, r: any) => sum + (r.carbs || 0), 0) * 10) / 10;
      const todayFat = Math.round(todayFoods.reduce((sum: number, r: any) => sum + (r.fat || 0), 0) * 10) / 10;
      
      setTodayIntake({
        protein: todayProtein,
        carbs: todayCarbs,
        fat: todayFat,
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // 打开个人参数设置弹窗
  const openParamsModal = () => {
    setEditForm({
      gender: userData.gender,
      age: userData.age ? String(userData.age) : '',
      height: userData.height ? String(userData.height) : '',
      weight: userData.weight ? String(userData.weight) : '',
      bodyFatRate: userData.bodyFatRate ? String(userData.bodyFatRate) : '',
      dailyFiber: userData.dailyFiber ? String(userData.dailyFiber) : '',
      activityLevel: userData.activityLevel,
      goal: userData.goal,
    });
    setParamsModalVisible(true);
  };

  // 保存个人参数
  const handleSaveParams = async () => {
    const updatedData = {
      gender: editForm.gender,
      age: editForm.age ? parseInt(editForm.age) : 0,
      height: editForm.height ? parseFloat(editForm.height) : 0,
      weight: editForm.weight ? parseFloat(editForm.weight) : 0,
      bodyFatRate: editForm.bodyFatRate ? parseFloat(editForm.bodyFatRate) : 0,
      dailyFiber: editForm.dailyFiber ? parseFloat(editForm.dailyFiber) : 0,
      activityLevel: editForm.activityLevel,
      goal: editForm.goal,
    };

    setUserData(prev => ({
      ...prev,
      ...updatedData,
    }));
    setParamsModalVisible(false);

    // 保存到后端
    try {
      const baseUrl = getBackendBaseUrl();
      await fetch(`${baseUrl}/api/v1/users/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: updatedData.gender,
          age: updatedData.age,
          height: updatedData.height,
          weight: updatedData.weight,
          body_fat_rate: updatedData.bodyFatRate,
          daily_fiber: updatedData.dailyFiber,
          activity_level: updatedData.activityLevel,
          goal: updatedData.goal,
        }),
      });
    } catch (error) {
      console.error('Failed to save user params:', error);
    }
  };

  // 打开目标体重弹窗
  const openTargetWeightModal = () => {
    setTargetWeightInput(userData.targetWeight ? String(userData.targetWeight) : '');
    setTargetWeightModalVisible(true);
  };

  // 目标体重数字键盘输入
  const handleTargetWeightKeyPress = (key: string) => {
    if (key === '.') {
      if (!targetWeightInput.includes('.')) {
        setTargetWeightInput(targetWeightInput + '.');
      }
    } else if (key === 'delete') {
      if (targetWeightInput.length > 1) {
        setTargetWeightInput(targetWeightInput.slice(0, -1));
      } else {
        setTargetWeightInput('');
      }
    } else {
      if (targetWeightInput === '' || targetWeightInput === '0') {
        setTargetWeightInput(key);
      } else {
        const parts = targetWeightInput.split('.');
        if (parts.length === 2 && parts[1].length >= 1) return;
        if (targetWeightInput.replace('.', '').length >= 5) return;
        setTargetWeightInput(targetWeightInput + key);
      }
    }
  };

  // 保存目标体重
  const handleSaveTargetWeight = async () => {
    const targetWeight = parseFloat(targetWeightInput);
    if (isNaN(targetWeight) || targetWeight <= 0) return;

    setUserData(prev => ({ ...prev, targetWeight }));
    setTargetWeightModalVisible(false);

    // 保存到后端
    try {
      const baseUrl = getBackendBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/users/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_weight: targetWeight }),
      });
      
      if (response.ok) {
        // 保存成功后重新获取数据确保同步
        fetchUserData();
      }
    } catch (error) {
      console.error('Failed to save target weight:', error);
    }
  };

  // 渲染目标体重数字键盘
  const renderTargetWeightKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['.', '0', 'delete'],
    ];

    return (
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.keypadKey}
                onPress={() => handleTargetWeightKeyPress(key)}
                activeOpacity={0.7}
              >
                {key === 'delete' ? (
                  <FontAwesome6 name="delete-left" size={24} color={theme.textPrimary} />
                ) : (
                  <Text style={styles.keypadKeyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // ============ 计算逻辑 ============

  // 1. 计算基础代谢率 BMR
  // BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄(岁) + 性别常数
  // 男性：+5，女性：-161
  const calculateBMR = useMemo(() => {
    const { weight, height, age, gender } = userData;
    if (weight <= 0 || height <= 0 || age <= 0) return 0;
    
    const genderConstant = gender === 'male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + genderConstant;
    return Math.round(bmr);
  }, [userData.weight, userData.height, userData.age, userData.gender]);

  // 2. 计算每日总能量消耗 TDEE = BMR × 活动系数
  const calculateTDEE = useMemo(() => {
    if (calculateBMR === 0) return 0;
    const activityConfig = ACTIVITY_LEVELS.find(a => a.value === userData.activityLevel);
    const coefficient = activityConfig?.coefficient || 1.2;
    return Math.round(calculateBMR * coefficient);
  }, [calculateBMR, userData.activityLevel]);

  // 3. 计算每日目标热量 = TDEE × 目标系数
  const calculateTargetCalories = useMemo(() => {
    if (calculateTDEE === 0) return 0;
    const goalConfig = GOALS.find(g => g.value === userData.goal);
    const coefficient = goalConfig?.coefficient || 0.8;
    return Math.round(calculateTDEE * coefficient);
  }, [calculateTDEE, userData.goal]);

  // 4. 计算三大营养素目标
  const calculateMacros = useMemo(() => {
    if (calculateTargetCalories === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    const goalConfig = GOALS.find(g => g.value === userData.goal);
    const proteinRatio = goalConfig?.proteinRatio || 0.30;
    const carbsRatio = goalConfig?.carbsRatio || 0.40;
    const fatRatio = goalConfig?.fatRatio || 0.30;

    return {
      protein: Math.round(calculateTargetCalories * proteinRatio / 4), // 1g蛋白质=4kcal
      carbs: Math.round(calculateTargetCalories * carbsRatio / 4),     // 1g碳水=4kcal
      fat: Math.round(calculateTargetCalories * fatRatio / 9),         // 1g脂肪=9kcal
    };
  }, [calculateTargetCalories, userData.goal]);

  const getWeightProgress = () => {
    const startWeight = 70; // 假设初始体重
    const currentWeight = userData.weight;
    const targetWeight = userData.targetWeight;
    const progress = (startWeight - currentWeight) / (startWeight - targetWeight);
    return Math.max(0, Math.min(1, progress));
  };

  // 获取活动水平标签
  const getActivityLabel = () => {
    const config = ACTIVITY_LEVELS.find(a => a.value === userData.activityLevel);
    return config?.label || '轻度活动';
  };

  // 获取目标标签
  const getGoalLabel = () => {
    const config = GOALS.find(g => g.value === userData.goal);
    return config?.label || '减脂';
  };

  const getGoalColor = () => {
    const config = GOALS.find(g => g.value === userData.goal);
    return config?.color || '#22C55E';
  };

  const menuItems = [
    { icon: 'gear', label: '设置', color: '#6B7280', onPress: () => {} },
    { icon: 'crown', label: '会员中心', color: '#F59E0B', onPress: () => {} },
    { icon: 'circle-question', label: '帮助与反馈', color: '#3B82F6', onPress: () => {} },
    { icon: 'info-circle', label: '关于我们', color: '#8B5CF6', onPress: () => {} },
  ];

  return (
    <SwipeableTabScreen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 用户信息卡片 */}
          <ThemedView level="default" style={styles.userCard}>
            {/* 右上角设置按钮 */}
            <TouchableOpacity style={styles.paramsSettingBtn} onPress={openParamsModal}>
              <FontAwesome6 name="gear" size={16} color={theme.textMuted} />
              <Text style={[styles.paramsSettingText, { color: theme.textMuted }]}>个人参数设置</Text>
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Text style={{ fontSize: 36 }}>🥦</Text>
            </View>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.userName}>
              {userData.name}
            </ThemedText>
            <ThemedText variant="body" color={theme.textMuted}>
              {userData.height}cm · {userData.age}岁 · {userData.gender === 'male' ? '男' : '女'}
            </ThemedText>

            {/* 扩展的个人信息 */}
            <View style={styles.userInfoExtended}>
              <View style={styles.infoTag}>
                <FontAwesome6 name="person-walking" size={12} color={theme.primary} />
                <Text style={[styles.infoTagText, { color: theme.textSecondary }]}>
                  {getActivityLabel()}
                </Text>
              </View>
              <View style={[styles.infoTag, { backgroundColor: `${getGoalColor()}15` }]}>
                <FontAwesome6 name="bullseye" size={12} color={getGoalColor()} />
                <Text style={[styles.infoTagText, { color: getGoalColor() }]}>
                  {getGoalLabel()}
                </Text>
              </View>
              {userData.bodyFatRate > 0 && (
                <View style={styles.infoTag}>
                  <FontAwesome6 name="percent" size={12} color={theme.primary} />
                  <Text style={[styles.infoTagText, { color: theme.textSecondary }]}>
                    体脂 {userData.bodyFatRate}%
                  </Text>
                </View>
              )}
            </View>

            {/* 核心数据展示 */}
            <View style={styles.userStats}>
              <View style={styles.userStatItem}>
                <ThemedText variant="h3" color={theme.primary}>{userData.weight}</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>当前体重(kg)</ThemedText>
              </View>
              <View style={styles.userStatItem}>
                <ThemedText variant="h3" color={theme.accent}>{userData.targetWeight}</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>目标体重(kg)</ThemedText>
              </View>
              <View style={styles.userStatItem}>
                <ThemedText variant="h3" color={theme.textPrimary}>{calculateBMR}</ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>基础代谢(kcal)</ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* 热量目标卡片 */}
          <ThemedView level="default" style={styles.caloriesCard}>
            <View style={styles.caloriesHeader}>
              <ThemedText variant="bodyMedium" color={theme.textPrimary}>每日热量目标</ThemedText>
              <View style={[styles.goalTag, { backgroundColor: `${getGoalColor()}20` }]}>
                <Text style={[styles.goalTagText, { color: getGoalColor() }]}>{getGoalLabel()}</Text>
              </View>
            </View>
            
            <View style={styles.caloriesValues}>
              <View style={styles.caloriesMain}>
                <ThemedText variant="h1" color={theme.primary}>{calculateTargetCalories}</ThemedText>
                <ThemedText variant="body" color={theme.textMuted}>kcal/天</ThemedText>
              </View>
            </View>

            {/* 计算过程展示 */}
            <View style={styles.calculationProcess}>
              <View style={styles.processItem}>
                <Text style={[styles.processLabel, { color: theme.textMuted }]}>BMR</Text>
                <Text style={[styles.processValue, { color: theme.textSecondary }]}>{calculateBMR} kcal</Text>
              </View>
              <FontAwesome6 name="arrow-right" size={12} color={theme.textMuted} />
              <View style={styles.processItem}>
                <Text style={[styles.processLabel, { color: theme.textMuted }]}>TDEE</Text>
                <Text style={[styles.processValue, { color: theme.textSecondary }]}>{calculateTDEE} kcal</Text>
              </View>
              <FontAwesome6 name="arrow-right" size={12} color={theme.textMuted} />
              <View style={styles.processItem}>
                <Text style={[styles.processLabel, { color: theme.textMuted }]}>目标</Text>
                <Text style={[styles.processValue, { color: theme.primary }]}>{calculateTargetCalories} kcal</Text>
              </View>
            </View>
          </ThemedView>

          {/* 三大营养素目标卡片 */}
          <ThemedView level="default" style={styles.macrosCard}>
            <ThemedText variant="bodyMedium" color={theme.textPrimary} style={{ marginBottom: 16 }}>
              三大营养素目标
            </ThemedText>
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <View style={[styles.macroIcon, { backgroundColor: '#A78BFA20' }]}>
                  <FontAwesome6 name="drumstick-bite" size={20} color="#A78BFA" />
                </View>
                <View style={styles.macroValueRow}>
                  <ThemedText variant="h3" color={theme.textPrimary}>{todayIntake.protein}</ThemedText>
                  <ThemedText variant="body" color={theme.textMuted}>/{calculateMacros.protein}</ThemedText>
                </View>
                <ThemedText variant="caption" color={theme.textMuted}>蛋白质(g)</ThemedText>
                <View style={styles.macroBar}>
                  <View 
                    style={[
                      styles.macroFill, 
                      { 
                        width: `${Math.min(100, (todayIntake.protein / (calculateMacros.protein || 1)) * 100)}%`, 
                        backgroundColor: '#A78BFA' 
                      }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroIcon, { backgroundColor: '#60A5FA20' }]}>
                  <FontAwesome6 name="wheat-awn" size={20} color="#60A5FA" />
                </View>
                <View style={styles.macroValueRow}>
                  <ThemedText variant="h3" color={theme.textPrimary}>{todayIntake.carbs}</ThemedText>
                  <ThemedText variant="body" color={theme.textMuted}>/{calculateMacros.carbs}</ThemedText>
                </View>
                <ThemedText variant="caption" color={theme.textMuted}>碳水(g)</ThemedText>
                <View style={styles.macroBar}>
                  <View 
                    style={[
                      styles.macroFill, 
                      { 
                        width: `${Math.min(100, (todayIntake.carbs / (calculateMacros.carbs || 1)) * 100)}%`, 
                        backgroundColor: '#60A5FA' 
                      }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroIcon, { backgroundColor: '#FB923C20' }]}>
                  <FontAwesome6 name="droplet" size={20} color="#FB923C" />
                </View>
                <View style={styles.macroValueRow}>
                  <ThemedText variant="h3" color={theme.textPrimary}>{todayIntake.fat}</ThemedText>
                  <ThemedText variant="body" color={theme.textMuted}>/{calculateMacros.fat}</ThemedText>
                </View>
                <ThemedText variant="caption" color={theme.textMuted}>脂肪(g)</ThemedText>
                <View style={styles.macroBar}>
                  <View 
                    style={[
                      styles.macroFill, 
                      { 
                        width: `${Math.min(100, (todayIntake.fat / (calculateMacros.fat || 1)) * 100)}%`, 
                        backgroundColor: '#FB923C' 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </ThemedView>

          {/* 目标进度卡片 */}
          <ThemedView level="default" style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <ThemedText variant="bodyMedium" color={theme.textPrimary}>体重目标进度</ThemedText>
              <TouchableOpacity onPress={openTargetWeightModal}>
                <FontAwesome6 name="pen" size={14} color={theme.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.goalProgress}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <ThemedText variant="h2" color={theme.primary}>
                  {userData.weight}
                </ThemedText>
                <ThemedText variant="body" color={theme.textMuted}>/</ThemedText>
                <ThemedText variant="h2" color={theme.accent}>
                  {userData.targetWeight}
                </ThemedText>
                <ThemedText variant="body" color={theme.textMuted}>kg</ThemedText>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${getWeightProgress() * 100}%` }]} />
              </View>
              <ThemedText variant="caption" color={theme.textMuted} style={{ marginTop: 8 }}>
                还差 {Math.abs(userData.targetWeight - userData.weight).toFixed(1)} kg 达成目标
              </ThemedText>
            </View>
          </ThemedView>

          {/* 统计数据卡片 */}
          <ThemedView level="default" style={styles.statsCard}>
            <ThemedText variant="bodyMedium" color={theme.textPrimary} style={{ marginBottom: 16 }}>
              累计数据
            </ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <ThemedText variant="h2" color={theme.primary} style={styles.statsValue}>
                  {stats.recordDays}
                </ThemedText>
                <ThemedText variant="small" color={theme.textMuted}>记录天数</ThemedText>
              </View>
              <View style={styles.statsItem}>
                <ThemedText variant="h2" color={theme.accent} style={styles.statsValue}>
                  {stats.totalWeightLost}
                </ThemedText>
                <ThemedText variant="small" color={theme.textMuted}>累计减重(kg)</ThemedText>
              </View>
              <View style={styles.statsItem}>
                <ThemedText variant="h2" color={theme.textPrimary} style={styles.statsValue}>
                  {Math.round(stats.totalCalories / 1000)}
                </ThemedText>
                <ThemedText variant="small" color={theme.textMuted}>总摄入(千kcal)</ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* 功能菜单 */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={item.label}
                style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <FontAwesome6 name={item.icon as any} size={18} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <ThemedText variant="body" color={theme.textPrimary}>{item.label}</ThemedText>
                </View>
                <FontAwesome6 name="chevron-right" size={14} color={theme.textMuted} style={styles.menuArrow} />
              </TouchableOpacity>
            ))}
          </View>

          {/* 版本信息 */}
          <View style={styles.versionInfo}>
            <ThemedText variant="caption" color={theme.textMuted}>
              营养追踪 v1.0.0
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* 个人参数设置弹窗 */}
      <Modal
        visible={paramsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setParamsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === 'web'}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
                {/* 标题栏 */}
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>个人参数设置</Text>
                  <TouchableOpacity onPress={() => setParamsModalVisible(false)}>
                    <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* 表单内容 */}
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* 基本信息 */}
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>基本信息</Text>

                  {/* 性别、年龄 */}
                  <View style={styles.formRow}>
                    <View style={styles.formItem}>
                      <Text style={[styles.formLabel, { color: theme.textSecondary }]}>性别</Text>
                      <View style={styles.genderSelector}>
                        <TouchableOpacity
                          style={[
                            styles.genderOption,
                            editForm.gender === 'male' && styles.genderOptionActive,
                            { borderColor: editForm.gender === 'male' ? theme.primary : theme.border }
                          ]}
                          onPress={() => setEditForm(prev => ({ ...prev, gender: 'male' }))}
                        >
                          <FontAwesome6 
                            name="mars" 
                            size={16} 
                            color={editForm.gender === 'male' ? theme.primary : theme.textMuted} 
                          />
                          <Text style={[
                            styles.genderText,
                            { color: editForm.gender === 'male' ? theme.primary : theme.textMuted }
                          ]}>男</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.genderOption,
                            editForm.gender === 'female' && styles.genderOptionActive,
                            { borderColor: editForm.gender === 'female' ? theme.primary : theme.border }
                          ]}
                          onPress={() => setEditForm(prev => ({ ...prev, gender: 'female' }))}
                        >
                          <FontAwesome6 
                            name="venus" 
                            size={16} 
                            color={editForm.gender === 'female' ? theme.primary : theme.textMuted} 
                          />
                          <Text style={[
                            styles.genderText,
                            { color: editForm.gender === 'female' ? theme.primary : theme.textMuted }
                          ]}>女</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.formItem}>
                      <Text style={[styles.formLabel, { color: theme.textSecondary }]}>年龄</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundTertiary, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          value={editForm.age}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, age: text }))}
                          placeholder="请输入"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="number-pad"
                        />
                        <Text style={[styles.inputUnit, { color: theme.textMuted }]}>岁</Text>
                      </View>
                    </View>
                  </View>

                  {/* 身高、体重 */}
                  <View style={styles.formRow}>
                    <View style={styles.formItem}>
                      <Text style={[styles.formLabel, { color: theme.textSecondary }]}>身高</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundTertiary, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          value={editForm.height}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, height: text }))}
                          placeholder="请输入"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="decimal-pad"
                        />
                        <Text style={[styles.inputUnit, { color: theme.textMuted }]}>cm</Text>
                      </View>
                    </View>
                    <View style={styles.formItem}>
                      <Text style={[styles.formLabel, { color: theme.textSecondary }]}>体重</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundTertiary, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          value={editForm.weight}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, weight: text }))}
                          placeholder="请输入"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="decimal-pad"
                        />
                        <Text style={[styles.inputUnit, { color: theme.textMuted }]}>kg</Text>
                      </View>
                    </View>
                  </View>

                  {/* 活动水平 */}
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 8 }]}>活动水平</Text>
                  <View style={styles.activitySelector}>
                    {ACTIVITY_LEVELS.map((level) => (
                      <TouchableOpacity
                        key={level.value}
                        style={[
                          styles.activityOption,
                          editForm.activityLevel === level.value && styles.activityOptionActive,
                          { borderColor: editForm.activityLevel === level.value ? theme.primary : theme.border }
                        ]}
                        onPress={() => setEditForm(prev => ({ ...prev, activityLevel: level.value }))}
                      >
                        <Text style={[
                          styles.activityLabel,
                          { color: editForm.activityLevel === level.value ? theme.primary : theme.textSecondary }
                        ]}>
                          {level.label}
                        </Text>
                        <Text style={[styles.activityDesc, { color: theme.textMuted }]}>{level.desc}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 目标选择 */}
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 8 }]}>我的目标</Text>
                  <View style={styles.goalSelector}>
                    {GOALS.map((goal) => (
                      <TouchableOpacity
                        key={goal.value}
                        style={[
                          styles.goalOption,
                          editForm.goal === goal.value && { borderColor: goal.color, backgroundColor: `${goal.color}10` }
                        ]}
                        onPress={() => setEditForm(prev => ({ ...prev, goal: goal.value }))}
                      >
                        <FontAwesome6 
                          name={goal.value === 'lose' ? 'arrow-trend-down' : goal.value === 'gain' ? 'arrow-trend-up' : 'equals'} 
                          size={20} 
                          color={editForm.goal === goal.value ? goal.color : theme.textMuted} 
                        />
                        <Text style={[
                          styles.goalLabel,
                          { color: editForm.goal === goal.value ? goal.color : theme.textSecondary }
                        ]}>
                          {goal.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 体脂率、膳食纤维 */}
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 8 }]}>其他信息（选填）</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formItem}>
                      <Text style={[styles.formLabel, { color: theme.textSecondary }]}>体脂率</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundTertiary, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          value={editForm.bodyFatRate}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, bodyFatRate: text }))}
                          placeholder="选填"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="decimal-pad"
                        />
                        <Text style={[styles.inputUnit, { color: theme.textMuted }]}>%</Text>
                      </View>
                    </View>
                    <View style={styles.formItem}>
                      <Text style={[styles.formLabel, { color: theme.textSecondary }]}>每日膳食纤维</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundTertiary, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.textInput, { color: theme.textPrimary }]}
                          value={editForm.dailyFiber}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, dailyFiber: text }))}
                          placeholder="选填"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="decimal-pad"
                        />
                        <Text style={[styles.inputUnit, { color: theme.textMuted }]}>g</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* 底部按钮 */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={[styles.cancelBtn, { borderColor: theme.border }]}
                    onPress={() => setParamsModalVisible(false)}
                  >
                    <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                    onPress={handleSaveParams}
                  >
                    <Text style={styles.saveBtnText}>保存</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 目标体重设置弹窗 */}
      <Modal
        visible={targetWeightModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTargetWeightModalVisible(false)}
      >
        <View style={styles.weightModalOverlay}>
          <View style={[styles.weightModal, { backgroundColor: theme.cardBackground }]}>
            {/* 标题栏 */}
            <View style={styles.weightModalHeader}>
              <Text style={[styles.weightModalTitle, { color: theme.textPrimary }]}>设置目标体重</Text>
              <TouchableOpacity onPress={() => setTargetWeightModalVisible(false)}>
                <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* 体重显示 */}
            <View style={styles.weightDisplayRow}>
              <Text style={[styles.weightDisplayValue, { color: targetWeightInput ? theme.textPrimary : theme.textMuted }]}>
                {targetWeightInput || '0.0'}
              </Text>
              <Text style={[styles.weightDisplayUnit, { color: theme.textMuted }]}>kg</Text>
            </View>

            {/* 数字键盘 */}
            {renderTargetWeightKeypad()}

            {/* 保存按钮 */}
            <TouchableOpacity style={[styles.weightSaveBtn, { backgroundColor: theme.primary }]} onPress={handleSaveTargetWeight}>
              <Text style={styles.weightSaveBtnText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SwipeableTabScreen>
  );
}
