import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    scrollContent: {
      flex: 1,
    },
    
    // ====== 顶部月份选择器 ======
    headerSection: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    monthSelectorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrowBtn: {
      padding: Spacing.md,
    },
    monthTitleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    
    // ====== 日历区域 ======
    calendarSection: {
      paddingHorizontal: Spacing.lg,
    },
    
    // 整月网格
    monthGrid: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    weekDaysRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: Spacing.sm,
      paddingBottom: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    weekDayHeader: {
      width: 40,
      alignItems: 'center',
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: '500',
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
      paddingVertical: 2,
    },
    dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayCircle: {
      backgroundColor: theme.primary,
    },
    selectedCircle: {
      borderWidth: 2,
      borderColor: theme.primary,
      backgroundColor: theme.backgroundTertiary,
    },
    hasRecordCircle: {
      backgroundColor: theme.backgroundTertiary,
    },
    dayNumber: {
      fontSize: 14,
      fontWeight: '500',
    },
    mascotDot: {
      fontSize: 12,
      marginTop: 2,
    },
    
    // 周视图行
    weekRow: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.lg,
      marginBottom: Spacing.md,
    },
    weekDaysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    weekDayCard: {
      alignItems: 'center',
      width: 48,
    },
    weekDayLabel: {
      fontSize: 12,
      marginBottom: Spacing.xs,
    },
    
    // ====== 展开/收起横线（在日历框内部）======
    expandLineInCard: {
      alignItems: 'center',
      paddingVertical: Spacing.md,
      marginTop: Spacing.sm,
    },
    lineHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
    },
    
    // ====== 记录列表 ======
    recordsSection: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing['5xl'],
    },
    dateHeader: {
      marginBottom: Spacing.md,
    },
    selectedDateText: {
      fontSize: 16,
      fontWeight: '600',
    },
    
    // 水平滚动（月视图）
    recordsScrollHorizontal: {
      gap: Spacing.md,
      paddingBottom: Spacing.lg,
    },
    
    // 垂直滚动（周视图）
    recordsScrollVertical: {
      maxHeight: 400, // 限制最大高度，超出可滚动
    },
    recordsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    
    // 拍立得风格卡片（水平滚动用）
    polaroidCard: {
      width: 140,
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    // 拍立得风格卡片（网格用，宽度自适应）
    polaroidCardGrid: {
      width: '48%',
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    polaroidCardLeft: {
      // 左边卡片
    },
    polaroidCardRight: {
      // 右边卡片
    },
    // 删除按钮
    deleteButton: {
      position: 'absolute',
      top: -6,
      right: -6,
      zIndex: 10,
      backgroundColor: theme.backgroundRoot,
      borderRadius: 12,
      padding: 2,
    },
    polaroidImage: {
      width: '100%',
      height: 100,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    polaroidInfo: {
      alignItems: 'center',
      paddingTop: Spacing.sm,
    },
    mealTypeTag: {
      position: 'absolute',
      top: 6,
      left: 6,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    mealTypeText: {
      color: '#FFFFFF',
      fontSize: 10,
    },
    foodName: {
      fontSize: 13,
      fontWeight: '600',
    },
    calorieText: {
      fontSize: 12,
      marginTop: 2,
    },
    
    // 空状态
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyMascot: {
      fontSize: 48,
      marginBottom: Spacing.md,
    },
    emptyText: {
      fontSize: 14,
    },
  });
};
