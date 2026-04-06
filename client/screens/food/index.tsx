import React, { useMemo, useState, useCallback, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text,
  TextInput,
  Modal,
  SectionList,
  ScrollView,
  SectionListData,
  Pressable,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SwipeableTabScreen } from '@/components/SwipeableTabScreen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import { useFoodRecords } from '@/contexts/FoodRecordContext';
import { getBackendBaseUrl } from '@/utils/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FoodItem {
  id: number;
  name: string;
  nameEn?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodSection {
  title: string;
  categoryKey: string;
  data: FoodItem[];
}

// 分类顺序：主食、肉蛋、蔬菜、海鲜、水果、饮品、乳制品、坚果、零食
const CATEGORIES = [
  { key: 'staple', label: '主食', icon: 'bread-slice' },
  { key: 'meat', label: '肉蛋', icon: 'drumstick-bite' },
  { key: 'vegetable', label: '蔬菜', icon: 'carrot' },
  { key: 'seafood', label: '海鲜', icon: 'shrimp' },
  { key: 'fruit', label: '水果', icon: 'apple-whole' },
  { key: 'drink', label: '饮品', icon: 'mug-hot' },
  { key: 'dairy', label: '乳制品', icon: 'cheese' },
  { key: 'nuts', label: '坚果', icon: 'seedling' },
  { key: 'snack', label: '零食', icon: 'cookie' },
];

// 预设食物数据
const PRESET_FOODS: FoodItem[] = [
  // 主食
  { id: 1, name: '米饭', category: 'staple', calories: 116, protein: 2.6, carbs: 25.6, fat: 0.3 },
  { id: 2, name: '全麦面包', category: 'staple', calories: 80, protein: 4, carbs: 15, fat: 1 },
  { id: 3, name: '燕麦', category: 'staple', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { id: 4, name: '面条', category: 'staple', calories: 137, protein: 4.5, carbs: 25, fat: 2 },
  { id: 5, name: '玉米', category: 'staple', calories: 106, protein: 4, carbs: 19.8, fat: 0.9 },
  { id: 6, name: '红薯', category: 'staple', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { id: 7, name: '紫薯', category: 'staple', calories: 82, protein: 1.5, carbs: 18, fat: 0.2 },
  { id: 8, name: '糙米饭', category: 'staple', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9 },
  { id: 9, name: '小米粥', category: 'staple', calories: 46, protein: 1.4, carbs: 9.7, fat: 0.3 },
  { id: 10, name: '馒头', category: 'staple', calories: 221, protein: 7, carbs: 45, fat: 1.1 },
  // 肉蛋
  { id: 11, name: '鸡胸肉', category: 'meat', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 12, name: '鸡蛋', category: 'meat', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { id: 14, name: '牛肉', category: 'meat', calories: 250, protein: 26, carbs: 0, fat: 15 },
  { id: 15, name: '去皮鸡腿', category: 'meat', calories: 119, protein: 16, carbs: 0, fat: 2 },
  { id: 16, name: '猪肉', category: 'meat', calories: 143, protein: 20, carbs: 0, fat: 6 },
  { id: 17, name: '鸭肉', category: 'meat', calories: 185, protein: 18, carbs: 0, fat: 11 },
  { id: 18, name: '鹌鹑蛋', category: 'meat', calories: 160, protein: 12.8, carbs: 2.1, fat: 11.1 },
  // 蔬菜
  { id: 19, name: '西兰花', category: 'vegetable', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: 20, name: '胡萝卜', category: 'vegetable', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { id: 21, name: '番茄', category: 'vegetable', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: 22, name: '黄瓜', category: 'vegetable', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
  { id: 23, name: '菠菜', category: 'vegetable', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: 24, name: '白菜', category: 'vegetable', calories: 13, protein: 1.2, carbs: 2.4, fat: 0.2 },
  { id: 25, name: '生菜', category: 'vegetable', calories: 15, protein: 1.4, carbs: 2.3, fat: 0.2 },
  { id: 26, name: '芹菜', category: 'vegetable', calories: 14, protein: 0.7, carbs: 3, fat: 0.2 },
  { id: 27, name: '冬瓜', category: 'vegetable', calories: 11, protein: 0.4, carbs: 2.6, fat: 0.1 },
  { id: 28, name: '茄子', category: 'vegetable', calories: 25, protein: 1, carbs: 6, fat: 0.2 },
  // 海鲜
  { id: 13, name: '三文鱼', category: 'seafood', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 49, name: '虾', category: 'seafood', calories: 85, protein: 18, carbs: 0.2, fat: 0.5 },
  { id: 50, name: '鳕鱼', category: 'seafood', calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  { id: 51, name: '金枪鱼', category: 'seafood', calories: 130, protein: 29, carbs: 0, fat: 0.6 },
  { id: 52, name: '扇贝', category: 'seafood', calories: 70, protein: 15, carbs: 3, fat: 0.5 },
  { id: 53, name: '螃蟹', category: 'seafood', calories: 97, protein: 19, carbs: 0.5, fat: 1.5 },
  // 水果
  { id: 29, name: '苹果', category: 'fruit', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { id: 30, name: '香蕉', category: 'fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: 31, name: '橙子', category: 'fruit', calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  { id: 32, name: '葡萄', category: 'fruit', calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },
  { id: 33, name: '草莓', category: 'fruit', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { id: 34, name: '猕猴桃', category: 'fruit', calories: 61, protein: 1.1, carbs: 14, fat: 0.5 },
  { id: 35, name: '西瓜', category: 'fruit', calories: 31, protein: 0.6, carbs: 8, fat: 0.1 },
  { id: 36, name: '蓝莓', category: 'fruit', calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { id: 37, name: '柚子', category: 'fruit', calories: 38, protein: 0.8, carbs: 9.5, fat: 0.1 },
  { id: 38, name: '火龙果', category: 'fruit', calories: 51, protein: 1.1, carbs: 13, fat: 0.2 },
  // 饮品
  { id: 58, name: '绿茶', category: 'drink', calories: 2, protein: 0, carbs: 0.5, fat: 0 },
  { id: 59, name: '黑咖啡', category: 'drink', calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  { id: 60, name: '鲜榨橙汁', category: 'drink', calories: 45, protein: 0.7, carbs: 10, fat: 0.2 },
  { id: 61, name: '柠檬水', category: 'drink', calories: 6, protein: 0.1, carbs: 1.6, fat: 0 },
  { id: 62, name: '椰子水', category: 'drink', calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2 },
  // 乳制品
  { id: 39, name: '牛奶', category: 'dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { id: 40, name: '酸奶', category: 'dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.7 },
  { id: 41, name: '奶酪', category: 'dairy', calories: 402, protein: 25, carbs: 1.3, fat: 33 },
  { id: 42, name: '脱脂牛奶', category: 'dairy', calories: 35, protein: 3.4, carbs: 5, fat: 0.1 },
  { id: 43, name: '豆浆', category: 'dairy', calories: 33, protein: 2.9, carbs: 2.2, fat: 1.6 },
  // 坚果
  { id: 44, name: '杏仁', category: 'nuts', calories: 579, protein: 21, carbs: 22, fat: 50 },
  { id: 45, name: '核桃', category: 'nuts', calories: 654, protein: 15, carbs: 14, fat: 65 },
  { id: 46, name: '花生', category: 'nuts', calories: 567, protein: 26, carbs: 16, fat: 49 },
  { id: 47, name: '腰果', category: 'nuts', calories: 553, protein: 18, carbs: 30, fat: 44 },
  { id: 48, name: '开心果', category: 'nuts', calories: 562, protein: 20, carbs: 28, fat: 46 },
  // 零食
  { id: 54, name: '黑巧克力', category: 'snack', calories: 556, protein: 5, carbs: 60, fat: 31 },
  { id: 55, name: '燕麦饼干', category: 'snack', calories: 450, protein: 7, carbs: 68, fat: 17 },
  { id: 56, name: '坚果棒', category: 'snack', calories: 500, protein: 12, carbs: 45, fat: 30 },
  { id: 57, name: '果干', category: 'snack', calories: 300, protein: 2, carbs: 65, fat: 0.5 },
];

const CATEGORY_ICONS: { [key: string]: { emoji: string; icon: string } } = {
  staple: { emoji: '🍚', icon: 'bread-slice' },
  meat: { emoji: '🍖', icon: 'drumstick-bite' },
  vegetable: { emoji: '🥦', icon: 'carrot' },
  fruit: { emoji: '🍎', icon: 'apple-whole' },
  dairy: { emoji: '🥛', icon: 'cheese' },
  nuts: { emoji: '🥜', icon: 'seedling' },
  snack: { emoji: '🍪', icon: 'cookie' },
  drink: { emoji: '☕', icon: 'mug-hot' },
  seafood: { emoji: '🦐', icon: 'shrimp' },
  other: { emoji: '🍽️', icon: 'utensils' },
};

export default function FoodScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { addRecord } = useFoodRecords();
  const sectionListRef = useRef<SectionList>(null);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('staple');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [weight, setWeight] = useState(100);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [presetFoods, setPresetFoods] = useState<FoodItem[]>(PRESET_FOODS);

  // 自定义食物相关状态
  const [customFoodModalVisible, setCustomFoodModalVisible] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customCategory, setCustomCategory] = useState('staple');

  // 长按菜单相关状态
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuFood, setContextMenuFood] = useState<FoodItem | null>(null);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [highlightedFoodId, setHighlightedFoodId] = useState<number | null>(null);

  const fetchPresetFoods = async () => {
    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/foods/presets`);
      const data = await res.json();
      if (data && data.length > 0) {
        const foods = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category || 'other',
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        }));
        setPresetFoods([...PRESET_FOODS, ...foods]);
      }
    } catch (error) {
      console.error('Failed to fetch preset foods:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPresetFoods();
    }, [])
  );

  // 按分类分组食物，按 CATEGORIES 顺序排列
  const foodSections = useMemo(() => {
    const sections: FoodSection[] = [];
    
    // 搜索过滤
    const filteredFoods = searchText 
      ? presetFoods.filter(food => food.name.toLowerCase().includes(searchText.toLowerCase()))
      : presetFoods;

    // 按 CATEGORIES 顺序创建分组
    CATEGORIES.forEach(cat => {
      const categoryFoods = filteredFoods.filter(food => food.category === cat.key);
      if (categoryFoods.length > 0) {
        sections.push({
          title: cat.label,
          categoryKey: cat.key,
          data: categoryFoods,
        });
      }
    });

    return sections;
  }, [presetFoods, searchText]);

  // 点击分类跳转到对应区域
  const handleCategoryPress = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    
    // 找到对应分类的 section 索引
    const sectionIndex = foodSections.findIndex(section => section.categoryKey === categoryKey);
    
    if (sectionIndex !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  const handleAddFood = (food: FoodItem) => {
    setSelectedFood(food);
    setWeight(100);
    setAddModalVisible(true);
  };

  const handleConfirmAdd = async () => {
    if (!selectedFood) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const ratio = weight / 100;

      await addRecord({
        date: today,
        meal_type: selectedMealType,
        food_name: selectedFood.name,
        weight: weight,
        calories: Math.round(selectedFood.calories * ratio),
        protein: Math.round(selectedFood.protein * ratio * 10) / 10,
        carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
        fat: Math.round(selectedFood.fat * ratio * 10) / 10,
      });

      setAddModalVisible(false);
      setSelectedFood(null);
    } catch (error) {
      console.error('Failed to add food record:', error);
    }
  };

  const handleAddCustomFood = async () => {
    if (!customFoodName.trim()) return;

    try {
      const baseUrl = getBackendBaseUrl();
      
      // 如果是编辑模式
      if (editingFood) {
        // 检查是否是后端保存的食物（id 是数字且大于 PRESET_FOODS 的最大 id）
        const isBackendFood = editingFood.id > 100; // PRESET_FOODS 的 id 都小于 100
        
        if (isBackendFood) {
          // 更新后端数据
          const res = await fetch(`${baseUrl}/api/v1/foods/presets/${editingFood.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: customFoodName.trim(),
              category: customCategory,
              calories: parseFloat(customCalories) || 0,
              protein: parseFloat(customProtein) || 0,
              carbs: parseFloat(customCarbs) || 0,
              fat: parseFloat(customFat) || 0,
            }),
          });
          
          if (!res.ok) throw new Error('更新失败');
          
          // 刷新预设食物列表
          await fetchPresetFoods();
        } else {
          // 本地预设食物，只更新本地状态
          const updatedFoods = presetFoods.map(food => 
            food.id === editingFood.id 
              ? {
                  ...food,
                  name: customFoodName.trim(),
                  category: customCategory,
                  calories: parseFloat(customCalories) || 0,
                  protein: parseFloat(customProtein) || 0,
                  carbs: parseFloat(customCarbs) || 0,
                  fat: parseFloat(customFat) || 0,
                }
              : food
          );
          setPresetFoods(updatedFoods);
        }
        setEditingFood(null);
      } else {
        // 新增模式 - 保存到后端
        const res = await fetch(`${baseUrl}/api/v1/foods/presets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customFoodName.trim(),
            category: customCategory,
            calories: parseFloat(customCalories) || 0,
            protein: parseFloat(customProtein) || 0,
            carbs: parseFloat(customCarbs) || 0,
            fat: parseFloat(customFat) || 0,
          }),
        });
        
        if (!res.ok) throw new Error('保存失败');
        
        // 刷新预设食物列表
        await fetchPresetFoods();
      }
      
      setCustomFoodName('');
      setCustomCalories('');
      setCustomProtein('');
      setCustomCarbs('');
      setCustomFat('');
      setCustomCategory('staple');
      setCustomFoodModalVisible(false);
    } catch (error) {
      console.error('Failed to save custom food:', error);
      alert('保存失败，请重试');
    }
  };

  // 长按显示菜单
  const handleLongPress = async (food: FoodItem, event: any) => {
    // 触发震动反馈
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const { pageX, pageY, locationX, locationY } = event.nativeEvent;
    
    // 计算卡片中心位置（菜单在卡片上方居中）
    const cardCenterX = pageX - locationX + (SCREEN_WIDTH - 32) / 2; // 32是左右padding之和
    const menuWidth = 160;
    const x = Math.max(16, Math.min(cardCenterX - menuWidth / 2, SCREEN_WIDTH - menuWidth - 16));
    const y = Math.max(60, pageY - locationY - 60); // 菜单在卡片上方
    
    setContextMenuPosition({ x, y });
    setContextMenuFood(food);
    setHighlightedFoodId(food.id);
    setContextMenuVisible(true);
  };

  // 关闭菜单
  const closeContextMenu = () => {
    setContextMenuVisible(false);
    setContextMenuFood(null);
    setHighlightedFoodId(null);
  };

  // 编辑食物
  const handleEditFood = () => {
    if (!contextMenuFood) return;
    
    setEditingFood(contextMenuFood);
    setCustomFoodName(contextMenuFood.name);
    setCustomCalories(contextMenuFood.calories.toString());
    setCustomProtein(contextMenuFood.protein.toString());
    setCustomCarbs(contextMenuFood.carbs.toString());
    setCustomFat(contextMenuFood.fat.toString());
    setCustomCategory(contextMenuFood.category);
    
    closeContextMenu();
    setCustomFoodModalVisible(true);
  };

  // 删除食物
  const handleDeleteFood = async () => {
    if (!contextMenuFood) return;
    
    try {
      // 检查是否是后端保存的食物（id 是数字且大于 PRESET_FOODS 的最大 id）
      const isBackendFood = contextMenuFood.id > 100; // PRESET_FOODS 的 id 都小于 100
      
      if (isBackendFood) {
        const baseUrl = getBackendBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/foods/presets/${contextMenuFood.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('删除失败');
        
        // 刷新预设食物列表
        await fetchPresetFoods();
      } else {
        // 本地预设食物，只更新本地状态
        const updatedFoods = presetFoods.filter(food => food.id !== contextMenuFood.id);
        setPresetFoods(updatedFoods);
      }
      
      closeContextMenu();
    } catch (error) {
      console.error('Failed to delete food:', error);
      alert('删除失败，请重试');
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    const isHighlighted = highlightedFoodId === item.id;
    const isDimmed = contextMenuVisible && !isHighlighted;
    
    return (
      <TouchableOpacity 
        style={[
          styles.foodCard,
          isHighlighted && styles.foodCardHighlighted,
          isDimmed && styles.foodCardDimmed,
        ]}
        onPress={() => handleAddFood(item)}
        onLongPress={(e) => handleLongPress(item, e)}
        delayLongPress={300}
        activeOpacity={0.8}
      >
        <View style={styles.foodIcon}>
          <Text style={{ fontSize: 24 }}>{CATEGORY_ICONS[item.category]?.emoji || '🍽️'}</Text>
        </View>
        <View style={styles.foodInfo}>
          <Text style={[styles.foodName, { color: theme.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.foodCalories, { color: theme.textMuted }]}>{item.calories} kcal / 100g</Text>
          <View style={styles.foodNutrients}>
            <View style={[styles.nutrientBadge, { backgroundColor: theme.backgroundTertiary }]}>
              <Text style={[styles.nutrientText, { color: theme.textSecondary }]}>碳水 {item.carbs}g</Text>
            </View>
            <View style={[styles.nutrientBadge, { backgroundColor: theme.backgroundTertiary }]}>
              <Text style={[styles.nutrientText, { color: theme.textSecondary }]}>蛋白质 {item.protein}g</Text>
            </View>
            <View style={[styles.nutrientBadge, { backgroundColor: theme.backgroundTertiary }]}>
              <Text style={[styles.nutrientText, { color: theme.textSecondary }]}>脂肪 {item.fat}g</Text>
            </View>
          </View>
        </View>
        <View style={styles.addButton}>
          <FontAwesome6 name="plus" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: SectionListData<FoodItem, FoodSection> }) => (
    <View style={[styles.sectionHeader, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.sectionIconBg, { backgroundColor: theme.backgroundTertiary }]}>
        <FontAwesome6 
          name={CATEGORY_ICONS[(section as FoodSection).categoryKey]?.icon || 'utensils'} 
          size={16} 
          color={theme.primary} 
        />
      </View>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{section.title}</Text>
      <Text style={[styles.sectionCount, { color: theme.textMuted }]}>{section.data.length}种</Text>
    </View>
  );

  return (
    <SwipeableTabScreen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* 搜索栏 + 自定义按钮 */}
          <View style={styles.searchRow}>
            <View style={[styles.searchBox, { backgroundColor: theme.backgroundTertiary }]}>
              <FontAwesome6 name="magnifying-glass" size={18} color={theme.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: theme.textPrimary }]}
                placeholder="搜索食物..."
                placeholderTextColor={theme.textMuted}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity 
              style={styles.customFoodBtn}
              onPress={() => setCustomFoodModalVisible(true)}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.customFoodBtnText}>自定义</Text>
            </TouchableOpacity>
          </View>

          {/* 分类标签 - 网格布局（每行4个） */}
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryGridItem,
                  { backgroundColor: theme.backgroundDefault, borderColor: 'transparent' },
                  selectedCategory === cat.key && styles.categoryGridItemActive,
                ]}
                onPress={() => handleCategoryPress(cat.key)}
                activeOpacity={0.7}
              >
                <FontAwesome6 
                  name={cat.icon} 
                  size={16} 
                  color={selectedCategory === cat.key ? '#FFFFFF' : theme.textPrimary} 
                />
                <Text style={[
                  styles.categoryGridText,
                  { color: selectedCategory === cat.key ? '#FFFFFF' : theme.textPrimary }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 食物分组列表 */}
          <SectionList
            ref={sectionListRef}
            sections={foodSections as any}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={renderFoodItem}
            renderSectionHeader={renderSectionHeader as any}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.foodList}
            stickySectionHeadersEnabled={false}
          />
        </View>

        {/* 长按弹出菜单 */}
        <Modal
          visible={contextMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={closeContextMenu}
        >
          <Pressable style={styles.contextMenuOverlay} onPress={closeContextMenu}>
            {/* 模糊背景层 */}
            <View style={styles.blurBackground} />
            
            {/* 菜单在卡片上方居中 */}
            <View style={{ position: 'absolute', left: contextMenuPosition.x, top: contextMenuPosition.y }}>
              {/* 菜单主体 */}
              <View style={styles.contextMenu}>
                <TouchableOpacity 
                  style={styles.contextMenuItem}
                  onPress={handleEditFood}
                  activeOpacity={0.6}
                >
                  <Text style={styles.contextMenuEditText}>编辑</Text>
                </TouchableOpacity>
                <View style={styles.contextMenuDivider} />
                <TouchableOpacity 
                  style={styles.contextMenuItem}
                  onPress={handleDeleteFood}
                  activeOpacity={0.6}
                >
                  <Text style={styles.contextMenuDeleteText}>删除</Text>
                </TouchableOpacity>
              </View>
              {/* 底部小三角 */}
              <View style={styles.contextMenuTriangle} />
            </View>
          </Pressable>
        </Modal>

        {/* 添加弹窗 */}
        <Modal
          visible={addModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.addModal, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.addModalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  添加到今日饮食
                </Text>
                <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                  <FontAwesome6 name="xmark" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              {selectedFood && (
                <>
                  <Text style={[styles.selectedFoodName, { color: theme.textPrimary }]}>
                    {selectedFood.name}
                  </Text>

                  {/* 重量选择器 */}
                  <View style={styles.weightSelector}>
                    <TouchableOpacity 
                      style={[styles.weightBtn, { backgroundColor: theme.backgroundTertiary }]}
                      onPress={() => setWeight(Math.max(10, weight - 10))}
                    >
                      <FontAwesome6 name="minus" size={16} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.weightDisplay}>
                      <Text style={[styles.weightValue, { color: theme.primary }]}>{weight}</Text>
                      <Text style={[styles.weightUnit, { color: theme.textMuted }]}>克</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.weightBtn, { backgroundColor: theme.backgroundTertiary }]}
                      onPress={() => setWeight(weight + 10)}
                    >
                      <FontAwesome6 name="plus" size={16} color={theme.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  {/* 餐次选择 */}
                  <View style={styles.mealTypeSelector}>
                    {[
                      { key: 'breakfast', label: '早餐' },
                      { key: 'lunch', label: '午餐' },
                      { key: 'dinner', label: '晚餐' },
                      { key: 'snack', label: '加餐' },
                    ].map((meal) => (
                      <TouchableOpacity
                        key={meal.key}
                        style={[
                          styles.mealTypeBtn,
                          { borderColor: theme.border },
                          selectedMealType === meal.key && styles.mealTypeBtnActive,
                        ]}
                        onPress={() => setSelectedMealType(meal.key)}
                      >
                        <Text style={[
                          styles.mealTypeText,
                          { color: selectedMealType === meal.key ? '#FFFFFF' : theme.textPrimary }
                        ]}>
                          {meal.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 营养信息 */}
                  <View style={styles.nutritionInfo}>
                    <Text style={[styles.totalCalories, { color: theme.primary }]}>
                      {Math.round(selectedFood.calories * weight / 100)} kcal
                    </Text>
                    <View style={styles.nutritionDetails}>
                      <Text style={[styles.nutritionDetail, { color: theme.textMuted }]}>
                        碳水 {(selectedFood.carbs * weight / 100).toFixed(1)}g
                      </Text>
                      <Text style={[styles.nutritionDetail, { color: theme.textMuted }]}>
                        蛋白质 {(selectedFood.protein * weight / 100).toFixed(1)}g
                      </Text>
                      <Text style={[styles.nutritionDetail, { color: theme.textMuted }]}>
                        脂肪 {(selectedFood.fat * weight / 100).toFixed(1)}g
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmAdd}>
                    <Text style={styles.confirmBtnText}>确认添加</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* 自定义食物弹窗 */}
        <Modal
          visible={customFoodModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setCustomFoodModalVisible(false);
            setEditingFood(null);
            setCustomFoodName('');
            setCustomCalories('');
            setCustomProtein('');
            setCustomCarbs('');
            setCustomFat('');
            setCustomCategory('staple');
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.customFoodModal, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {editingFood ? '编辑食物' : '添加自定义食物'}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => {
                    setCustomFoodModalVisible(false);
                    setEditingFood(null);
                  }}
                >
                  <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textMuted }]}>食物名称 *</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                  placeholder="例如：自制沙拉"
                  placeholderTextColor={theme.textMuted}
                  value={customFoodName}
                  onChangeText={setCustomFoodName}
                />
              </View>

              {/* 分类选择器 */}
              <View style={styles.categorySelector}>
                <Text style={[styles.categorySelectorLabel, { color: theme.textMuted }]}>选择分类</Text>
                <View style={styles.categorySelectorGrid}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.categoryChip,
                        { backgroundColor: theme.backgroundTertiary, borderColor: 'transparent' },
                        customCategory === cat.key && styles.categoryChipActive,
                      ]}
                      onPress={() => setCustomCategory(cat.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 16, marginRight: 4 }}>
                        {CATEGORY_ICONS[cat.key]?.emoji}
                      </Text>
                      <Text style={[
                        styles.categoryChipText,
                        { color: theme.textPrimary },
                        customCategory === cat.key && styles.categoryChipTextActive,
                      ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textMuted }]}>热量 (kcal/100g)</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={customCalories}
                  onChangeText={setCustomCalories}
                />
              </View>

              <View style={styles.nutrientInputs}>
                <View style={styles.nutrientInputItem}>
                  <Text style={[styles.inputLabel, { color: theme.textMuted }]}>蛋白质(g)</Text>
                  <TextInput
                    style={[styles.nutrientInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={customProtein}
                    onChangeText={setCustomProtein}
                  />
                </View>
                <View style={styles.nutrientInputItem}>
                  <Text style={[styles.inputLabel, { color: theme.textMuted }]}>碳水(g)</Text>
                  <TextInput
                    style={[styles.nutrientInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={customCarbs}
                    onChangeText={setCustomCarbs}
                  />
                </View>
                <View style={styles.nutrientInputItem}>
                  <Text style={[styles.inputLabel, { color: theme.textMuted }]}>脂肪(g)</Text>
                  <TextInput
                    style={[styles.nutrientInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={customFat}
                    onChangeText={setCustomFat}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.confirmBtn, { opacity: customFoodName.trim() ? 1 : 0.5 }]} 
                onPress={handleAddCustomFood}
                disabled={!customFoodName.trim()}
              >
                <Text style={styles.confirmBtnText}>
                  {editingFood ? '保存修改' : '保存食物'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SwipeableTabScreen>
  );
}
