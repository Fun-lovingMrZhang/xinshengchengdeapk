import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
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
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing['5xl'],
    },

    // 统计卡片
    statsCard: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: Spacing.sm,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
    },

    // BMI卡片
    bmiCard: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    bmiHeader: {
      marginBottom: Spacing.lg,
    },
    bmiTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    bmiValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    bmiValue: {
      fontSize: 32,
      fontWeight: '700',
      marginRight: Spacing.lg,
    },
    bmiTag: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    bmiTagText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },

    // 历史体重卡片
    historyCard: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    historyHeader: {
      marginBottom: Spacing.lg,
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: '700',
    },

    // 时间标签
    timeTabs: {
      flexDirection: 'row',
      marginBottom: Spacing.lg,
    },
    timeTab: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      marginRight: Spacing.md,
    },
    timeTabActive: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
    },
    timeTabText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    timeTabTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },

    // 图表
    chartWrapper: {
      flexDirection: 'row',
      marginTop: Spacing.lg,
    },
    chartMain: {
      flex: 1,
    },
    emptyChart: {
      height: 160,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: theme.textMuted,
    },
    yAxisWrapper: {
      width: 28,
      justifyContent: 'space-between',
      paddingRight: Spacing.xs,
    },
    yAxisLabel: {
      fontSize: 11,
      color: theme.textMuted,
      textAlign: 'right',
    },
    chartArea: {
      position: 'relative',
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.md,
    },
    gridLine: {
      position: 'absolute',
      height: 1,
      backgroundColor: theme.borderLight,
    },
    dataPoint: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
      borderWidth: 2,
      borderColor: theme.backgroundDefault,
    },
    lineSegment: {
      position: 'absolute',
      height: 2,
      backgroundColor: theme.primary,
      transformOrigin: 'left center',
    },
    xAxisWrapper: {
      marginTop: Spacing.sm,
      height: 20,
      position: 'relative',
    },
    labelContainer: {
      alignItems: 'center',
    },
    horizontalLabel: {
      fontSize: 10,
      color: theme.textMuted,
      textAlign: 'center',
    },
  });
};
