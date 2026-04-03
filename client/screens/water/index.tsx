import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';

// 水瓶样式
const bottleStyles = StyleSheet.create({
  bottleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  bottleCapContainer: {
    alignItems: 'center',
    zIndex: 2,
  },
  strawTip: {
    width: 12,
    height: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  capTop: {
    width: 70,
    height: 24,
    backgroundColor: '#BFDBFE',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },
  decorativeBand: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#BEF264',
  },
  starButton: {
    position: 'absolute' as const,
    width: 32,
    height: 32,
    backgroundColor: '#FDE047',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
  },
  capBody: {
    width: 76,
    height: 36,
    backgroundColor: '#86EFAC',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 4,
  },
  capThread: {
    width: 2,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  bottleBodyOuter: {
    width: 100,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#93C5FD',
    marginTop: -4,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  strawContainer: {
    position: 'absolute' as const,
    left: 44,
    top: -16,
    bottom: 8,
    width: 12,
    zIndex: 3,
  },
  straw: {
    flex: 1,
    borderRadius: 6,
  },
  // 水（从底部往上填充）
  waterContainer: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  bottleShine: {
    position: 'absolute' as const,
    left: 8,
    top: 10,
    bottom: 10,
    width: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
});

// 水瓶组件 - 水从底部往上填充
const WaterBottle = ({ 
  progress, 
}: { 
  progress: number; // 0-1
}) => {
  // 限制进度在0-1之间，计算水位高度（最大160px）
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const waterHeight = 160 * clampedProgress;
  
  return (
    <View style={bottleStyles.bottleContainer}>
      {/* 瓶盖部分 */}
      <View style={bottleStyles.bottleCapContainer}>
        {/* 吸嘴 */}
        <View style={[bottleStyles.strawTip, { backgroundColor: 'rgba(134, 239, 172, 0.6)' }]} />
        {/* 瓶盖顶部 */}
        <View style={bottleStyles.capTop}>
          {/* 装饰带 */}
          <View style={bottleStyles.decorativeBand} />
          {/* 星星装饰扣 */}
          <View style={bottleStyles.starButton}>
            <FontAwesome6 name="star" size={16} color="#FEF3C7" />
          </View>
        </View>
        {/* 瓶盖主体 */}
        <View style={bottleStyles.capBody}>
          {/* 螺纹纹理 */}
          {[1,2,3,4,5,6,7,8].map(i => (
            <View key={i} style={bottleStyles.capThread} />
          ))}
        </View>
      </View>
      
      {/* 瓶身 */}
      <View style={bottleStyles.bottleBodyOuter}>
        {/* 吸管 */}
        <View style={bottleStyles.strawContainer}>
          <View style={[bottleStyles.straw, { backgroundColor: 'rgba(134, 239, 172, 0.4)' }]} />
        </View>
        
        {/* 水（从底部往上填充） */}
        <View style={[bottleStyles.waterContainer, { height: waterHeight }]} />
        
        {/* 瓶身光泽 */}
        <View style={bottleStyles.bottleShine} />
      </View>
    </View>
  );
};

// 日历组件
const CalendarModal = ({ 
  visible, 
  onClose, 
  currentMonth,
  waterRecords,
  onSelectDate,
  selectedDate,
}: { 
  visible: boolean; 
  onClose: () => void;
  currentMonth: string;
  waterRecords: Record<string, number>;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) => {
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  
  // 解析年月
  const [year, month] = displayMonth.split('-').map(Number);
  
  // 获取月份天数和第一天是周几
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  // 调整为周一开始（0=周一, 6=周日）
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  // 今天的日期
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // 切换月份
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
  
  // 生成日历格子
  const renderDays = () => {
    const days = [];
    
    // 空白格子
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<View key={`empty-${i}`} style={calendarStyles.dayCell} />);
    }
    
    // 日期格子
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const hasRecord = waterRecords[dateStr] !== undefined;
      const waterAmount = waterRecords[dateStr] || 0;
      const isSelected = dateStr === selectedDate;
      
      days.push(
        <TouchableOpacity 
          key={day} 
          style={calendarStyles.dayCell}
          onPress={() => {
            onSelectDate(dateStr);
            onClose();
          }}
          activeOpacity={0.7}
        >
          <View style={[
            calendarStyles.dayContent,
            isToday && calendarStyles.todayCell,
            isSelected && calendarStyles.selectedCell,
          ]}>
            <Text style={[
              calendarStyles.dayText,
              isToday && calendarStyles.todayText,
              isSelected && calendarStyles.selectedText,
            ]}>
              {isToday ? '今' : day}
            </Text>
          </View>
          {hasRecord && (
            <View style={calendarStyles.recordMark}>
              <FontAwesome6 name="droplet" size={10} color="#3B82F6" />
              <Text style={calendarStyles.recordAmount}>{waterAmount}ml</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={calendarStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={calendarStyles.container} onStartShouldSetResponder={() => true}>
          {/* 标题栏 */}
          <View style={calendarStyles.header}>
            <TouchableOpacity onPress={prevMonth} style={calendarStyles.navBtn}>
              <FontAwesome6 name="chevron-left" size={18} color="#212121" />
            </TouchableOpacity>
            <Text style={calendarStyles.title}>{year}年{String(month).padStart(2, '0')}月</Text>
            <TouchableOpacity onPress={nextMonth} style={calendarStyles.navBtn}>
              <FontAwesome6 name="chevron-right" size={18} color="#212121" />
            </TouchableOpacity>
          </View>
          
          {/* 星期表头 */}
          <View style={calendarStyles.weekHeader}>
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
              <Text key={day} style={calendarStyles.weekText}>{day}</Text>
            ))}
          </View>
          
          {/* 日期网格 */}
          <View style={calendarStyles.daysGrid}>
            {renderDays()}
          </View>
          
          {/* 回今天按钮 */}
          <TouchableOpacity style={calendarStyles.todayBtn} onPress={goToToday}>
            <Text style={calendarStyles.todayBtnText}>回今天</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 60,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#757575',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dayContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCell: {
    backgroundColor: '#DBEAFE',
  },
  selectedCell: {
    backgroundColor: '#3B82F6',
  },
  dayText: {
    fontSize: 14,
    color: '#212121',
  },
  todayText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recordMark: {
    alignItems: 'center',
    marginTop: 2,
  },
  recordAmount: {
    fontSize: 8,
    color: '#3B82F6',
    marginTop: 1,
  },
  todayBtn: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  todayBtnText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default function WaterScreen() {
  const { theme, isDark } = useTheme();
  const pageStyles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  // 状态
  const [currentWater, setCurrentWater] = useState(200);
  const [targetWater, setTargetWater] = useState(1920);
  const [quickAmount, setQuickAmount] = useState(200);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [todayRecords, setTodayRecords] = useState([
    { id: 1, time: '10:15', amount: 200, datetime: '2026-03-27 10:15' },
  ]);

  // 日历弹窗
  const [calendarVisible, setCalendarVisible] = useState(false);
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // 模拟每日喝水记录（用于日历显示）
  const waterRecords: Record<string, number> = useMemo(() => ({
    '2026-03-25': 800,
    '2026-03-26': 1200,
    '2026-03-27': 200,
  }), []);

  // 处理日期选择
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    // 根据选中日期更新喝水数据
    const recordWater = waterRecords[date] || 0;
    setCurrentWater(recordWater);
  };

  // 格式化日期显示
  const formatDateDisplay = (dateStr: string) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (dateStr === todayStr) return '今天';
    
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 自定义记录弹窗
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  // 编辑快捷记录弹窗
  const [editQuickModalVisible, setEditQuickModalVisible] = useState(false);
  const [editQuickAmount, setEditQuickAmount] = useState('');
  
  // 设置目标弹窗
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [targetInput, setTargetInput] = useState('');

  // 计算进度
  const progress = Math.min(1, currentWater / targetWater);
  const progressPercent = Math.round(progress * 100);

  // 快速添加喝水
  const handleQuickAdd = () => {
    addWaterRecord(quickAmount);
  };

  // 添加记录
  const addWaterRecord = (amount: number) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const datetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${time}`;
    
    setCurrentWater(prev => prev + amount);
    setTodayRecords(prev => [{
      id: Date.now(),
      time,
      amount,
      datetime,
    }, ...prev]);
  };

  // 自定义添加
  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('提示', '请输入有效的水量');
      return;
    }
    addWaterRecord(amount);
    setCustomAmount('');
    setCustomModalVisible(false);
  };

  // 编辑快捷记录量
  const handleEditQuickAmount = () => {
    const amount = parseInt(editQuickAmount);
    if (isNaN(amount) || amount < 50 || amount > 1000) {
      Alert.alert('提示', '请输入50-1000之间的数值');
      return;
    }
    setQuickAmount(amount);
    setEditQuickAmount('');
    setEditQuickModalVisible(false);
  };

  // 设置目标
  const handleSetTarget = () => {
    const target = parseInt(targetInput);
    if (isNaN(target) || target < 100 || target > 5000) {
      Alert.alert('提示', '请输入100-5000之间的目标值');
      return;
    }
    setTargetWater(target);
    setTargetInput('');
    setTargetModalVisible(false);
  };

  // 删除记录
  const handleDeleteRecord = (id: number, amount: number) => {
    setTodayRecords(prev => prev.filter(r => r.id !== id));
    setCurrentWater(prev => Math.max(0, prev - amount));
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={pageStyles.container}>
        {/* 顶部导航 */}
        <View style={pageStyles.header}>
          <TouchableOpacity style={pageStyles.backBtn} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[pageStyles.headerTitle, { color: theme.textPrimary }]}>
            {formatDateDisplay(selectedDate)}
          </Text>
          <TouchableOpacity 
            style={pageStyles.calendarBtn}
            onPress={() => setCalendarVisible(true)}
          >
            <FontAwesome6 name="calendar" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={pageStyles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 水瓶主视觉卡片 */}
          <ThemedView level="default" style={pageStyles.waterBottleCard}>
            <WaterBottle progress={progress} />
            
            {/* 进度信息 */}
            <View style={pageStyles.progressInfoContainer}>
              <Text style={[pageStyles.progressAmount, { color: theme.textPrimary }]}>
                {currentWater}
              </Text>
              <Text style={[pageStyles.progressUnit, { color: theme.textMuted }]}>ml</Text>
            </View>
          </ThemedView>

          {/* 进度统计区 */}
          <ThemedView level="default" style={pageStyles.statsCard}>
            <View style={pageStyles.statsHeader}>
              <View style={pageStyles.statsItem}>
                <FontAwesome6 name="droplet" size={16} color="#3B82F6" />
                <Text style={[pageStyles.statsLabel, { color: theme.textSecondary }]}>
                  今日已完成: {progressPercent}%
                </Text>
              </View>
              <TouchableOpacity 
                style={pageStyles.targetItem}
                onPress={() => {
                  setTargetInput(String(targetWater));
                  setTargetModalVisible(true);
                }}
              >
                <Text style={[pageStyles.statsLabel, { color: theme.textSecondary }]}>
                  喝水目标: {targetWater}ml
                </Text>
                <FontAwesome6 name="pen" size={12} color={theme.textMuted} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
            
            {/* 进度条 */}
            <View style={pageStyles.progressBar}>
              <View style={[pageStyles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </ThemedView>

          {/* 喝水记录 */}
          <ThemedView level="default" style={pageStyles.recordCard}>
            <Text style={[pageStyles.recordTitle, { color: theme.textPrimary }]}>喝水记录</Text>
            
            {todayRecords.length === 0 ? (
              <View style={pageStyles.emptyState}>
                <FontAwesome6 name="droplet" size={48} color={theme.textMuted} />
                <Text style={[pageStyles.emptyText, { color: theme.textMuted }]}>今天还没有喝水记录</Text>
              </View>
            ) : (
              todayRecords.map((record) => (
                <View key={record.id} style={pageStyles.recordItem}>
                  <View style={pageStyles.recordLeft}>
                    <View style={pageStyles.recordIcon}>
                      <FontAwesome6 name="droplet" size={14} color="#FFFFFF" />
                    </View>
                    <Text style={[pageStyles.recordAmountText, { color: theme.textPrimary }]}>{record.amount}ml</Text>
                  </View>
                  <View style={pageStyles.recordRight}>
                    <Text style={[pageStyles.recordTime, { color: theme.textMuted }]}>{record.datetime}</Text>
                    <TouchableOpacity 
                      style={pageStyles.deleteBtn}
                      onPress={() => handleDeleteRecord(record.id, record.amount)}
                    >
                      <FontAwesome6 name="trash" size={14} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ThemedView>
        </ScrollView>

        {/* 底部操作区 */}
        <View style={pageStyles.bottomBar}>
          <TouchableOpacity 
            style={pageStyles.editQuickBtn}
            onPress={() => {
              setEditQuickAmount(String(quickAmount));
              setEditQuickModalVisible(true);
            }}
          >
            <FontAwesome6 name="pen-to-square" size={18} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={pageStyles.quickAddBtn}
            onPress={handleQuickAdd}
          >
            <FontAwesome6 name="plus" size={18} color="#FFFFFF" />
            <Text style={pageStyles.quickAddBtnText}>快捷记录({quickAmount}ml)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={pageStyles.customAddBtn}
            onPress={() => setCustomModalVisible(true)}
          >
            <FontAwesome6 name="sliders" size={18} color="#4CAF50" />
            <Text style={[pageStyles.customAddBtnText, { color: '#4CAF50' }]}>自定义</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 日历弹窗 */}
      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        currentMonth={currentMonth}
        waterRecords={waterRecords}
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />

      {/* 编辑快捷记录弹窗 */}
      <Modal
        visible={editQuickModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditQuickModalVisible(false)}
      >
        <View style={pageStyles.modalOverlay}>
          <View style={[pageStyles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <Text style={[pageStyles.modalTitle, { color: theme.textPrimary }]}>编辑快捷记录</Text>
            <Text style={[pageStyles.modalDesc, { color: theme.textMuted }]}>
              设置快捷记录的默认喝水量
            </Text>
            <TextInput
              style={[pageStyles.modalInput, { 
                backgroundColor: theme.backgroundTertiary,
                color: theme.textPrimary,
                borderColor: theme.border,
              }]}
              placeholder="请输入水量(ml)"
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
              value={editQuickAmount}
              onChangeText={setEditQuickAmount}
            />
            <View style={pageStyles.modalButtons}>
              <TouchableOpacity 
                style={[pageStyles.modalBtn, { backgroundColor: theme.backgroundTertiary }]}
                onPress={() => setEditQuickModalVisible(false)}
              >
                <Text style={[pageStyles.modalBtnText, { color: theme.textSecondary }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[pageStyles.modalBtn, { backgroundColor: '#4CAF50' }]}
                onPress={handleEditQuickAmount}
              >
                <Text style={[pageStyles.modalBtnText, { color: '#FFFFFF' }]}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 自定义记录弹窗 */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={pageStyles.modalOverlay}>
          <View style={[pageStyles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <Text style={[pageStyles.modalTitle, { color: theme.textPrimary }]}>自定义喝水记录</Text>
            <TextInput
              style={[pageStyles.modalInput, { 
                backgroundColor: theme.backgroundTertiary,
                color: theme.textPrimary,
                borderColor: theme.border,
              }]}
              placeholder="请输入水量(ml)"
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
              value={customAmount}
              onChangeText={setCustomAmount}
            />
            <View style={pageStyles.modalButtons}>
              <TouchableOpacity 
                style={[pageStyles.modalBtn, { backgroundColor: theme.backgroundTertiary }]}
                onPress={() => setCustomModalVisible(false)}
              >
                <Text style={[pageStyles.modalBtnText, { color: theme.textSecondary }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[pageStyles.modalBtn, { backgroundColor: '#4CAF50' }]}
                onPress={handleCustomAdd}
              >
                <Text style={[pageStyles.modalBtnText, { color: '#FFFFFF' }]}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 设置目标弹窗 */}
      <Modal
        visible={targetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTargetModalVisible(false)}
      >
        <View style={pageStyles.modalOverlay}>
          <View style={[pageStyles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <Text style={[pageStyles.modalTitle, { color: theme.textPrimary }]}>设置喝水目标</Text>
            <TextInput
              style={[pageStyles.modalInput, { 
                backgroundColor: theme.backgroundTertiary,
                color: theme.textPrimary,
                borderColor: theme.border,
              }]}
              placeholder="请输入目标水量(ml)"
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
              value={targetInput}
              onChangeText={setTargetInput}
            />
            <View style={pageStyles.modalButtons}>
              <TouchableOpacity 
                style={[pageStyles.modalBtn, { backgroundColor: theme.backgroundTertiary }]}
                onPress={() => setTargetModalVisible(false)}
              >
                <Text style={[pageStyles.modalBtnText, { color: theme.textSecondary }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[pageStyles.modalBtn, { backgroundColor: '#4CAF50' }]}
                onPress={handleSetTarget}
              >
                <Text style={[pageStyles.modalBtnText, { color: '#FFFFFF' }]}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
