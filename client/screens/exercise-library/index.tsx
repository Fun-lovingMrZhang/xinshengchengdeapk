import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useExerciseRecords, PresetExercise } from '@/contexts/ExerciseRecordContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, BorderRadius } from '@/constants/theme';

// 运动分类
const CATEGORIES = [
  { key: 'cardio', name: '有氧运动', icon: 'heart-pulse', color: '#EF4444' },
  { key: 'strength', name: '力量训练', icon: 'dumbbell', color: '#F59E0B' },
  { key: 'sports', name: '球类运动', icon: 'basketball', color: '#22C55E' },
  { key: 'daily', name: '日常活动', icon: 'person-walking', color: '#3B82F6' },
];

// 运动图标映射
const EXERCISE_ICONS: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
  '跑步': { icon: 'person-running', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  '游泳': { icon: 'person-swimming', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
  '瑜伽': { icon: 'person-praying', bgColor: '#F3E8FF', iconColor: '#A855F7' },
  '骑行': { icon: 'bicycle', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '健身': { icon: 'dumbbell', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  '篮球': { icon: 'basketball', bgColor: '#FEE2E2', iconColor: '#EF4444' },
  '足球': { icon: 'football', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '羽毛球': { icon: 'table-tennis-paddle-ball', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
  '网球': { icon: 'baseball', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  '跳绳': { icon: 'person-walking', bgColor: '#FEE2E2', iconColor: '#EF4444' },
  '步行': { icon: 'person-walking', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '爬山': { icon: 'mountain', bgColor: '#DCFCE7', iconColor: '#22C55E' },
};

const getExerciseConfig = (name: string) => {
  // 模糊匹配
  for (const [key, config] of Object.entries(EXERCISE_ICONS)) {
    if (name.includes(key) || key.includes(name)) {
      return config;
    }
  }
  return { icon: 'dumbbell', bgColor: '#F3F4F6', iconColor: '#6B7280' };
};

export default function ExerciseLibraryScreen() {
  const { theme, isDark } = useTheme();
  const router = useSafeRouter();
  const { presetExercises, addRecord } = useExerciseRecords();
  
  const [selectedCategory, setSelectedCategory] = useState('cardio');
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<PresetExercise | null>(null);
  const [duration, setDuration] = useState('30');
  const [isSaving, setIsSaving] = useState(false);

  // 筛选当前分类的运动
  const filteredExercises = useMemo(() => {
    return presetExercises.filter(e => e.category === selectedCategory);
  }, [presetExercises, selectedCategory]);

  // 选择运动
  const handleSelectExercise = useCallback((exercise: PresetExercise) => {
    setSelectedExercise(exercise);
    setDuration('30');
    setDurationModalVisible(true);
  }, []);

  // 计算热量
  const calculateCalories = useCallback((exercise: PresetExercise, minutes: number) => {
    // 根据时长按比例计算热量
    return Math.round((exercise.caloriesPer30min / 30) * minutes);
  }, []);

  // 确认添加
  const handleConfirmAdd = useCallback(async () => {
    if (!selectedExercise) return;
    
    const minutes = parseInt(duration) || 30;
    if (minutes <= 0) {
      Alert.alert('提示', '请输入有效的运动时长');
      return;
    }

    setIsSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const calories = calculateCalories(selectedExercise, minutes);
      
      await addRecord({
        date: today,
        exerciseName: selectedExercise.name,
        duration: minutes,
        caloriesBurned: calories,
        metValue: selectedExercise.metValue,
      });

      setDurationModalVisible(false);
      Alert.alert('成功', `已记录「${selectedExercise.name}」${minutes}分钟，消耗${calories}kcal`, [
        { text: '好的', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to add exercise record:', error);
      Alert.alert('错误', '添加运动记录失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [selectedExercise, duration, calculateCalories, addRecord, router]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部导航栏 */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>选择运动</Text>
          <View style={styles.backBtn} />
        </View>

        {/* 分类栏 */}
        <View style={[styles.categoryBar, { backgroundColor: theme.cardBackground }]}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryItem,
                selectedCategory === cat.key && { 
                  backgroundColor: `${cat.color}15`,
                  borderBottomColor: cat.color,
                },
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <FontAwesome6
                name={cat.icon as any}
                size={20}
                color={selectedCategory === cat.key ? cat.color : theme.textMuted}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === cat.key ? cat.color : theme.textMuted },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 运动列表 */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome6 name="dumbbell" size={48} color={theme.textMuted} />
              <ThemedText variant="body" color={theme.textMuted}>暂无运动数据</ThemedText>
            </View>
          ) : (
            <View style={styles.exerciseList}>
              {filteredExercises.map(exercise => {
                const config = getExerciseConfig(exercise.name);
                return (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[styles.exerciseItem, { backgroundColor: theme.cardBackground }]}
                    onPress={() => handleSelectExercise(exercise)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.exerciseIcon, { backgroundColor: config.bgColor }]}>
                      <FontAwesome6 name={config.icon as any} size={24} color={config.iconColor} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <ThemedText variant="bodyMedium" color={theme.textPrimary}>{exercise.name}</ThemedText>
                      <ThemedText variant="small" color={theme.textMuted}>
                        约{exercise.caloriesPer30min}kcal/30分钟
                      </ThemedText>
                    </View>
                    <FontAwesome6 name="plus" size={20} color={theme.primary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* 时长输入弹窗 */}
        <Modal
          visible={durationModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDurationModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDurationModalVisible(false)}
          >
            <View
              style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHeader}>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>记录运动</ThemedText>
                <TouchableOpacity onPress={() => setDurationModalVisible(false)}>
                  <FontAwesome6 name="xmark" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              {selectedExercise && (
                <>
                  <View style={styles.modalExerciseInfo}>
                    {(() => {
                      const config = getExerciseConfig(selectedExercise.name);
                      return (
                        <View style={[styles.exerciseIconLarge, { backgroundColor: config.bgColor }]}>
                          <FontAwesome6 name={config.icon as any} size={32} color={config.iconColor} />
                        </View>
                      );
                    })()}
                    <ThemedText variant="h4" color={theme.textPrimary}>{selectedExercise.name}</ThemedText>
                  </View>

                  <View style={styles.modalField}>
                    <ThemedText variant="small" color={theme.textSecondary}>运动时长（分钟）</ThemedText>
                    <TextInput
                      style={[styles.durationInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                      value={duration}
                      onChangeText={setDuration}
                      keyboardType="numeric"
                      placeholder="输入运动时长"
                      placeholderTextColor={theme.textMuted}
                    />
                  </View>

                  <View style={styles.caloriesPreview}>
                    <ThemedText variant="small" color={theme.textMuted}>预计消耗</ThemedText>
                    <ThemedText variant="h3" color={theme.primary}>
                      {calculateCalories(selectedExercise, parseInt(duration) || 30)}
                    </ThemedText>
                    <ThemedText variant="small" color={theme.textMuted}>kcal</ThemedText>
                  </View>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmAdd}
                    disabled={isSaving}
                  >
                    <LinearGradient
                      colors={[theme.primary, '#896BFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.confirmButtonGradient}
                    >
                      <ThemedText variant="bodyMedium" color="#FFFFFF">
                        {isSaving ? '保存中...' : '确认记录'}
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Screen>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingTop: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  categoryBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryText: {
    fontSize: 12,
    marginTop: 4,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: Spacing['3xl'],
  },
  exerciseList: {
    gap: Spacing.sm,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center' as const,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.lg,
  },
  modalExerciseInfo: {
    alignItems: 'center' as const,
    marginBottom: Spacing.lg,
  },
  exerciseIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: Spacing.sm,
  },
  modalField: {
    marginBottom: Spacing.lg,
  },
  durationInput: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 18,
    marginTop: Spacing.xs,
    textAlign: 'center' as const,
  },
  caloriesPreview: {
    alignItems: 'center' as const,
    marginBottom: Spacing.lg,
  },
  confirmButton: {
    marginTop: Spacing.md,
  },
  confirmButtonGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center' as const,
  },
});
