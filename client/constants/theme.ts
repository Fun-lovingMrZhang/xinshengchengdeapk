export const Colors = {
  light: {
    textPrimary: "#1C1917",
    textSecondary: "#57534E",
    textMuted: "#A8A29E",
    primary: "#4CAF50", // 浅绿色主题
    accent: "#FF9800", // 橙色强调
    success: "#4CAF50",
    error: "#EF4444",
    warning: "#F59E0B",
    backgroundRoot: "#E6F9E6", // 浅绿背景
    backgroundDefault: "#FFFFFF",
    backgroundTertiary: "#F0FDF4", // 浅绿背景
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#4CAF50",
    border: "#D1D5DB",
    borderLight: "#E5E7EB",
    // 营养素颜色（与截图一致）
    protein: "#A78BFA", // 紫色 - 蛋白质
    carbs: "#60A5FA", // 蓝色 - 碳水
    fat: "#FB923C", // 橙色 - 脂肪
    fiber: "#06B6D4", // 青色 - 纤维
    calories: "#F97316", // 橙色 - 热量
    // 卡片阴影
    shadowDark: "#D1D9E6",
    shadowLight: "#FFFFFF",
    cardBackground: "#FFFFFF",
    cardBackgroundAlt: "#F0FDF4",
  },
  dark: {
    textPrimary: "#FAFAF9",
    textSecondary: "#A8A29E",
    textMuted: "#78716C",
    primary: "#66BB6A", // 绿色
    accent: "#FB923C", // 橙色
    success: "#66BB6A",
    error: "#F87171",
    warning: "#FBBF24",
    backgroundRoot: "#1A1A1A",
    backgroundDefault: "#2D2D2D",
    backgroundTertiary: "#3D3D3D",
    buttonPrimaryText: "#1A1A1A",
    tabIconSelected: "#66BB6A",
    border: "#44403C",
    borderLight: "#3D3D3D",
    protein: "#A78BFA",
    carbs: "#60A5FA",
    fat: "#FB923C",
    fiber: "#22D3EE",
    calories: "#FB923C",
    shadowDark: "#1A1A1A",
    shadowLight: "#2D2D2D",
    cardBackground: "#2D2D2D",
    cardBackgroundAlt: "#3D3D3D",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -4,
  },
  displayLarge: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -2,
  },
  displayMedium: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  labelTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
  // 数字专用（Monospace 风格）
  number: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800" as const,
    fontVariant: ["tabular-nums" as const],
  },
  numberLarge: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "800" as const,
    fontVariant: ["tabular-nums" as const],
  },
  numberSmall: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700" as const,
    fontVariant: ["tabular-nums" as const],
  },
};

export type Theme = typeof Colors.light;
