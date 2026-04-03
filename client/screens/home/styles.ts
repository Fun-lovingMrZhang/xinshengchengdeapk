import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      backgroundColor: theme.backgroundRoot,
    },
    container: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing['5xl'],
    },
    // 页面标题行
    pageTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    pageTitleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pageTitleIcon: {
      marginLeft: Spacing.xs,
    },
    dateText: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    // 卡路里主卡片
    caloriesCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      borderWidth: 2,
      borderColor: theme.primary,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    // 剩余热量区域
    caloriesMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    caloriesLeft: {
      flex: 1,
    },
    caloriesLabel: {
      marginBottom: Spacing.xs,
    },
    caloriesNumber: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    caloriesUnit: {
      marginLeft: Spacing.xs,
    },
    // 吉祥物区域
    mascotContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    mascotBubble: {
      backgroundColor: '#FEF3C7',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: '#FCD34D',
      marginBottom: Spacing.sm,
      maxWidth: 180,
    },
    mascotIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${theme.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    mascotEmoji: {
      fontSize: 40,
    },
    // 数据统计行
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      marginBottom: Spacing.xs,
    },
    statValue: {
      marginBottom: 2,
    },
    // 营养素进度
    nutrientsContainer: {
      marginTop: Spacing.lg,
    },
    nutrientRow: {
      marginBottom: Spacing.md,
    },
    nutrientHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    nutrientBar: {
      height: 8,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 4,
      overflow: 'hidden',
    },
    nutrientFill: {
      height: '100%',
      borderRadius: 4,
    },
    // 功能模块网格
    modulesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      marginTop: Spacing.lg,
    },
    moduleCard: {
      width: '47%',
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    },
    moduleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.md,
    },
    moduleHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    moduleIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    moduleContent: {
      marginBottom: Spacing.md,
    },
    moduleValue: {
      marginBottom: 2,
    },
    moduleButton: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    planProgressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    // AI拍照按钮
    aiButtonContainer: {
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
    },
    aiButton: {
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    aiButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.lg,
      gap: Spacing.md,
    },
    // 体重录入弹窗
    weightModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    weightModal: {
      width: '90%',
      maxWidth: 360,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
    },
    weightModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    weightModalTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    weightDisplayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xl,
      gap: Spacing.lg,
    },
    weightDisplayValue: {
      fontSize: 56,
      fontWeight: '700',
    },
    weightUnitSwitch: {
      flexDirection: 'row',
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    weightUnitBtn: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    weightUnitBtnActive: {
      backgroundColor: theme.primary,
    },
    weightUnitText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    weightUnitTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    keypad: {
      marginBottom: Spacing.xl,
    },
    keypadRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    keypadKey: {
      width: '30%',
      aspectRatio: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
    },
    keypadKeyText: {
      fontSize: 28,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    weightSaveBtn: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    weightSaveBtnText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
  });
};
