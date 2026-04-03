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
    calendarBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: 100,
    },

    // 水瓶卡片
    waterBottleCard: {
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.xl,
      marginBottom: Spacing.lg,
      alignItems: 'center',
    },
    progressInfoContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: Spacing.lg,
    },
    progressAmount: {
      fontSize: 36,
      fontWeight: '700',
    },
    progressUnit: {
      fontSize: 16,
      marginLeft: Spacing.sm,
    },

    // 统计卡片
    statsCard: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    statsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    statsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    targetItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statsLabel: {
      fontSize: 14,
    },
    progressBar: {
      height: 12,
      backgroundColor: '#E5E7EB',
      borderRadius: 6,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3B82F6',
      borderRadius: 6,
    },

    // 记录卡片
    recordCard: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    recordTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: Spacing.lg,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['2xl'],
    },
    emptyText: {
      fontSize: 14,
      marginTop: Spacing.md,
    },
    recordItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    recordLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    recordIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    recordAmountText: {
      fontSize: 16,
      fontWeight: '600',
    },
    recordRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    recordTime: {
      fontSize: 14,
    },
    deleteBtn: {
      padding: Spacing.sm,
    },

    // 底部操作栏
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      padding: Spacing.lg,
      paddingBottom: Spacing.xl,
      backgroundColor: theme.backgroundRoot,
    },
    editQuickBtn: {
      width: 56,
      height: 56,
      borderRadius: BorderRadius.lg,
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#4CAF50',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickAddBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      backgroundColor: '#4CAF50',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
    },
    quickAddBtnText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    customAddBtn: {
      width: 80,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: '#4CAF50',
    },
    customAddBtnText: {
      fontSize: 14,
      fontWeight: '600',
    },

    // 弹窗
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    modalDesc: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    modalInput: {
      borderWidth: 1,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 16,
      marginBottom: Spacing.lg,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    modalBtn: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    modalBtnText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
};
