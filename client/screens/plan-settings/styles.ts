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
    saveBtn: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    saveBtnText: {
      fontSize: 16,
      fontWeight: '600',
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing['5xl'],
    },

    // 卡片
    card: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // 输入行
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    input: {
      flex: 1,
      height: 48,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      fontSize: 16,
    },
    inputUnit: {
      fontSize: 14,
      width: 40,
    },

    // 营养素行
    nutrientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    nutrientLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    nutrientDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    nutrientName: {
      fontSize: 14,
    },
    nutrientInput: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    smallInput: {
      width: 80,
      height: 40,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      fontSize: 14,
      textAlign: 'center',
    },
  });
};
