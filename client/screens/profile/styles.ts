import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Spacing['5xl'],
    },
    content: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
    },
    // 用户信息卡片
    userCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      position: 'relative',
    },
    // 头像
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${theme.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    userName: {
      marginBottom: Spacing.xs,
    },
    // 个人参数设置按钮
    paramsSettingBtn: {
      position: 'absolute',
      top: Spacing.lg,
      right: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
    },
    paramsSettingText: {
      fontSize: 12,
    },
    // 扩展信息标签
    userInfoExtended: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    infoTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
    },
    infoTagText: {
      fontSize: 12,
    },
    userStats: {
      flexDirection: 'row',
      gap: Spacing['2xl'],
      marginTop: Spacing.lg,
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    userStatItem: {
      alignItems: 'center',
    },
    // 热量目标卡片
    caloriesCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    caloriesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    goalTag: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: BorderRadius.full,
    },
    goalTagText: {
      fontSize: 12,
      fontWeight: '600',
    },
    caloriesValues: {
      alignItems: 'center',
      paddingVertical: Spacing.md,
    },
    caloriesMain: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: Spacing.sm,
    },
    calculationProcess: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    processItem: {
      alignItems: 'center',
    },
    processLabel: {
      fontSize: 10,
      marginBottom: 2,
    },
    processValue: {
      fontSize: 13,
      fontWeight: '600',
    },
    // 三大营养素卡片
    macrosCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    macrosGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    macroItem: {
      alignItems: 'center',
      flex: 1,
    },
    macroIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    macroValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    macroBar: {
      width: '80%',
      height: 4,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 2,
      marginTop: Spacing.sm,
      overflow: 'hidden',
    },
    macroFill: {
      height: '100%',
      borderRadius: 2,
    },
    // 目标卡片
    goalCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    goalProgress: {
      alignItems: 'center',
    },
    progressBar: {
      width: '100%',
      height: 8,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 4,
      marginTop: Spacing.md,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    // 统计卡片
    statsCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statsItem: {
      alignItems: 'center',
    },
    statsValue: {
      marginBottom: Spacing.xs,
    },
    // 功能菜单
    menuSection: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.lg,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    menuContent: {
      flex: 1,
    },
    menuArrow: {
      marginLeft: Spacing.sm,
    },
    // 版本信息
    versionInfo: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
    },
    // 弹窗样式
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    modalBody: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: Spacing.md,
    },
    formRow: {
      flexDirection: 'row',
      gap: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    formItem: {
      flex: 1,
    },
    formLabel: {
      fontSize: 13,
      marginBottom: Spacing.sm,
    },
    // 性别选择器
    genderSelector: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    genderOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
    },
    genderOptionActive: {
      backgroundColor: `${theme.primary}10`,
    },
    genderText: {
      fontSize: 14,
    },
    // 输入框
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
    },
    textInput: {
      flex: 1,
      fontSize: 15,
      padding: 0,
    },
    inputUnit: {
      fontSize: 14,
      marginLeft: Spacing.xs,
    },
    // 活动水平选择器
    activitySelector: {
      gap: Spacing.sm,
    },
    activityOption: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
    },
    activityOptionActive: {
      backgroundColor: `${theme.primary}10`,
    },
    activityLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    activityDesc: {
      fontSize: 12,
    },
    // 目标选择器
    goalSelector: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    goalOption: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    goalLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: Spacing.sm,
    },
    // 底部按钮
    modalFooter: {
      flexDirection: 'row',
      gap: Spacing.md,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      alignItems: 'center',
    },
    cancelBtnText: {
      fontSize: 16,
    },
    saveBtn: {
      flex: 1.5,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    saveBtnText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // 目标体重弹窗样式
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
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: Spacing.xl,
    },
    weightDisplayValue: {
      fontSize: 56,
      fontWeight: '700',
    },
    weightDisplayUnit: {
      fontSize: 20,
      marginLeft: Spacing.sm,
      marginBottom: 12,
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
