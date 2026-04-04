import React, { useMemo, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFocusEffect } from 'expo-router';
import { getBackendBaseUrl } from '@/utils/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 生成近30天的日期标签（每5天一个，共6个）
const generateMonthLabels = () => {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 25; i >= 0; i -= 5) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    labels.push(`${month}/${day}`);
  }
  return labels;
};

// 生成近7天的日期标签
const generateWeekLabels = () => {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    labels.push(`${month}/${day}`);
  }
  return labels;
};

// 历史体重数据（模拟，实际应从后端获取）
const WEIGHT_HISTORY = [
  { date: '03/19', weight: 64.2 },
  { date: '03/20', weight: 64.1 },
  { date: '03/21', weight: 64.0 },
  { date: '03/22', weight: 64.0 },
  { date: '03/23', weight: 64.0 },
  { date: '03/24', weight: 63.8 },
  { date: '03/25', weight: 63.5 },
  { date: '03/26', weight: 63.2 },
  { date: '03/27', weight: 52.0 },
];

export default function WeightDetailScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [currentWeight, setCurrentWeight] = useState(64.0);
  const [targetWeight, setTargetWeight] = useState(67.6);
  const [height, setHeight] = useState(1.71);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');

  // 从后端获取用户数据
  const fetchUserData = useCallback(async () => {
    try {
      const baseUrl = getBackendBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/users/1`);
      const user = await res.json();
      
      if (user) {
        setCurrentWeight(user.weight || 64);
        setTargetWeight(user.target_weight || 60);
        setHeight((user.height || 171) / 100); // cm -> m
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  // 计算BMI
  const bmi = currentWeight / (height * height);
  const bmiStatus = useMemo(() => {
    if (bmi < 18.5) return { label: '偏低', color: '#3B82F6' };
    if (bmi < 24) return { label: '理想', color: '#22C55E' };
    if (bmi < 28) return { label: '偏胖', color: '#F59E0B' };
    return { label: '肥胖', color: '#EF4444' };
  }, [bmi]);

  // 累计变化
  const weightChange = currentWeight - 64.0; // 假设初始体重64

  // 根据时间范围生成X轴标签
  const xAxisLabels = useMemo(() => {
    return timeRange === 'week' ? generateWeekLabels() : generateMonthLabels();
  }, [timeRange]);

  // 根据时间范围过滤数据
  const filteredData = useMemo(() => {
    if (timeRange === 'week') {
      return WEIGHT_HISTORY.slice(-7);
    }
    return WEIGHT_HISTORY;
  }, [timeRange]);

  // 渲染折线图
  const renderChart = () => {
    if (filteredData.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>暂无数据</Text>
        </View>
      );
    }

    // 图表尺寸（留出卡片内边距）
    const chartWidth = SCREEN_WIDTH - 96; // 左右各48px padding
    const chartHeight = 160;
    
    const weights = filteredData.map(w => w.weight);
    const maxWeight = Math.max(...weights) + 2;
    const minWeight = Math.min(...weights) - 2;
    const weightRange = maxWeight - minWeight || 1;
    
    // 数据点间距
    const pointCount = filteredData.length;
    const pointSpacing = pointCount > 1 ? chartWidth / (pointCount - 1) : chartWidth / 2;

    // X轴标签等宽分布
    const labelCount = xAxisLabels.length;
    const labelSpacing = labelCount > 1 ? chartWidth / (labelCount - 1) : chartWidth / 2;

    return (
      <View style={styles.chartWrapper}>
        {/* Y轴刻度 */}
        <View style={[styles.yAxisWrapper, { height: chartHeight }]}>
          <Text style={styles.yAxisLabel}>{maxWeight.toFixed(0)}</Text>
          <Text style={styles.yAxisLabel}>{((maxWeight + minWeight) / 2).toFixed(0)}</Text>
          <Text style={styles.yAxisLabel}>{minWeight.toFixed(0)}</Text>
        </View>

        {/* 图表主体 */}
        <View style={styles.chartMain}>
          {/* 折线区域 */}
          <View style={[styles.chartArea, { height: chartHeight, width: chartWidth }]}>
            {/* 网格线 */}
            {[0, 0.5, 1].map((ratio) => (
              <View 
                key={ratio} 
                style={[
                  styles.gridLine, 
                  { top: ratio * chartHeight, width: chartWidth }
                ]} 
              />
            ))}

            {/* 折线和数据点 */}
            {filteredData.map((item, index) => {
              const x = index * pointSpacing;
              const y = chartHeight - ((item.weight - minWeight) / weightRange) * chartHeight;
              const prevY = index > 0 
                ? chartHeight - ((filteredData[index - 1].weight - minWeight) / weightRange) * chartHeight 
                : y;

              return (
                <React.Fragment key={index}>
                  {/* 连线 */}
                  {index > 0 && (
                    <View
                      style={[
                        styles.lineSegment,
                        {
                          left: (index - 1) * pointSpacing,
                          top: prevY,
                          width: Math.sqrt(Math.pow(pointSpacing, 2) + Math.pow(y - prevY, 2)),
                          transform: [
                            { translateX: 0 },
                            { rotate: `${Math.atan2(y - prevY, pointSpacing)}rad` }
                          ]
                        }
                      ]}
                    />
                  )}
                  {/* 数据点 */}
                  <View
                    style={[
                      styles.dataPoint,
                      { left: x - 5, top: y - 5 }
                    ]}
                  />
                </React.Fragment>
              );
            })}
          </View>

          {/* X轴日期标签 */}
          <View style={[styles.xAxisWrapper, { width: chartWidth }]}>
            {xAxisLabels.map((label, index) => {
              const labelPosition = labelCount > 1 ? index * labelSpacing : chartWidth / 2;
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.labelContainer,
                    { 
                      position: 'absolute',
                      left: labelPosition - 25,
                      width: 50,
                    }
                  ]}
                >
                  <Text style={styles.horizontalLabel}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>体重数值记录</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 核心数据卡片 */}
          <ThemedView level="default" style={styles.statsCard}>
            <View style={styles.statsRow}>
              {/* 累计变化 */}
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>累计变化</Text>
                <Text style={[styles.statValue, { color: theme.textMuted }]}>
                  {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Text>
              </View>
              
              {/* 当前体重 */}
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>当前体重</Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  {currentWeight.toFixed(1)} kg
                </Text>
              </View>
              
              {/* 目标体重 */}
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>目标体重</Text>
                <Text style={[styles.statValue, { color: theme.accent }]}>
                  {targetWeight.toFixed(1)} kg
                </Text>
              </View>
            </View>
          </ThemedView>

          {/* BMI指数卡片 */}
          <ThemedView level="default" style={styles.bmiCard}>
            <View style={styles.bmiHeader}>
              <Text style={[styles.bmiTitle, { color: theme.textPrimary }]}>BMI指数</Text>
            </View>
            
            <View style={styles.bmiValueRow}>
              <Text style={[styles.bmiValue, { color: theme.textPrimary }]}>{bmi.toFixed(2)}</Text>
              <View style={[styles.bmiTag, { backgroundColor: bmiStatus.color }]}>
                <Text style={styles.bmiTagText}>{bmiStatus.label}</Text>
              </View>
            </View>
          </ThemedView>

          {/* 历史体重卡片 */}
          <ThemedView level="default" style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyTitle, { color: theme.textPrimary }]}>历史体重</Text>
            </View>

            {/* 时间切换标签 */}
            <View style={styles.timeTabs}>
              <TouchableOpacity
                style={[styles.timeTab, timeRange === 'week' && styles.timeTabActive]}
                onPress={() => setTimeRange('week')}
              >
                <Text style={[styles.timeTabText, timeRange === 'week' && styles.timeTabTextActive]}>
                  近一周
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeTab, timeRange === 'month' && styles.timeTabActive]}
                onPress={() => setTimeRange('month')}
              >
                <Text style={[styles.timeTabText, timeRange === 'month' && styles.timeTabTextActive]}>
                  近一月
                </Text>
              </TouchableOpacity>
            </View>

            {/* 折线图 */}
            {renderChart()}
          </ThemedView>
        </ScrollView>
      </View>
    </Screen>
  );
}
