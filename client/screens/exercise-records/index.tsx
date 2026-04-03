import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useExerciseRecords, ExerciseRecord } from '@/contexts/ExerciseRecordContext';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, BorderRadius } from '@/constants/theme';

// 运动图标和颜色映射
const EXERCISE_CONFIG: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
  '晨跑': { icon: 'person-running', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  '夜跑': { icon: 'person-running', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
  '跑步': { icon: 'person-running', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  '步行': { icon: 'person-walking', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '走路': { icon: 'person-walking', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '游泳': { icon: 'person-swimming', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
  '瑜伽': { icon: 'person-praying', bgColor: '#F3E8FF', iconColor: '#A855F7' },
  '跳绳': { icon: 'person-walking', bgColor: '#FEE2E2', iconColor: '#EF4444' },
  '骑行': { icon: 'bicycle', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '健身': { icon: 'dumbbell', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  '篮球': { icon: 'basketball', bgColor: '#FEE2E2', iconColor: '#EF4444' },
  '足球': { icon: 'football', bgColor: '#DCFCE7', iconColor: '#22C55E' },
  '羽毛球': { icon: 'table-tennis-paddle-ball', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
  '网球': { icon: 'baseball', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
};

const getExerciseConfig = (name: string) => {
  // 模糊匹配
  for (const [key, config] of Object.entries(EXERCISE_CONFIG)) {
    if (name.includes(key) || key.includes(name)) {
      return config;
    }
  }
  return { icon: 'dumbbell', bgColor: '#F3F4F6', iconColor: '#6B7280' };
};

// 日历组件
const CalendarModal = ({ 
  visible, 
  onClose, 
  currentMonth,
  exerciseRecords,
}: { 
  visible: boolean; 
  onClose: () => void;
  currentMonth: string;
  exerciseRecords: Record<string, { count: number; calories: number }>;
}) => {
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  
  const [year, month] = displayMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const prevMonth = () => {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setDisplayMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };
  
  const nextMonth = () => {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setDisplayMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };
  
  const goToToday = () => {
    setDisplayMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
  };
  
  const renderDays = () => {
    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<View key={`empty-${i}`} style={calendarStyles.dayCell} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const hasRecord = exerciseRecords[dateStr] !== undefined;
      
      days.push(
        <View key={day} style={calendarStyles.dayCell}>
          <View style={[calendarStyles.dayContent, isToday && calendarStyles.todayCell]}>
            <Text style={[calendarStyles.dayText, isToday && calendarStyles.todayText]}>
              {isToday ? '今' : day}
            </Text>
          </View>
          {hasRecord && (
            <View style={calendarStyles.recordMark}>
              <FontAwesome6 name="dumbbell" size={10} color="#22C55E" />
            </View>
          )}
        </View>
      );
    }
    return days;
  };
  
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={calendarStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={calendarStyles.container} onStartShouldSetResponder={() => true}>
          <View style={calendarStyles.header}>
            <TouchableOpacity onPress={prevMonth} style={calendarStyles.navBtn}>
              <FontAwesome6 name="chevron-left" size={18} color="#212121" />
            </TouchableOpacity>
            <Text style={calendarStyles.title}>{year}年{String(month).padStart(2, '0')}月</Text>
            <TouchableOpacity onPress={nextMonth} style={calendarStyles.navBtn}>
              <FontAwesome6 name="chevron-right" size={18} color="#212121" />
            </TouchableOpacity>
          </View>
          <View style={calendarStyles.weekHeader}>
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
              <Text key={day} style={calendarStyles.weekText}>{day}</Text>
            ))}
          </View>
          <View style={calendarStyles.daysGrid}>{renderDays()}</View>
          <TouchableOpacity style={calendarStyles.todayBtn} onPress={goToToday}>
            <Text style={calendarStyles.todayBtnText}>回今天</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const calendarStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-start' },
  container: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 60, borderRadius: 16, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#212121' },
  weekHeader: { flexDirection: 'row', marginBottom: 8 },
  weekText: { flex: 1, textAlign: 'center', fontSize: 12, color: '#757575' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  dayContent: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  todayCell: { backgroundColor: '#DCFCE7' },
  dayText: { fontSize: 14, color: '#212121' },
  todayText: { color: '#22C55E', fontWeight: '600' },
  recordMark: { marginTop: 2 },
  todayBtn: { marginTop: 16, paddingVertical: 12, backgroundColor: '#F5F5F5', borderRadius: 8, alignItems: 'center' },
  todayBtnText: { fontSize: 14, color: '#757575' },
});

export default function ExerciseRecordsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(), []);
  const router = useSafeRouter();
  const { allRecords, refreshAllRecords, updateRecord, deleteRecord } = useExerciseRecords();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExerciseRecord | null>(null);
  const [editDuration, setEditDuration] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // 确认删除弹窗
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 成功提示弹窗
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      refreshAllRecords();
    }, [refreshAllRecords])
  );

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // 计算每日运动记录（用于日历显示）
  const exerciseRecordsByDate = useMemo(() => {
    const records: Record<string, { count: number; calories: number }> = {};
    allRecords.forEach(record => {
      if (!records[record.date]) {
        records[record.date] = { count: 0, calories: 0 };
      }
      records[record.date].count += 1;
      records[record.date].calories += record.caloriesBurned;
    });
    return records;
  }, [allRecords]);

  // 按日期分组
  const groupedRecords = useMemo(() => {
    const groups: Record<string, ExerciseRecord[]> = {};
    allRecords.forEach(record => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      groups[record.date].push(record);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [allRecords]);

  // 长按显示操作菜单
  const handleLongPress = useCallback((record: ExerciseRecord) => {
    setEditingRecord(record);
    setEditDuration(String(record.duration));
    setEditModalVisible(true);
  }, []);

  // 保存编辑
  const handleSaveEdit = useCallback(async () => {
    if (!editingRecord) return;
    
    const newDuration = parseInt(editDuration) || 30;
    if (newDuration <= 0) {
      Alert.alert('提示', '请输入有效的运动时长');
      return;
    }

    // 根据时长按比例重新计算热量
    const newCalories = Math.round((editingRecord.caloriesBurned / editingRecord.duration) * newDuration);

    setIsSaving(true);
    try {
      await updateRecord(editingRecord.id, {
        duration: newDuration,
        caloriesBurned: newCalories,
      });
      setEditModalVisible(false);
      // 显示成功提示
      setSuccessMessage('运动记录已更新');
      setSuccessVisible(true);
      setTimeout(() => {
        setSuccessVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to update record:', error);
      Alert.alert('错误', '更新失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [editingRecord, editDuration, updateRecord]);

  // 删除记录 - 显示确认弹窗
  const handleDelete = useCallback(() => {
    if (!editingRecord) return;
    setDeleteConfirmVisible(true);
  }, [editingRecord]);
  
  // 确认删除 - 执行实际删除操作
  const confirmDelete = useCallback(async () => {
    if (!editingRecord) return;
    
    setIsDeleting(true);
    try {
      await deleteRecord(editingRecord.id);
      setEditModalVisible(false);
      setDeleteConfirmVisible(false);
      // 显示成功提示
      setSuccessMessage('运动记录已删除');
      setSuccessVisible(true);
      // 2秒后自动关闭
      setTimeout(() => {
        setSuccessVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to delete record:', error);
      Alert.alert('错误', '删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  }, [editingRecord, deleteRecord]);

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部导航栏 */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={20} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>运动记录</Text>
          <TouchableOpacity style={styles.calendarBtn} onPress={() => setCalendarVisible(true)}>
            <FontAwesome6 name="calendar" size={20} color="#212121" />
          </TouchableOpacity>
        </View>

        {/* 提示文字 */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>长按记录可编辑或删除</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {allRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <FontAwesome6 name="leaf" size={64} color="#86EFAC" />
              </View>
              <Text style={styles.emptyTitle}>暂无记录...</Text>
              <Text style={styles.emptySubTitle}>要不起来动动呢~</Text>
            </View>
          ) : (
            groupedRecords.map(([date, dateRecords]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateTitle}>{date}</Text>
                <View style={[styles.recordCard, { backgroundColor: theme.cardBackground }]}>
                  {dateRecords.map((record, index) => {
                    const config = getExerciseConfig(record.exerciseName);
                    return (
                      <TouchableOpacity
                        key={record.id}
                        style={[styles.recordItem, index < dateRecords.length - 1 && styles.recordItemBorder]}
                        onLongPress={() => handleLongPress(record)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.recordLeft}>
                          <View style={[styles.exerciseIcon, { backgroundColor: config.bgColor }]}>
                            <FontAwesome6 name={config.icon as any} size={24} color={config.iconColor} />
                          </View>
                          <View style={styles.exerciseInfo}>
                            <Text style={[styles.exerciseName, { color: theme.textPrimary }]}>
                              {record.exerciseName}
                            </Text>
                            <Text style={styles.exerciseDuration}>{record.duration}分钟</Text>
                          </View>
                        </View>
                        <View style={styles.recordRight}>
                          <Text style={[styles.caloriesValue, { color: theme.primary }]}>
                            {record.caloriesBurned.toFixed(0)}
                          </Text>
                          <Text style={styles.caloriesUnit}>kcal</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* 底部添加按钮 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/exercise-library')}>
            <FontAwesome6 name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>记运动</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 日历弹窗 */}
      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        currentMonth={currentMonth}
        exerciseRecords={exerciseRecordsByDate}
      />

      {/* 编辑弹窗 */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity
          style={editStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEditModalVisible(false)}
        >
          <View
            style={[editStyles.modalContent, { backgroundColor: theme.cardBackground }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={editStyles.modalHeader}>
              <ThemedText variant="bodyMedium" color={theme.textPrimary}>编辑运动记录</ThemedText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <FontAwesome6 name="xmark" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {editingRecord && (
              <>
                <View style={editStyles.exerciseInfo}>
                  {(() => {
                    const config = getExerciseConfig(editingRecord.exerciseName);
                    return (
                      <View style={[editStyles.exerciseIconLarge, { backgroundColor: config.bgColor }]}>
                        <FontAwesome6 name={config.icon as any} size={32} color={config.iconColor} />
                      </View>
                    );
                  })()}
                  <ThemedText variant="h4" color={theme.textPrimary}>{editingRecord.exerciseName}</ThemedText>
                </View>

                <View style={editStyles.modalField}>
                  <ThemedText variant="small" color={theme.textSecondary}>运动时长（分钟）</ThemedText>
                  <TextInput
                    style={[editStyles.durationInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                    value={editDuration}
                    onChangeText={setEditDuration}
                    keyboardType="numeric"
                    placeholder="输入运动时长"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>

                <View style={editStyles.caloriesPreview}>
                  <ThemedText variant="small" color={theme.textMuted}>预计消耗</ThemedText>
                  <ThemedText variant="h3" color={theme.primary}>
                    {Math.round((editingRecord.caloriesBurned / editingRecord.duration) * (parseInt(editDuration) || 30))}
                  </ThemedText>
                  <ThemedText variant="small" color={theme.textMuted}>kcal</ThemedText>
                </View>

                <View style={editStyles.buttonRow}>
                  <TouchableOpacity style={editStyles.deleteButton} onPress={handleDelete}>
                    <FontAwesome6 name="trash" size={16} color="#EF4444" />
                    <Text style={editStyles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={editStyles.saveButton} onPress={handleSaveEdit} disabled={isSaving}>
                    <LinearGradient
                      colors={[theme.primary, '#896BFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={editStyles.saveButtonGradient}
                    >
                      <ThemedText variant="bodyMedium" color="#FFFFFF">
                        {isSaving ? '保存中...' : '保存修改'}
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 确认删除弹窗 */}
      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={confirmStyles.overlay}>
          <Animated.View style={[confirmStyles.container, { backgroundColor: theme.backgroundDefault }]}>
            {/* 图标 */}
            <View style={confirmStyles.iconContainer}>
              <View style={[confirmStyles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
                <FontAwesome6 name="trash" size={28} color="#EF4444" />
              </View>
            </View>
            
            {/* 标题和描述 */}
            <ThemedText variant="h4" color={theme.textPrimary} style={confirmStyles.title}>
              确认删除
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary} style={confirmStyles.message}>
              {editingRecord ? `确定要删除「${editingRecord.exerciseName}」的运动记录吗？此操作无法撤销。` : '确定要删除此记录吗？'}
            </ThemedText>
            
            {/* 按钮组 */}
            <View style={confirmStyles.buttonRow}>
              <TouchableOpacity
                style={confirmStyles.cancelButton}
                onPress={() => setDeleteConfirmVisible(false)}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={confirmStyles.cancelButtonGradient}
                >
                  <Text style={confirmStyles.cancelButtonText}>取消</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[confirmStyles.button, confirmStyles.deleteButton]}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={confirmStyles.deleteButtonGradient}
                >
                  {isDeleting ? (
                    <Text style={confirmStyles.deleteButtonText}>删除中...</Text>
                  ) : (
                    <Text style={confirmStyles.deleteButtonText}>确认删除</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* 成功提示弹窗 */}
      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={successStyles.overlay}>
          <Animated.View style={[successStyles.container, { backgroundColor: theme.backgroundDefault }]}>
            {/* 成功图标 */}
            <View style={successStyles.iconContainer}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={successStyles.iconCircle}
              >
                <FontAwesome6 name="check" size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
            
            {/* 成功消息 */}
            <ThemedText variant="bodyMedium" color={theme.textPrimary} style={successStyles.message}>
              {successMessage}
            </ThemedText>
          </Animated.View>
        </View>
      </Modal>
    </Screen>
  );
}

// 确认删除弹窗样式
const confirmStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: Spacing.sm,
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    overflow: 'hidden',
  },
  cancelButtonGradient: {
    width: '100%',
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  deleteButton: {
    flex: 1,
    overflow: 'hidden',
  },
  deleteButtonGradient: {
    width: '100%',
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

// 成功提示弹窗样式
const successStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconContainer: {
    // icon container
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    // message text
  },
});

const editStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exerciseInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exerciseIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  caloriesPreview: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
  },
  saveButtonGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
});
