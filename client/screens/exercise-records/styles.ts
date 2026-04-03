import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    
    // 顶部导航栏 - 浅薄荷绿背景
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      backgroundColor: '#E8F5E9',
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#212121',
    },
    calendarBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // 提示文字
    tipContainer: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: '#E8F5E9',
    },
    tipText: {
      fontSize: 12,
      color: '#757575',
    },
    
    // 滚动内容
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      paddingBottom: 100,
    },
    
    // 空状态
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#E8F5E9',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
    },
    emptyTitle: {
      fontSize: 16,
      color: '#757575',
      marginBottom: Spacing.xs,
    },
    emptySubTitle: {
      fontSize: 14,
      color: '#9E9E9E',
    },
    
    // 日期分组
    dateGroup: {
      marginBottom: Spacing.lg,
    },
    dateTitle: {
      fontSize: 14,
      color: '#757575',
      marginBottom: Spacing.md,
    },
    
    // 记录卡片
    recordCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
    },
    recordItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.lg,
    },
    recordItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
    },
    
    // 左侧内容
    recordLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      flex: 1,
    },
    exerciseIcon: {
      width: 56,
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 18,
      color: '#212121',
      fontWeight: '400',
      marginBottom: 2,
    },
    exerciseDuration: {
      fontSize: 14,
      color: '#757575',
    },
    
    // 右侧热量
    recordRight: {
      alignItems: 'flex-end',
    },
    caloriesValue: {
      fontSize: 28,
      fontWeight: '700',
      color: '#212121',
    },
    caloriesUnit: {
      fontSize: 12,
      color: '#9E9E9E',
      marginTop: 2,
    },
    
    // 底部按钮
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.lg,
      paddingBottom: Spacing.xl,
      backgroundColor: '#F5F5F5',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4CAF50',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};
