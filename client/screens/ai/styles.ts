import { StyleSheet, Platform } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    // 顶部标题栏
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      paddingTop: Spacing.xl,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E8F5E9',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
    },
    headerAvatarEmoji: {
      fontSize: 22,
    },
    headerInfo: {
      alignItems: 'flex-start',
    },
    onlineStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    onlineDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#22C55E',
      marginRight: 4,
    },
    moreButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // 消息列表
    messagesContainer: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    messagesContent: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.lg,
      gap: Spacing.md,
    },
    // 时间显示
    timeContainer: {
      alignItems: 'center',
      marginVertical: Spacing.sm,
    },
    timeBadge: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    // 消息行
    messageRowAI: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: Spacing.sm,
      maxWidth: '85%',
    },
    messageRowUser: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      maxWidth: '85%',
      alignSelf: 'flex-end',
    },
    // AI头像
    aiAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#E8F5E9',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    aiAvatarEmoji: {
      fontSize: 20,
    },
    // AI消息气泡
    aiBubble: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.lg,
      borderBottomLeftRadius: 4,
      padding: Spacing.md,
      maxWidth: '100%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    // 用户消息气泡
    userBubble: {
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.lg,
      borderBottomRightRadius: 4,
      padding: Spacing.md,
      maxWidth: '100%',
    },
    // 图片消息
    messageImage: {
      width: 200,
      height: 150,
      borderRadius: BorderRadius.lg,
    },
    // 正在输入动画
    typingBubble: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.lg,
      borderBottomLeftRadius: 4,
      padding: Spacing.md,
      minWidth: 60,
    },
    typingDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    // 食物卡片
    foodCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.md,
      flex: 1,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    foodCardConfirmed: {
      borderWidth: 1,
      borderColor: '#22C55E',
    },
    confirmedBadge: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#DCFCE7',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.full,
    },
    foodCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    foodCardTag: {
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    foodCardBody: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    foodCalorieCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 3,
      borderColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    foodInfo: {
      flex: 1,
      gap: 2,
    },
    nutrientRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.xs,
    },
    nutrientItem: {
      alignItems: 'center',
    },
    foodCardActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.sm,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
    },
    confirmButton: {
      flex: 1,
    },
    confirmButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      gap: Spacing.xs,
    },
    // 底部输入栏
    inputBar: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      // 确保输入栏在键盘上方
      ...Platform.select({
        android: {
          paddingBottom: Spacing.md,
        },
      }),
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: Spacing.md,
      marginBottom: Spacing.sm,
    },
    quickBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: Spacing.sm,
    },
    input: {
      flex: 1,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: 16,
      maxHeight: 100,
      minHeight: 40,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    disclaimer: {
      textAlign: 'center',
      marginTop: Spacing.xs,
    },
    // 编辑Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    editModal: {
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      padding: Spacing.lg,
      maxHeight: '80%',
    },
    editModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    editField: {
      marginBottom: Spacing.md,
    },
    editInput: {
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: 16,
      marginTop: Spacing.xs,
    },
    foodSuggestions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
      marginTop: Spacing.xs,
      marginBottom: Spacing.sm,
    },
    foodSuggestion: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    mealTypeSelector: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    mealTypeOption: {
      flex: 1,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.borderLight,
      alignItems: 'center',
    },
    nutrientsDisplay: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginTop: Spacing.sm,
    },
    nutrientDisplayItem: {
      alignItems: 'center',
    },
    saveButton: {
      marginTop: Spacing.lg,
    },
    saveButtonGradient: {
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
  });
};
