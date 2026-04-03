import React, { useMemo, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Text,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/contexts/UserContext';
import { createStyles } from './styles';
import { FontAwesome6 } from '@expo/vector-icons';
import { createExerciseRecord } from '@/services/api';
import { getTodayString, calculateExerciseCalories, formatNumber } from '@/utils/nutrition';

// 运动分类配置
const EXERCISE_CATEGORIES = [
  { key: 'run', label: '跑步健走', icon: 'person-running' },
  { key: 'outdoor', label: '户外探索', icon: 'mountain-sun' },
  { key: 'cycling', label: '户外骑行', icon: 'bicycle' },
  { key: 'water', label: '水上运动', icon: 'water' },
  { key: 'ball', label: '球类竞技', icon: 'volleyball' },
  { key: 'dance', label: '有氧舞蹈', icon: 'music' },
  { key: 'mind', label: '身心修养', icon: 'spa' },
  { key: 'strength', label: '肌力训练', icon: 'dumbbell' },
  { key: 'equipment', label: '器械有氧', icon: 'dumbbell' },
  { key: 'custom', label: '自定义', icon: 'plus' },
];

// 运动数据（模拟AI生成的卡通图标）
const EXERCISE_DATA: { [category: string]: Array<{ id: number; name: string; calories: number; icon: string; category: string; bgColor: string; iconColor: string }> } = {
  run: [
    { id: 1, name: '晨跑', calories: 78, icon: 'person-running', category: 'run', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
    { id: 2, name: '夜跑', calories: 72, icon: 'person-running', category: 'run', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 3, name: '快走', calories: 45, icon: 'person-walking', category: 'run', bgColor: '#DCFCE7', iconColor: '#22C55E' },
    { id: 4, name: '慢跑', calories: 60, icon: 'person-running', category: 'run', bgColor: '#F0FDF4', iconColor: '#16A34A' },
    { id: 5, name: '竞走', calories: 55, icon: 'person-walking', category: 'run', bgColor: '#FEE2E2', iconColor: '#EF4444' },
  ],
  outdoor: [
    { id: 6, name: '登山', calories: 72, icon: 'mountain', category: 'outdoor', bgColor: '#DCFCE7', iconColor: '#16A34A' },
    { id: 7, name: '徒步', calories: 48, icon: 'person-hiking', category: 'outdoor', bgColor: '#F0FDF4', iconColor: '#22C55E' },
    { id: 8, name: '攀岩', calories: 85, icon: 'hands', category: 'outdoor', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
    { id: 9, name: '滑冰', calories: 68, icon: 'person-skating', category: 'outdoor', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 10, name: '轮滑', calories: 60, icon: 'person-skating', category: 'outdoor', bgColor: '#E0E7FF', iconColor: '#6366F1' },
  ],
  cycling: [
    { id: 11, name: '骑行', calories: 65, icon: 'bicycle', category: 'cycling', bgColor: '#DCFCE7', iconColor: '#22C55E' },
    { id: 12, name: '山地车', calories: 75, icon: 'bicycle', category: 'cycling', bgColor: '#F0FDF4', iconColor: '#16A34A' },
    { id: 13, name: '动感单车', calories: 80, icon: 'bicycle', category: 'cycling', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  ],
  water: [
    { id: 14, name: '游泳', calories: 90, icon: 'person-swimming', category: 'water', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 15, name: '划船', calories: 70, icon: 'sailboat', category: 'water', bgColor: '#E0F2FE', iconColor: '#0EA5E9' },
    { id: 16, name: '冲浪', calories: 85, icon: 'water', category: 'water', bgColor: '#BAE6FD', iconColor: '#0284C7' },
  ],
  ball: [
    { id: 17, name: '篮球', calories: 75, icon: 'basketball', category: 'ball', bgColor: '#FEE2E2', iconColor: '#EF4444' },
    { id: 18, name: '足球', calories: 80, icon: 'futbol', category: 'ball', bgColor: '#DCFCE7', iconColor: '#22C55E' },
    { id: 19, name: '羽毛球', calories: 65, icon: 'table-tennis-paddle-ball', category: 'ball', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 20, name: '网球', calories: 70, icon: 'baseball', category: 'ball', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
    { id: 21, name: '乒乓球', calories: 45, icon: 'table-tennis-paddle-ball', category: 'ball', bgColor: '#F3E8FF', iconColor: '#A855F7' },
  ],
  dance: [
    { id: 22, name: '广场舞', calories: 55, icon: 'music', category: 'dance', bgColor: '#FCE7F3', iconColor: '#EC4899' },
    { id: 23, name: '街舞', calories: 70, icon: 'music', category: 'dance', bgColor: '#FEE2E2', iconColor: '#EF4444' },
    { id: 24, name: '芭蕾', calories: 60, icon: 'music', category: 'dance', bgColor: '#F3E8FF', iconColor: '#A855F7' },
  ],
  mind: [
    { id: 25, name: '瑜伽', calories: 35, icon: 'spa', category: 'mind', bgColor: '#F3E8FF', iconColor: '#A855F7' },
    { id: 26, name: '太极', calories: 30, icon: 'yin-yang', category: 'mind', bgColor: '#E5E7EB', iconColor: '#6B7280' },
    { id: 27, name: '冥想', calories: 15, icon: 'brain', category: 'mind', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
  ],
  strength: [
    { id: 28, name: '深蹲', calories: 50, icon: 'weight-scale', category: 'strength', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
    { id: 29, name: '俯卧撑', calories: 45, icon: 'dumbbell', category: 'strength', bgColor: '#DCFCE7', iconColor: '#22C55E' },
    { id: 30, name: '仰卧起坐', calories: 40, icon: 'dumbbell', category: 'strength', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 31, name: '引体向上', calories: 55, icon: 'dumbbell', category: 'strength', bgColor: '#FEE2E2', iconColor: '#EF4444' },
  ],
  equipment: [
    { id: 32, name: '跑步机', calories: 70, icon: 'person-running', category: 'equipment', bgColor: '#DCFCE7', iconColor: '#22C55E' },
    { id: 33, name: '椭圆机', calories: 60, icon: 'dumbbell', category: 'equipment', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 34, name: '划船机', calories: 75, icon: 'dumbbell', category: 'equipment', bgColor: '#E0F2FE', iconColor: '#0EA5E9' },
    { id: 35, name: '哑铃训练', calories: 50, icon: 'dumbbell', category: 'equipment', bgColor: '#FEF3C7', iconColor: '#F59E0B' },
  ],
  custom: [],
};

// 已添加的运动类型
interface AddedExercise {
  id: number;
  name: string;
  duration: number;
  calories: number;
  icon: string;
  category: string;
  unitCalories: number;
  bgColor: string;
  iconColor: string;
}

export default function ExerciseLibraryScreen() {
  const router = useSafeRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { currentUser } = useUser();

  // 状态
  const [selectedCategory, setSelectedCategory] = useState('run');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedExercises, setAddedExercises] = useState<AddedExercise[]>([]);
  
  // 弹窗状态
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [addedPanelVisible, setAddedPanelVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  
  // 当前选中的运动
  const [selectedExercise, setSelectedExercise] = useState<{
    id: number;
    name: string;
    calories: number;
    icon: string;
    category: string;
    bgColor: string;
    iconColor: string;
  } | null>(null);
  
  // 时长输入
  const [duration, setDuration] = useState('10');
  
  // 自定义运动
  const [customExercise, setCustomExercise] = useState({
    name: '',
    calories: '60',
  });

  // 当前选中日期
  const [selectedDate] = useState(getTodayString());

  // 动画值
  const panelAnim = useMemo(() => new Animated.Value(0), []);

  // 获取当前分类的运动列表
  const currentExercises = useMemo(() => {
    if (selectedCategory === 'custom') {
      return [];
    }
    const exercises = EXERCISE_DATA[selectedCategory] || [];
    if (searchQuery.trim()) {
      return exercises.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return exercises;
  }, [selectedCategory, searchQuery]);

  // 计算总消耗
  const totalCalories = useMemo(() => {
    return addedExercises.reduce((sum, e) => sum + e.calories, 0);
  }, [addedExercises]);

  // 检查运动是否已添加
  const isExerciseAdded = useCallback((id: number) => {
    return addedExercises.some(e => e.id === id);
  }, [addedExercises]);

  // 打开时长输入弹窗
  const handleAddExercise = useCallback((exercise: typeof currentExercises[0]) => {
    if (isExerciseAdded(exercise.id)) {
      setAddedExercises(prev => prev.filter(e => e.id !== exercise.id));
      return;
    }
    setSelectedExercise(exercise);
    setDuration('10');
    setDurationModalVisible(true);
  }, [isExerciseAdded]);

  // 保存运动
  const handleSaveDuration = useCallback(() => {
    if (!selectedExercise) return;
    
    const durationNum = parseInt(duration, 10) || 10;
    const totalCal = Math.round((durationNum / 10) * selectedExercise.calories);
    
    const newAdded: AddedExercise = {
      id: selectedExercise.id,
      name: selectedExercise.name,
      duration: durationNum,
      calories: totalCal,
      icon: selectedExercise.icon,
      category: selectedExercise.category,
      unitCalories: selectedExercise.calories,
      bgColor: selectedExercise.bgColor,
      iconColor: selectedExercise.iconColor,
    };
    
    setAddedExercises(prev => [...prev, newAdded]);
    setDurationModalVisible(false);
    setSelectedExercise(null);
  }, [selectedExercise, duration]);

  // 删除已添加的运动
  const handleRemoveExercise = useCallback((id: number) => {
    setAddedExercises(prev => prev.filter(e => e.id !== id));
  }, []);

  // 展开已选运动面板
  const toggleAddedPanel = useCallback(() => {
    if (addedPanelVisible) {
      Animated.timing(panelAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => setAddedPanelVisible(false));
    } else {
      setAddedPanelVisible(true);
      Animated.timing(panelAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [addedPanelVisible, panelAnim]);

  // 完成提交
  const handleComplete = useCallback(async () => {
    if (addedExercises.length === 0) {
      Alert.alert('提示', '请先添加运动');
      return;
    }

    if (!currentUser) {
      Alert.alert('提示', '请先创建用户档案');
      return;
    }

    try {
      for (const exercise of addedExercises) {
        await createExerciseRecord({
          userId: currentUser.id,
          date: selectedDate,
          exerciseName: exercise.name,
          duration: exercise.duration,
          caloriesBurned: exercise.calories,
          metValue: exercise.unitCalories / 30,
        });
      }
      
      setAddedExercises([]);
      Alert.alert('成功', `已记录 ${addedExercises.length} 项运动`, [
        { text: '确定', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('保存运动记录失败:', error);
      Alert.alert('错误', '保存运动记录失败');
    }
  }, [addedExercises, currentUser, selectedDate, router]);

  // 添加自定义运动
  const handleAddCustomExercise = useCallback(() => {
    if (!customExercise.name.trim()) {
      Alert.alert('提示', '请输入运动名称');
      return;
    }

    const calories = parseInt(customExercise.calories, 10) || 60;
    const newId = Date.now();
    
    const newAdded: AddedExercise = {
      id: newId,
      name: customExercise.name.trim(),
      duration: 10,
      calories,
      icon: 'dumbbell',
      category: 'custom',
      unitCalories: calories,
      bgColor: '#F0FDF4',
      iconColor: '#22C55E',
    };
    
    setAddedExercises(prev => [...prev, newAdded]);
    setCustomExercise({ name: '', calories: '60' });
    setCustomModalVisible(false);
  }, [customExercise]);

  // 数字键盘
  const handleNumPress = useCallback((num: string) => {
    if (duration === '0' && num !== '0') {
      setDuration(num);
    } else if (duration.length < 3) {
      setDuration(prev => prev + num);
    }
  }, [duration]);

  const handleDelete = useCallback(() => {
    if (duration.length > 1) {
      setDuration(prev => prev.slice(0, -1));
    } else {
      setDuration('0');
    }
  }, [duration]);

  // 格式化日期显示
  const formatDateDisplay = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;
  }, []);

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={20} color="#212121" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>运动库</Text>
        </View>
        <TouchableOpacity style={styles.headerRight} onPress={() => setCustomModalVisible(true)}>
          <Text style={styles.headerRightText}>自定义添加</Text>
        </TouchableOpacity>
      </View>
      
      {/* 提示文字 */}
      <View style={styles.headerSubtitle}>
        <Text style={styles.headerSubtitleText}>图标均由 AI 生成，请勿从事违法活动</Text>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <FontAwesome6 name="magnifying-glass" size={18} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="请输入运动名称"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 主内容区 */}
      <View style={styles.mainContent}>
        {/* 左侧分类栏 */}
        <ScrollView style={styles.categorySidebar} showsVerticalScrollIndicator={false}>
          {EXERCISE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryItem,
                selectedCategory === cat.key && styles.categoryItemActive,
              ]}
              onPress={() => setSelectedCategory(cat.key)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIcon}>
                <FontAwesome6
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.key ? '#EF4444' : '#666666'}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.key && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 右侧运动列表 */}
        <ScrollView style={styles.exerciseListContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.exerciseList}>
            {currentExercises.length === 0 ? (
              <Text style={styles.noDataText}>
                {selectedCategory === 'custom' ? '点击右上角"自定义添加"创建运动' : '暂无运动数据'}
              </Text>
            ) : (
              currentExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => handleAddExercise(exercise)}
                  activeOpacity={0.8}
                >
                  {/* 图标 */}
                  <View style={[styles.exerciseIcon, { backgroundColor: exercise.bgColor }]}>
                    <FontAwesome6
                      name={exercise.icon}
                      size={22}
                      color={exercise.iconColor}
                    />
                  </View>
                  {/* 名称和热量 */}
                  <View style={styles.exerciseContent}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseCalories}>
                      {exercise.calories} kcal/10分钟
                    </Text>
                  </View>
                  {/* 添加按钮 */}
                  <View style={[styles.addButton, isExerciseAdded(exercise.id) && styles.addedButton]}>
                    <FontAwesome6
                      name={isExerciseAdded(exercise.id) ? 'check' : 'plus'}
                      size={18}
                      color={isExerciseAdded(exercise.id) ? '#FFFFFF' : '#666666'}
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* 底部栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomLeft} onPress={toggleAddedPanel} activeOpacity={0.8}>
          {/* 卡通IP形象 */}
          <View style={styles.mascotContainer}>
            <View style={[styles.mascotCircle, addedExercises.length > 0 && styles.mascotActive]}>
              <FontAwesome6 name="dumbbell" size={24} color={addedExercises.length > 0 ? '#22C55E' : '#9CA3AF'} />
            </View>
            {addedExercises.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{addedExercises.length}</Text>
              </View>
            )}
          </View>
          {/* 运动消耗信息 */}
          <View style={styles.statsContainer}>
            <View style={styles.statsLabelRow}>
              <Text style={styles.statsLabel}>运动消耗</Text>
              <View style={styles.expandIcon}>
                <FontAwesome6
                  name={addedPanelVisible ? 'chevron-down' : 'chevron-up'}
                  size={12}
                  color="#999999"
                />
              </View>
            </View>
            <Text style={styles.statsCalories}>{formatNumber(totalCalories)} kcal</Text>
          </View>
        </TouchableOpacity>
        
        {/* 完成按钮 */}
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
          <Text style={styles.completeButtonText}>完成</Text>
        </TouchableOpacity>
      </View>

      {/* 时长输入弹窗 */}
      <Modal
        visible={durationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDurationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.durationModal}>
            {/* 弹窗头部 */}
            <View style={styles.durationModalHeader}>
              <TouchableOpacity style={styles.dateSelector}>
                <FontAwesome6 name="calendar" size={14} color="#666666" />
                <Text style={styles.dateText}>{formatDateDisplay(selectedDate)}</Text>
                <FontAwesome6 name="chevron-down" size={12} color="#999999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setDurationModalVisible(false)}>
                <FontAwesome6 name="xmark" size={18} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* 运动信息 */}
            {selectedExercise && (
              <View style={styles.exerciseInfoRow}>
                <View style={[styles.exerciseInfoIcon, { backgroundColor: selectedExercise.bgColor }]}>
                  <FontAwesome6 name={selectedExercise.icon} size={32} color={selectedExercise.iconColor} />
                </View>
                <View style={styles.exerciseInfoContent}>
                  <Text style={styles.exerciseInfoName}>{selectedExercise.name}</Text>
                  <Text style={styles.exerciseInfoCalories}>
                    {selectedExercise.calories} kcal/10分钟
                  </Text>
                </View>
              </View>
            )}

            {/* 时长显示 */}
            <View style={styles.durationDisplay}>
              <Text style={styles.durationNumber}>{duration}</Text>
              <Text style={styles.durationUnit}>分钟</Text>
            </View>

            {/* 总消耗 */}
            <View style={styles.totalCaloriesRow}>
              <FontAwesome6 name="fire" size={20} color="#FF9800" />
              <Text style={styles.totalCaloriesText}>
                {formatNumber(Math.round((parseInt(duration, 10) || 0) / 10 * (selectedExercise?.calories || 0)))} kcal
              </Text>
            </View>

            {/* 数字键盘 */}
            <View style={styles.numpad}>
              {[
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
              ].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.numpadRow}>
                  {row.map((num) => (
                    <TouchableOpacity key={num} style={styles.numpadKey} onPress={() => handleNumPress(num)} activeOpacity={0.7}>
                      <Text style={styles.numpadKeyText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              <View style={styles.numpadRow}>
                <TouchableOpacity style={styles.numpadDelete} onPress={handleDelete} activeOpacity={0.7}>
                  <FontAwesome6 name="delete-left" size={22} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.numpadKey} onPress={() => handleNumPress('0')} activeOpacity={0.7}>
                  <Text style={styles.numpadKeyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveDuration} activeOpacity={0.8}>
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 已选运动面板 */}
      <Modal
        visible={addedPanelVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleAddedPanel}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleAddedPanel}
        >
          <Animated.View 
            style={[
              styles.addedPanel,
              {
                transform: [{
                  translateY: panelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.addedPanelHeader}>
              <Text style={styles.addedPanelTitle}>已选运动 ({addedExercises.length})</Text>
              <TouchableOpacity onPress={toggleAddedPanel}>
                <Text style={styles.addedPanelClose}>收起</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.addedPanelList} showsVerticalScrollIndicator={false}>
              {addedExercises.map((exercise) => (
                <View key={exercise.id} style={styles.addedExerciseItem}>
                  <View style={[styles.addedExerciseIcon, { backgroundColor: exercise.bgColor }]}>
                    <FontAwesome6 name={exercise.icon} size={24} color={exercise.iconColor} />
                  </View>
                  <View style={styles.addedExerciseContent}>
                    <Text style={styles.addedExerciseName}>{exercise.name}</Text>
                    <Text style={styles.addedExerciseDetail}>
                      {exercise.duration}分钟 · {exercise.calories}kcal
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveExercise(exercise.id)}>
                    <FontAwesome6 name="trash" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
              {addedExercises.length === 0 && (
                <Text style={styles.noDataText}>暂无已选运动</Text>
              )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* 自定义运动弹窗 */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={styles.customModalOverlay}>
          <View style={styles.customModalContent}>
            <Text style={styles.customModalTitle}>添加自定义运动</Text>
            <TextInput
              style={styles.customInput}
              placeholder="运动名称"
              placeholderTextColor="#999999"
              value={customExercise.name}
              onChangeText={(text) => setCustomExercise(prev => ({ ...prev, name: text }))}
            />
            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customInputHalf}
                placeholder="每10分钟消耗(kcal)"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                value={customExercise.calories}
                onChangeText={(text) => setCustomExercise(prev => ({ ...prev, calories: text }))}
              />
            </View>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleAddCustomExercise}
            >
              <Text style={styles.completeButtonText}>添加</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customCancelButton} onPress={() => setCustomModalVisible(false)}>
              <Text style={styles.customCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
