import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Dimensions, Modal, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SwipeableTabScreen } from '@/components/SwipeableTabScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFoodRecords } from '@/contexts/FoodRecordContext';
import { useExerciseRecords } from '@/contexts/ExerciseRecordContext';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

// 活动系数配置
const ACTIVITY_COEFFICIENTS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  extreme: 1.9,
};

// 目标配置
const GOAL_CONFIG: Record<string, { coefficient: number; proteinRatio: number; carbsRatio: number; fatRatio: number }> = {
  lose: { coefficient: 0.8, proteinRatio: 0.30, carbsRatio: 0.40, fatRatio: 0.30 },
  maintain: { coefficient: 1.0, proteinRatio: 0.25, carbsRatio: 0.45, fatRatio: 0.30 },
  gain: { coefficient: 1.1, proteinRatio: 0.30, carbsRatio: 0.50, fatRatio: 0.20 },
};

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { todayRecords, refreshTodayRecords } = useFoodRecords();
  const { todayCalories: exerciseCalories, refreshTodayRecords: refreshExerciseRecords } = useExerciseRecords();

  // 用户完整数据
  const [userInfo, setUserInfo] = useState({
    currentWeight: 64.0,
    targetWeight: 60,
    height: 170,
    age: 25,
    gender: 'male',
    activityLevel: 'light',
    goal: 'lose',
    water: { current: 0, target: 1920 },
  });

  // 体重录入弹窗状态
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'jin'>('kg');

  // 计算BMR
  const calculateBMR = useMemo(() => {
    const { currentWeight, height, age, gender } = userInfo;
    if (currentWeight <= 0 || height <= 0 || age <= 0) return 0;
    const genderConstant = gender === 'male' ? 5 : -161;
    return Math.round(10 * currentWeight + 6.25 * height - 5 * age + genderConstant);
  }, [userInfo.currentWeight, userInfo.height, userInfo.age, userInfo.gender]);

  // 计算TDEE
  const calculateTDEE = useMemo(() => {
    if (calculateBMR === 0) return 0;
    const coefficient = ACTIVITY_COEFFICIENTS[userInfo.activityLevel] || 1.375;
    return Math.round(calculateBMR * coefficient);
  }, [calculateBMR, userInfo.activityLevel]);

  // 计算目标热量
  const targetCalories = useMemo(() => {
    if (calculateTDEE === 0) return 2000;
    const config = GOAL_CONFIG[userInfo.goal] || GOAL_CONFIG.lose;
    return Math.round(calculateTDEE * config.coefficient);
  }, [calculateTDEE, userInfo.goal]);

  // 计算三大营养素目标
  const macroTargets = useMemo(() => {
    const config = GOAL_CONFIG[userInfo.goal] || GOAL_CONFIG.lose;
    return {
      protein: Math.round(targetCalories * config.proteinRatio / 4),
      carbs: Math.round(targetCalories * config.carbsRatio / 4),
      fat: Math.round(targetCalories * config.fatRatio / 9),
    };
  }, [targetCalories, userInfo.goal]);

  // 从 todayRecords 计算实时统计数据
  const stats = useMemo(() => {
    const foodCalories = todayRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
    const carbs = todayRecords.reduce((sum, r) => sum + (r.carbs || 0), 0);
    const protein = todayRecords.reduce((sum, r) => sum + (r.protein || 0), 0);
    const fat = todayRecords.reduce((sum, r) => sum + (r.fat || 0), 0);

    return {
      remainingCalories: Math.max(0, targetCalories - foodCalories + exerciseCalories),
      foodCalories,
      exerciseCalories,
      carbs: { current: carbs, target: macroTargets.carbs },
      protein: { current: protein, target: macroTargets.protein },
      fat: { current: fat, target: macroTargets.fat },
    };
  }, [todayRecords, targetCalories, exerciseCalories, macroTargets]);

  const fetchUserData = async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      
      // 获取单个用户（使用 /users/1 接口）
      const userRes = await fetch(`${baseUrl}/api/v1/users/1`);
      const currentUser = await userRes.json();
      
      if (currentUser) {
        setUserInfo({
          currentWeight: currentUser.weight || 64,
          targetWeight: currentUser.target_weight || 60,
          height: currentUser.height || 170,
          age: currentUser.age || 25,
          gender: currentUser.gender || 'male',
          activityLevel: currentUser.activity_level || 'light',
          goal: currentUser.goal || 'lose',
          water: { current: 0, target: 1920 },
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshTodayRecords();
      refreshExerciseRecords();
      fetchUserData();
    }, [refreshTodayRecords, refreshExerciseRecords])
  );

  const formatDate = () => {
    const d = new Date();
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, (current / target) * 100);
  };

  const getMotivationalText = () => {
    if (stats.foodCalories === 0) return '来记录今天吃了什么吧~';
    if (stats.remainingCalories > 1500) return '还能吃点，离目标还远呢~';
    if (stats.remainingCalories > 800) return '继续保持，加油哦~';
    if (stats.remainingCalories > 300) return '快达成目标啦！';
    return '今日目标已达成！';
  };

  // 快速添加喝水记录
  const handleQuickAddWater = () => {
    const quickAmount = 200; // 快捷喝水200ml
    setUserInfo(prev => ({
      ...prev,
      water: {
        ...prev.water,
        current: prev.water.current + quickAmount,
      },
    }));
  };

  // 打开体重弹窗 - 默认为空
  const openWeightModal = () => {
    setWeightInput('');
    setWeightModalVisible(true);
  };

  // 数字键盘输入
  const handleKeyPress = (key: string) => {
    if (key === '.') {
      // 只能有一个小数点
      if (!weightInput.includes('.')) {
        setWeightInput(weightInput + '.');
      }
    } else if (key === 'delete') {
      if (weightInput.length > 1) {
        setWeightInput(weightInput.slice(0, -1));
      } else {
        setWeightInput('');
      }
    } else {
      // 数字
      if (weightInput === '' || weightInput === '0') {
        setWeightInput(key);
      } else {
        // 限制小数位数
        const parts = weightInput.split('.');
        if (parts.length === 2 && parts[1].length >= 1) {
          return;
        }
        // 限制总长度
        if (weightInput.replace('.', '').length >= 5) {
          return;
        }
        setWeightInput(weightInput + key);
      }
    }
  };

  // AI拍照识别 - 直接拍照并发送给AI
  const handleAICameraCapture = async () => {
    try {
      // 请求相机权限
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限提示', '需要相机权限才能拍照识别食物，请在设置中开启相机权限。');
        return;
      }

      // 直接打开相机拍照
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        // 拍完后直接跳转到AI页面进行识别
        router.push('/ai', { imageUri, mode: 'recognize' });
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('错误', '打开相机失败，请重试');
    }
  };

  // 保存体重
  const handleSaveWeight = async () => {
    let weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return;

    // 如果是斤，转换为公斤
    if (weightUnit === 'jin') {
      weight = weight / 2;
    }

    setUserInfo(prev => ({ ...prev, currentWeight: weight }));
    setWeightModalVisible(false);

    // 可选：保存到后端
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
      await fetch(`${baseUrl}/api/v1/users/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight }),
      });
    } catch (error) {
      console.error('Failed to save weight:', error);
    }
  };

  // 渲染数字键盘
  const renderKeypad = () => {
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
                onPress={() => handleKeyPress(key)}
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

  return (
    <SwipeableTabScreen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* 页面标题行 */}
          <View style={styles.pageTitleRow}>
            <View style={styles.pageTitleLeft}>
              <ThemedText variant="h2" color={theme.textPrimary}>今日记录</ThemedText>
              <Text style={styles.pageTitleIcon}>✨</Text>
            </View>
            <View style={styles.dateText}>
              <ThemedText variant="caption" color={theme.textSecondary}>{formatDate()}</ThemedText>
            </View>
          </View>

          {/* 卡路里主卡片 */}
          <ThemedView level="default" style={styles.caloriesCard}>
            {/* 剩余热量 + 吉祥物 */}
            <View style={styles.caloriesMain}>
              <View style={styles.caloriesLeft}>
                <ThemedText variant="body" color={theme.textSecondary} style={styles.caloriesLabel}>
                  还可以吃
                </ThemedText>
                <View style={styles.caloriesNumber}>
                  <ThemedText variant="numberLarge" color={theme.primary}>
                    {stats.remainingCalories}
                  </ThemedText>
                  <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.caloriesUnit}>
                    kcal
                  </ThemedText>
                </View>
              </View>

              {/* 吉祥物 */}
              <View style={styles.mascotContainer}>
                <View style={styles.mascotBubble}>
                  <ThemedText variant="caption" color="#92400E" style={{ textAlign: 'center' }}>
                    {getMotivationalText()}
                  </ThemedText>
                </View>
                <View style={styles.mascotIcon}>
                  <Text style={styles.mascotEmoji}>🥦</Text>
                </View>
              </View>
            </View>

            {/* 食物摄入 / 运动燃烧 */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText variant="small" color={theme.textMuted} style={styles.statLabel}>
                  食物摄入
                </ThemedText>
                <ThemedText variant="h3" color={theme.textPrimary} style={styles.statValue}>
                  {stats.foodCalories.toFixed(1)}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>kcal</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText variant="small" color={theme.textMuted} style={styles.statLabel}>
                  运动燃烧
                </ThemedText>
                <ThemedText variant="h3" color={theme.textPrimary} style={styles.statValue}>
                  {stats.exerciseCalories}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>kcal</ThemedText>
              </View>
            </View>

            {/* 三大营养素进度 */}
            <View style={styles.nutrientsContainer}>
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientHeader}>
                  <ThemedText variant="small" color={theme.textSecondary}>碳水</ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>
                    {stats.carbs.current.toFixed(1)}/{stats.carbs.target}g
                  </ThemedText>
                </View>
                <View style={styles.nutrientBar}>
                  <View 
                    style={[
                      styles.nutrientFill, 
                      { width: `${getProgressPercentage(stats.carbs.current, stats.carbs.target)}%`, backgroundColor: '#60A5FA' }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.nutrientRow}>
                <View style={styles.nutrientHeader}>
                  <ThemedText variant="small" color={theme.textSecondary}>蛋白质</ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>
                    {stats.protein.current.toFixed(1)}/{stats.protein.target}g
                  </ThemedText>
                </View>
                <View style={styles.nutrientBar}>
                  <View 
                    style={[
                      styles.nutrientFill, 
                      { width: `${getProgressPercentage(stats.protein.current, stats.protein.target)}%`, backgroundColor: '#A78BFA' }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.nutrientRow}>
                <View style={styles.nutrientHeader}>
                  <ThemedText variant="small" color={theme.textSecondary}>脂肪</ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>
                    {stats.fat.current.toFixed(1)}/{stats.fat.target}g
                  </ThemedText>
                </View>
                <View style={styles.nutrientBar}>
                  <View 
                    style={[
                      styles.nutrientFill, 
                      { width: `${getProgressPercentage(stats.fat.current, stats.fat.target)}%`, backgroundColor: '#FB923C' }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </ThemedView>

          {/* AI拍照识别按钮 */}
          <View style={styles.aiButtonContainer}>
            <TouchableOpacity style={styles.aiButton} onPress={handleAICameraCapture} activeOpacity={0.8}>
              <LinearGradient
                colors={[theme.primary, '#896BFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.aiButtonGradient}
              >
                <FontAwesome6 name="camera" size={20} color="#FFFFFF" />
                <ThemedText variant="bodyMedium" color="#FFFFFF">AI拍照识别</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 功能模块网格 */}
          <View style={styles.modulesGrid}>
            {/* 体重模块 */}
            <ThemedView level="default" style={styles.moduleCard}>
              <View style={styles.moduleHeader}>
                <View style={styles.moduleHeaderLeft}>
                  <View style={[styles.moduleIcon, { backgroundColor: '#FEF3C7' }]}>
                    <FontAwesome6 name="weight-scale" size={18} color="#F59E0B" />
                  </View>
                  <ThemedText variant="bodyMedium" color={theme.textPrimary}>体重</ThemedText>
                </View>
                <TouchableOpacity onPress={() => router.push('/weight-detail')}>
                  <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.moduleContent}>
                <ThemedText variant="h3" color={theme.textPrimary} style={styles.moduleValue}>
                  {userInfo.currentWeight.toFixed(1)}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  目标 {userInfo.targetWeight} 公斤
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={[styles.moduleButton, { backgroundColor: '#FB923C' }]}
                onPress={openWeightModal}
              >
                <ThemedText variant="smallMedium" color="#FFFFFF">记体重</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* 运动模块 */}
            <ThemedView level="default" style={styles.moduleCard}>
              <TouchableOpacity style={styles.moduleHeader} onPress={() => router.push('/exercise-records')}>
                <View style={styles.moduleHeaderLeft}>
                  <View style={[styles.moduleIcon, { backgroundColor: `${theme.primary}15` }]}>
                    <FontAwesome6 name="dumbbell" size={18} color={theme.primary} />
                  </View>
                  <ThemedText variant="bodyMedium" color={theme.textPrimary}>运动</ThemedText>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
              </TouchableOpacity>
              <View style={styles.moduleContent}>
                <ThemedText variant="h3" color={theme.textPrimary} style={styles.moduleValue}>
                  {stats.exerciseCalories}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>今日已消耗 kcal</ThemedText>
              </View>
              <TouchableOpacity 
                style={[styles.moduleButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/exercise-library')}
              >
                <ThemedText variant="smallMedium" color="#FFFFFF">记运动</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* 计划模块 */}
            <ThemedView level="default" style={styles.moduleCard}>
              <TouchableOpacity style={styles.moduleHeader} onPress={() => router.push('/plan')}>
                <View style={styles.moduleHeaderLeft}>
                  <View style={[styles.moduleIcon, { backgroundColor: `${theme.primary}15` }]}>
                    <FontAwesome6 name="calendar-check" size={18} color={theme.primary} />
                  </View>
                  <ThemedText variant="bodyMedium" color={theme.textPrimary}>计划</ThemedText>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
              </TouchableOpacity>
              <View style={styles.moduleContent}>
                {userInfo.targetWeight && userInfo.currentWeight ? (
                  <View>
                    <View style={styles.planProgressRow}>
                      <ThemedText variant="body" color={theme.textSecondary}>
                        目标体重
                      </ThemedText>
                      <ThemedText variant="h4" color={theme.primary}>
                        {userInfo.targetWeight} kg
                      </ThemedText>
                    </View>
                    <View style={styles.planProgressRow}>
                      <ThemedText variant="caption" color={theme.textMuted}>
                        当前 {userInfo.currentWeight} kg
                      </ThemedText>
                      {(() => {
                        const diff = userInfo.currentWeight - userInfo.targetWeight;
                        if (Math.abs(diff) < 0.1) {
                          return (
                            <ThemedText variant="small" color={theme.success}>
                              🎉 已达成目标！
                            </ThemedText>
                          );
                        } else if (diff > 0) {
                          return (
                            <ThemedText variant="small" color={theme.primary}>
                              还需减 {diff.toFixed(1)} kg
                            </ThemedText>
                          );
                        } else {
                          return (
                            <ThemedText variant="small" color={theme.accent}>
                              还需增 {Math.abs(diff).toFixed(1)} kg
                            </ThemedText>
                          );
                        }
                      })()}
                    </View>
                  </View>
                ) : (
                  <ThemedText variant="body" color={theme.textSecondary}>
                    快来制定理想计划吧~
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity 
                style={[styles.moduleButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/plan-settings')}
              >
                <ThemedText variant="smallMedium" color="#FFFFFF">
                  {userInfo.targetWeight ? '修改计划' : '去制定'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* 喝水模块 */}
            <ThemedView level="default" style={styles.moduleCard}>
              <TouchableOpacity style={styles.moduleHeader} onPress={() => router.push('/water')}>
                <View style={styles.moduleHeaderLeft}>
                  <View style={[styles.moduleIcon, { backgroundColor: '#DBEAFE' }]}>
                    <FontAwesome6 name="droplet" size={18} color="#3B82F6" />
                  </View>
                  <ThemedText variant="bodyMedium" color={theme.textPrimary}>喝水</ThemedText>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
              </TouchableOpacity>
              <View style={styles.moduleContent}>
                <ThemedText variant="h3" color={theme.textPrimary} style={styles.moduleValue}>
                  {userInfo.water.current}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  目标 {userInfo.water.target} ml
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={[styles.moduleButton, { backgroundColor: '#3B82F6' }]}
                onPress={handleQuickAddWater}
              >
                <ThemedText variant="smallMedium" color="#FFFFFF">记喝水</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </View>
      </ScrollView>

      {/* 体重录入弹窗 */}
      <Modal
        visible={weightModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWeightModalVisible(false)}
      >
        <View style={styles.weightModalOverlay}>
          <View style={[styles.weightModal, { backgroundColor: theme.cardBackground }]}>
            {/* 标题栏 */}
            <View style={styles.weightModalHeader}>
              <Text style={[styles.weightModalTitle, { color: theme.textPrimary }]}>当前体重</Text>
              <TouchableOpacity onPress={() => setWeightModalVisible(false)}>
                <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* 体重显示 + 单位切换 */}
            <View style={styles.weightDisplayRow}>
              <Text style={[styles.weightDisplayValue, { color: weightInput ? theme.textPrimary : theme.textMuted }]}>
                {weightInput || '0.0'}
              </Text>
              <View style={styles.weightUnitSwitch}>
                <TouchableOpacity
                  style={[styles.weightUnitBtn, weightUnit === 'kg' && styles.weightUnitBtnActive]}
                  onPress={() => setWeightUnit('kg')}
                >
                  <Text style={[styles.weightUnitText, weightUnit === 'kg' && styles.weightUnitTextActive]}>
                    公斤
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.weightUnitBtn, weightUnit === 'jin' && styles.weightUnitBtnActive]}
                  onPress={() => setWeightUnit('jin')}
                >
                  <Text style={[styles.weightUnitText, weightUnit === 'jin' && styles.weightUnitTextActive]}>
                    斤
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 数字键盘 */}
            {renderKeypad()}

            {/* 保存按钮 */}
            <TouchableOpacity style={styles.weightSaveBtn} onPress={handleSaveWeight}>
              <Text style={styles.weightSaveBtnText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SwipeableTabScreen>
  );
}
