import React, { useMemo, useState, useCallback } from 'react';
import { 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Text,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SwipeableTabScreen } from '@/components/SwipeableTabScreen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { useFoodRecords } from '@/contexts/FoodRecordContext';

// 启用 Android LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];
const MASCOTS = ['🥦', '🥬', '🥕', '🌽', '🍅'];

export default function StatsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { allRecords, refreshAllRecords, deleteRecord } = useFoodRecords();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const recordsWithDates = useMemo(() => {
    return new Set(Object.keys(allRecords));
  }, [allRecords]);

  const getSelectedRecords = useCallback(() => {
    const key = selectedDate.toISOString().split('T')[0];
    return allRecords[key] || [];
  }, [allRecords, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      refreshAllRecords();
    }, [])
  );

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startWeekDay = firstDay.getDay();
    const offsetDays = (startWeekDay + 6) % 7;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    for (let i = offsetDays - 1; i >= 0; i--) {
      const d = new Date(year, month, 1 - i - 1);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const days: Date[] = [];
    const dayOfWeek = date.getDay();
    const offset = (dayOfWeek + 6) % 7;
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - offset);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasRecord = (date: Date) => {
    return recordsWithDates.has(formatDateKey(date));
  };

  const getMascot = (date: Date) => {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    return MASCOTS[dayOfYear % MASCOTS.length];
  };

  const getWeekDayName = (date: Date) => {
    const day = date.getDay();
    const index = (day + 6) % 7;
    return WEEK_DAYS[index];
  };

  const getMealTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '加餐',
    };
    return labels[type] || '其他';
  };

  // 删除记录处理
  const handleDeleteRecord = async (recordId: number) => {
    try {
      await deleteRecord(recordId);
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const selectedRecords = getSelectedRecords();

  const renderMonthGrid = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <View style={styles.monthGrid}>
        <View style={styles.weekDaysRow}>
          {WEEK_DAYS.map((day) => (
            <View key={day} style={styles.weekDayHeader}>
              <Text style={[styles.weekDayText, { color: theme.textMuted }]}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((item, index) => {
            const today = isToday(item.date);
            const selected = isSelected(item.date);
            const hasRec = hasRecord(item.date);

            return (
              <TouchableOpacity 
                key={`day-${index}`} 
                style={styles.dayCell}
                onPress={() => setSelectedDate(item.date)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.dayCircle,
                  today && styles.todayCircle,
                  selected && !today && styles.selectedCircle,
                  hasRec && !today && !selected && styles.hasRecordCircle,
                ]}>
                  <Text style={[
                    styles.dayNumber,
                    { color: today ? '#FFFFFF' : item.isCurrentMonth ? theme.textPrimary : theme.textMuted }
                  ]}>
                    {item.date.getDate()}
                  </Text>
                </View>
                {hasRec && (
                  <Text style={styles.mascotDot}>{getMascot(item.date)}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.expandLineInCard}
          onPress={toggleExpand}
          activeOpacity={0.7}
        >
          <View style={[styles.lineHandle, { backgroundColor: theme.textMuted }]} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekRow = () => {
    const days = getWeekDays(selectedDate);

    return (
      <View style={styles.weekRow}>
        <View style={styles.weekDaysContainer}>
          {days.map((date, index) => {
            const today = isToday(date);
            const selected = isSelected(date);
            const hasRec = hasRecord(date);

            return (
              <TouchableOpacity 
                key={`week-${index}`} 
                style={styles.weekDayCard}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.7}
              >
                <Text style={[styles.weekDayLabel, { color: theme.textMuted }]}>
                  {getWeekDayName(date)}
                </Text>
                <View 
                  style={[
                    styles.dayCircle,
                    today && styles.todayCircle,
                    selected && !today && styles.selectedCircle,
                  ]}
                >
                  <Text style={[
                    styles.dayNumber,
                    { color: today ? '#FFFFFF' : theme.textPrimary }
                  ]}>
                    {date.getDate()}
                  </Text>
                </View>
                {hasRec && (
                  <Text style={styles.mascotDot}>{getMascot(date)}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.expandLineInCard}
          onPress={toggleExpand}
          activeOpacity={0.7}
        >
          <View style={[styles.lineHandle, { backgroundColor: theme.textMuted }]} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SwipeableTabScreen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.monthSelectorRow}>
            <TouchableOpacity 
              style={styles.arrowBtn}
              onPress={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
            >
              <FontAwesome6 name="chevron-left" size={14} color={theme.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.monthTitleBtn}
              onPress={toggleExpand}
              activeOpacity={0.7}
            >
              <Text style={[styles.monthTitle, { color: theme.textPrimary }]}>
                {currentDate.getFullYear()}年{String(currentDate.getMonth() + 1).padStart(2, '0')}月
              </Text>
              <FontAwesome6 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={12} 
                color={theme.primary} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.arrowBtn}
              onPress={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
            >
              <FontAwesome6 name="chevron-right" size={14} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.calendarSection}>
            {isExpanded ? renderMonthGrid() : renderWeekRow()}
          </View>

          <View style={styles.recordsSection}>
            <View style={styles.dateHeader}>
              <Text style={[styles.selectedDateText, { color: theme.textPrimary }]}>
                {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 周{getWeekDayName(selectedDate)}
              </Text>
            </View>

            {selectedRecords.length > 0 ? (
              isExpanded ? (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recordsScrollHorizontal}
                >
                  {selectedRecords.map((record) => (
                    <View key={record.id} style={styles.polaroidCard}>
                      {/* 删除按钮 */}
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteRecord(record.id)}
                        activeOpacity={0.7}
                      >
                        <FontAwesome6 name="times-circle" size={20} color={theme.textMuted} solid />
                      </TouchableOpacity>
                      <View style={[styles.polaroidImage, { backgroundColor: theme.backgroundTertiary }]}>
                        <FontAwesome6 name="utensils" size={32} color={theme.textMuted} />
                        <View style={styles.mealTypeTag}>
                          <Text style={styles.mealTypeText}>
                            {getMealTypeLabel(record.meal_type)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.polaroidInfo}>
                        <Text style={[styles.foodName, { color: theme.textPrimary }]} numberOfLines={1}>
                          {record.food_name}
                        </Text>
                        <Text style={[styles.calorieText, { color: theme.textMuted }]}>
                          {record.calories} kcal
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <ScrollView 
                  style={styles.recordsScrollVertical}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.recordsGrid}>
                    {selectedRecords.map((record, index) => (
                      <View key={record.id} style={[
                        styles.polaroidCardGrid,
                        index % 2 === 0 ? styles.polaroidCardLeft : styles.polaroidCardRight
                      ]}>
                        {/* 删除按钮 */}
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => handleDeleteRecord(record.id)}
                          activeOpacity={0.7}
                        >
                          <FontAwesome6 name="times-circle" size={20} color={theme.textMuted} solid />
                        </TouchableOpacity>
                        <View style={[styles.polaroidImage, { backgroundColor: theme.backgroundTertiary }]}>
                          <FontAwesome6 name="utensils" size={24} color={theme.textMuted} />
                          <View style={styles.mealTypeTag}>
                            <Text style={styles.mealTypeText}>
                              {getMealTypeLabel(record.meal_type)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.polaroidInfo}>
                          <Text style={[styles.foodName, { color: theme.textPrimary }]} numberOfLines={1}>
                            {record.food_name}
                          </Text>
                          <Text style={[styles.calorieText, { color: theme.textMuted }]}>
                            {record.calories} kcal
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyMascot}>🥦</Text>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  这一天还没有记录哦~
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SwipeableTabScreen>
  );
}
