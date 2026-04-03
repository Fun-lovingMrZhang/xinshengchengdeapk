import React, { useMemo, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Modal,
  StyleSheet,
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
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, BorderRadius } from '@/constants/theme';

const REMINDER_SETTINGS_KEY = '@reminder_settings';
const USER_ID = 1;

interface ReminderTime {
  hour: number;
  minute: number;
}

interface PlanItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  enabled: boolean;
  color: string;
  time: ReminderTime;
  isInterval?: boolean; // 是否是间隔提醒（如喝水提醒每2小时）
  intervalHours?: number;
}

interface UserPlan {
  targetWeight: number | null;
  currentWeight: number | null;
  targetCalories: number | null;
  targetProtein: number | null;
  targetCarbs: number | null;
  targetFat: number | null;
}

const defaultPlans: PlanItem[] = [
  {
    id: 'breakfast',
    icon: 'mug-hot',
    title: '早餐提醒',
    desc: '提醒记录早餐',
    enabled: false,
    color: '#F59E0B',
    time: { hour: 7, minute: 30 },
  },
  {
    id: 'lunch',
    icon: 'utensils',
    title: '午餐提醒',
    desc: '提醒记录午餐',
    enabled: false,
    color: '#22C55E',
    time: { hour: 12, minute: 0 },
  },
  {
    id: 'dinner',
    icon: 'plate-wheat',
    title: '晚餐提醒',
    desc: '提醒记录晚餐',
    enabled: false,
    color: '#8B5CF6',
    time: { hour: 18, minute: 0 },
  },
  {
    id: 'water',
    icon: 'droplet',
    title: '喝水提醒',
    desc: '每隔一段时间提醒喝水',
    enabled: false,
    color: '#3B82F6',
    time: { hour: 8, minute: 0 },
    isInterval: true,
    intervalHours: 2,
  },
  {
    id: 'weight',
    icon: 'weight-scale',
    title: '称重提醒',
    desc: '提醒记录体重',
    enabled: false,
    color: '#EC4899',
    time: { hour: 8, minute: 0 },
  },
  {
    id: 'exercise',
    icon: 'dumbbell',
    title: '运动提醒',
    desc: '提醒运动',
    enabled: false,
    color: '#10B981',
    time: { hour: 19, minute: 0 },
  },
];

export default function PlanScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [plans, setPlans] = useState<PlanItem[]>(defaultPlans);
  const [userPlan, setUserPlan] = useState<UserPlan>({
    targetWeight: null,
    currentWeight: null,
    targetCalories: null,
    targetProtein: null,
    targetCarbs: null,
    targetFat: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // 时间编辑弹窗状态
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [tempHour, setTempHour] = useState(7);
  const [tempMinute, setTempMinute] = useState(30);
  const [tempInterval, setTempInterval] = useState(2);

  // 格式化时间显示
  const formatTime = (time: ReminderTime) => {
    return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
  };

  // 生成时间描述
  const getTimeDesc = (plan: PlanItem) => {
    if (plan.isInterval) {
      return `每隔 ${plan.intervalHours || 2} 小时提醒，从 ${formatTime(plan.time)} 开始`;
    }
    return `每天 ${formatTime(plan.time)} ${plan.desc}`;
  };

  // 加载提醒设置和用户计划数据
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 并行加载提醒设置和用户数据
      const [savedSettings, userRes] = await Promise.all([
        AsyncStorage.getItem(REMINDER_SETTINGS_KEY),
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/${USER_ID}`).then(r => r.json()),
      ]);

      // 恢复提醒开关状态和时间
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setPlans(prev => prev.map(plan => ({
          ...plan,
          enabled: settings[plan.id]?.enabled ?? false,
          time: settings[plan.id]?.time || plan.time,
          intervalHours: settings[plan.id]?.intervalHours || plan.intervalHours,
        })));
      }

      // 设置用户计划数据
      if (userRes) {
        setUserPlan({
          targetWeight: userRes.target_weight || null,
          currentWeight: userRes.weight || null,
          targetCalories: userRes.target_calories || null,
          targetProtein: userRes.target_protein || null,
          targetCarbs: userRes.target_carbs || null,
          targetFat: userRes.target_fat || null,
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 切换提醒开关并保存
  const togglePlan = async (id: string) => {
    const newPlans = plans.map(plan => 
      plan.id === id ? { ...plan, enabled: !plan.enabled } : plan
    );
    setPlans(newPlans);
    await saveSettings(newPlans);
  };

  // 保存设置到 AsyncStorage
  const saveSettings = async (newPlans: PlanItem[]) => {
    const settings: Record<string, any> = {};
    newPlans.forEach(plan => {
      settings[plan.id] = {
        enabled: plan.enabled,
        time: plan.time,
        intervalHours: plan.intervalHours,
      };
    });
    await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  };

  // 打开时间编辑弹窗
  const openTimePicker = (plan: PlanItem) => {
    setEditingPlan(plan);
    setTempHour(plan.time.hour);
    setTempMinute(plan.time.minute);
    setTempInterval(plan.intervalHours || 2);
    setTimePickerVisible(true);
  };

  // 保存时间设置
  const saveTime = async () => {
    if (!editingPlan) return;
    
    const newPlans = plans.map(plan => {
      if (plan.id === editingPlan.id) {
        return {
          ...plan,
          time: { hour: tempHour, minute: tempMinute },
          intervalHours: plan.isInterval ? tempInterval : plan.intervalHours,
        };
      }
      return plan;
    });
    
    setPlans(newPlans);
    await saveSettings(newPlans);
    setTimePickerVisible(false);
    setEditingPlan(null);
  };

  // 计算体重进度
  const weightProgress = useMemo(() => {
    if (!userPlan.targetWeight || !userPlan.currentWeight) return null;
    const diff = userPlan.currentWeight - userPlan.targetWeight;
    const isGoalReached = Math.abs(diff) < 0.1;
    const needsToLose = diff > 0.1;
    const needsToGain = diff < -0.1;
    
    return {
      diff: Math.abs(diff).toFixed(1),
      isGoalReached,
      needsToLose,
      needsToGain,
    };
  }, [userPlan.targetWeight, userPlan.currentWeight]);

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>计划提醒</Text>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/plan-settings')}>
            <FontAwesome6 name="sliders" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* 我的计划摘要 */}
            {userPlan.targetWeight && (
              <ThemedView level="default" style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <View style={[styles.summaryIcon, { backgroundColor: `${theme.primary}15` }]}>
                    <FontAwesome6 name="bullseye" size={20} color={theme.primary} />
                  </View>
                  <View>
                    <ThemedText variant="bodyMedium" color={theme.textPrimary}>我的目标</ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>坚持就是胜利</ThemedText>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/plan-settings')}>
                    <FontAwesome6 name="pen" size={14} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.summaryStats}>
                  {/* 目标体重 */}
                  <View style={styles.summaryStat}>
                    <ThemedText variant="caption" color={theme.textMuted}>目标体重</ThemedText>
                    <ThemedText variant="h4" color={theme.primary}>
                      {userPlan.targetWeight} <ThemedText variant="small" color={theme.textMuted}>kg</ThemedText>
                    </ThemedText>
                    {weightProgress && (
                      <ThemedText 
                        variant="caption" 
                        color={weightProgress.isGoalReached ? theme.success : theme.textSecondary}
                      >
                        {weightProgress.isGoalReached 
                          ? '🎉 已达成目标！' 
                          : weightProgress.needsToLose
                            ? `当前 ${userPlan.currentWeight}kg，还需减${weightProgress.diff}kg`
                            : `当前 ${userPlan.currentWeight}kg，还需增${weightProgress.diff}kg`
                        }
                      </ThemedText>
                    )}
                  </View>

                  {/* 每日热量 */}
                  {userPlan.targetCalories && (
                    <View style={styles.summaryStat}>
                      <ThemedText variant="caption" color={theme.textMuted}>每日热量</ThemedText>
                      <ThemedText variant="h4" color={theme.textPrimary}>
                        {userPlan.targetCalories} <ThemedText variant="small" color={theme.textMuted}>kcal</ThemedText>
                      </ThemedText>
                    </View>
                  )}
                </View>

                {/* 营养素目标 */}
                {(userPlan.targetProtein || userPlan.targetCarbs || userPlan.targetFat) && (
                  <View style={styles.macroRow}>
                    {userPlan.targetProtein && (
                      <View style={styles.macroItem}>
                        <View style={[styles.macroDot, { backgroundColor: '#A78BFA' }]} />
                        <ThemedText variant="caption" color={theme.textSecondary}>
                          蛋白质 {userPlan.targetProtein}g
                        </ThemedText>
                      </View>
                    )}
                    {userPlan.targetCarbs && (
                      <View style={styles.macroItem}>
                        <View style={[styles.macroDot, { backgroundColor: '#60A5FA' }]} />
                        <ThemedText variant="caption" color={theme.textSecondary}>
                          碳水 {userPlan.targetCarbs}g
                        </ThemedText>
                      </View>
                    )}
                    {userPlan.targetFat && (
                      <View style={styles.macroItem}>
                        <View style={[styles.macroDot, { backgroundColor: '#FB923C' }]} />
                        <ThemedText variant="caption" color={theme.textSecondary}>
                          脂肪 {userPlan.targetFat}g
                        </ThemedText>
                      </View>
                    )}
                  </View>
                )}
              </ThemedView>
            )}

            {/* 计划列表 */}
            <ThemedView level="default" style={styles.planCard}>
              <ThemedText variant="bodyMedium" color={theme.textPrimary} style={{ marginBottom: 16 }}>
                提醒设置
              </ThemedText>
              
              {plans.map((plan) => (
                <View key={plan.id} style={styles.planItem}>
                  <View style={styles.planLeft}>
                    <View style={[styles.planIcon, { backgroundColor: `${plan.color}20` }]}>
                      <FontAwesome6 name={plan.icon as any} size={18} color={plan.color} />
                    </View>
                    <View style={styles.planInfo}>
                      <Text style={[styles.planTitle, { color: theme.textPrimary }]}>{plan.title}</Text>
                      <TouchableOpacity 
                        style={styles.timeRow}
                        onPress={() => openTimePicker(plan)}
                      >
                        <Text style={[styles.planDesc, { color: theme.textMuted }]}>
                          {getTimeDesc(plan)}
                        </Text>
                        <FontAwesome6 name="pen" size={10} color={theme.textMuted} style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Switch
                    value={plan.enabled}
                    onValueChange={() => togglePlan(plan.id)}
                    trackColor={{ false: theme.border, true: `${plan.color}40` }}
                    thumbColor={plan.enabled ? plan.color : theme.textMuted}
                  />
                </View>
              ))}
            </ThemedView>
          </ScrollView>
        )}
      </View>

      {/* 时间选择器弹窗 */}
      <Modal
        visible={timePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <TouchableOpacity 
          style={timePickerStyles.overlay}
          activeOpacity={1}
          onPress={() => setTimePickerVisible(false)}
        >
          <View 
            style={[timePickerStyles.container, { backgroundColor: theme.backgroundDefault }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={timePickerStyles.header}>
              <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
                <Text style={[timePickerStyles.cancelBtn, { color: theme.textMuted }]}>取消</Text>
              </TouchableOpacity>
              <Text style={[timePickerStyles.title, { color: theme.textPrimary }]}>
                {editingPlan?.title}
              </Text>
              <TouchableOpacity onPress={saveTime}>
                <Text style={[timePickerStyles.confirmBtn, { color: theme.primary }]}>确定</Text>
              </TouchableOpacity>
            </View>

            {/* 时间选择 */}
            <View style={timePickerStyles.pickerContainer}>
              <Text style={[timePickerStyles.sectionTitle, { color: theme.textSecondary }]}>
                提醒时间
              </Text>
              <View style={timePickerStyles.timeRow}>
                {/* 小时选择 */}
                <View style={timePickerStyles.timeColumn}>
                  <TouchableOpacity 
                    style={timePickerStyles.timeArrow}
                    onPress={() => setTempHour(prev => (prev + 23) % 24)}
                  >
                    <FontAwesome6 name="chevron-up" size={20} color={theme.textMuted} />
                  </TouchableOpacity>
                  <View style={[timePickerStyles.timeValueBox, { backgroundColor: theme.backgroundTertiary }]}>
                    <Text style={[timePickerStyles.timeValue, { color: theme.textPrimary }]}>
                      {String(tempHour).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={timePickerStyles.timeArrow}
                    onPress={() => setTempHour(prev => (prev + 1) % 24)}
                  >
                    <FontAwesome6 name="chevron-down" size={20} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
                
                <Text style={[timePickerStyles.timeSeparator, { color: theme.textPrimary }]}>:</Text>
                
                {/* 分钟选择 */}
                <View style={timePickerStyles.timeColumn}>
                  <TouchableOpacity 
                    style={timePickerStyles.timeArrow}
                    onPress={() => setTempMinute(prev => (prev + 50) % 60)}
                  >
                    <FontAwesome6 name="chevron-up" size={20} color={theme.textMuted} />
                  </TouchableOpacity>
                  <View style={[timePickerStyles.timeValueBox, { backgroundColor: theme.backgroundTertiary }]}>
                    <Text style={[timePickerStyles.timeValue, { color: theme.textPrimary }]}>
                      {String(tempMinute).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={timePickerStyles.timeArrow}
                    onPress={() => setTempMinute(prev => (prev + 10) % 60)}
                  >
                    <FontAwesome6 name="chevron-down" size={20} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 间隔时间选择（仅喝水提醒） */}
            {editingPlan?.isInterval && (
              <View style={timePickerStyles.intervalContainer}>
                <Text style={[timePickerStyles.sectionTitle, { color: theme.textSecondary }]}>
                  提醒间隔
                </Text>
                <View style={timePickerStyles.intervalOptions}>
                  {[1, 2, 3, 4].map((hours) => (
                    <TouchableOpacity
                      key={hours}
                      style={[
                        timePickerStyles.intervalOption,
                        { 
                          backgroundColor: tempInterval === hours ? theme.primary : theme.backgroundTertiary,
                          borderColor: tempInterval === hours ? theme.primary : theme.border,
                        }
                      ]}
                      onPress={() => setTempInterval(hours)}
                    >
                      <Text style={[
                        timePickerStyles.intervalText,
                        { color: tempInterval === hours ? '#FFFFFF' : theme.textPrimary }
                      ]}>
                        {hours}小时
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
}

// 时间选择器弹窗样式
const timePickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end' as const,
  },
  container: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cancelBtn: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  confirmBtn: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  pickerContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: Spacing.md,
  },
  timeColumn: {
    alignItems: 'center' as const,
  },
  timeArrow: {
    padding: Spacing.md,
  },
  timeValueBox: {
    width: 80,
    height: 60,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  timeValue: {
    fontSize: 36,
    fontWeight: '700' as const,
  },
  timeSeparator: {
    fontSize: 36,
    fontWeight: '700' as const,
  },
  intervalContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  intervalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: Spacing.md,
  },
  intervalOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  intervalText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
