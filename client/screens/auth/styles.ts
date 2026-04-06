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
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing['3xl'],
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: Spacing['3xl'],
    },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    appSlogan: {
      fontSize: 14,
      color: theme.textMuted,
    },
    formCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: Spacing.xl,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      borderRadius: BorderRadius.md,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textMuted,
    },
    tabTextActive: {
      color: '#FFFFFF',
    },
    inputGroup: {
      marginBottom: Spacing.lg,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputFocused: {
      borderColor: theme.primary,
    },
    inputError: {
      borderColor: '#EF4444',
    },
    errorText: {
      fontSize: 12,
      color: '#EF4444',
      marginTop: Spacing.xs,
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    switchText: {
      textAlign: 'center',
      marginTop: Spacing.lg,
      fontSize: 14,
      color: theme.textMuted,
    },
    switchLink: {
      color: theme.primary,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      marginHorizontal: Spacing.md,
      fontSize: 12,
      color: theme.textMuted,
    },
    guestButton: {
      backgroundColor: 'transparent',
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    guestButtonText: {
      fontSize: 14,
      color: theme.textMuted,
    },
  });
};
