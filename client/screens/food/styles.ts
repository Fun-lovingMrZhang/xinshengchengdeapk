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
      paddingTop: Spacing.lg,
    },
    // 搜索栏
    searchContainer: {
      marginBottom: Spacing.lg,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    searchInput: {
      flex: 1,
      marginLeft: Spacing.md,
      fontSize: 16,
      color: theme.textPrimary,
    },
    customFoodBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: theme.primary,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.full,
    },
    customFoodBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    // 分类标签 - 网格布局（每行4个）
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    categoryGridItem: {
      width: '23%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    categoryGridItemActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    categoryGridText: {
      fontSize: 13,
      fontWeight: '600',
    },
    // 食物列表
    foodList: {
      gap: Spacing.md,
      paddingBottom: Spacing['3xl'],
    },
    foodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 3,
    },
    foodCardHighlighted: {
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
      transform: [{ scale: 1.02 }],
      borderWidth: 2,
      borderColor: theme.primary,
    },
    foodCardDimmed: {
      opacity: 0.4,
    },
    foodIcon: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.lg,
    },
    foodInfo: {
      flex: 1,
    },
    foodName: {
      fontSize: 16,
      fontWeight: '500',
    },
    foodCalories: {
      fontSize: 13,
      marginTop: 2,
    },
    foodNutrients: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    nutrientBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    nutrientText: {
      fontSize: 11,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // 长按弹出菜单
    contextMenuOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    blurBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    contextMenu: {
      flexDirection: 'row',
      backgroundColor: 'rgba(80, 80, 80, 0.9)',
      borderRadius: 10,
      minWidth: 160,
      height: 44,
      alignItems: 'center',
      overflow: 'hidden',
    },
    contextMenuItem: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contextMenuEditText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '500',
    },
    contextMenuDeleteText: {
      color: '#FF6B6B',
      fontSize: 15,
      fontWeight: '500',
    },
    contextMenuDivider: {
      width: 1,
      height: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    contextMenuTriangle: {
      alignSelf: 'center',
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderTopWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'rgba(80, 80, 80, 0.9)',
    },
    // 分组标题
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      marginTop: Spacing.sm,
    },
    sectionIconBg: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      flex: 1,
    },
    sectionCount: {
      fontSize: 13,
    },
    // 添加弹窗
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    addModal: {
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      padding: Spacing.lg,
      paddingBottom: Spacing['3xl'],
    },
    addModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    selectedFoodName: {
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    weightSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.lg,
      marginVertical: Spacing.xl,
    },
    weightBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    weightDisplay: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.xs,
    },
    weightValue: {
      fontSize: 40,
      fontWeight: '700',
    },
    weightUnit: {
      fontSize: 16,
    },
    mealTypeSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: Spacing.xl,
    },
    mealTypeBtn: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
    },
    mealTypeBtnActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    mealTypeText: {
      fontSize: 14,
    },
    nutritionInfo: {
      alignItems: 'center',
      marginBottom: 24,
    },
    totalCalories: {
      fontSize: 28,
      fontWeight: '700',
    },
    nutritionDetails: {
      flexDirection: 'row',
      gap: 16,
      marginTop: 8,
    },
    nutritionDetail: {
      fontSize: 13,
    },
    confirmBtn: {
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
    },
    confirmBtnDisabled: {
      opacity: 0.6,
    },
    confirmBtnText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // 自定义食物弹窗
    customFoodModal: {
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      padding: Spacing.lg,
      paddingBottom: Spacing['3xl'],
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xl,
      paddingBottom: Spacing.md,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    inputGroup: {
      marginBottom: Spacing.lg,
    },
    inputLabel: {
      fontSize: 13,
      marginBottom: Spacing.sm,
    },
    textInput: {
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 16,
    },
    // 分类选择器
    categorySelector: {
      marginBottom: Spacing.lg,
    },
    categorySelectorLabel: {
      fontSize: 13,
      marginBottom: Spacing.sm,
    },
    categorySelectorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1.5,
    },
    categoryChipActive: {
      backgroundColor: `${theme.primary}15`,
      borderColor: theme.primary,
    },
    categoryChipText: {
      fontSize: 13,
    },
    categoryChipTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    nutrientInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.xl,
    },
    nutrientInputItem: {
      flex: 1,
      marginHorizontal: 4,
    },
    nutrientInput: {
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: 14,
      textAlign: 'center',
    },
    // 空状态
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.backgroundTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
    },
  });
};
