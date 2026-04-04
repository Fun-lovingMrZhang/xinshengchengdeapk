import React from 'react';
import { View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { Screen, ScreenProps } from '@/components/Screen';
import { useTabSwipe } from '@/hooks/useTabSwipe';

interface SwipeableTabScreenProps extends ScreenProps {
  children: React.ReactNode;
  /** 是否启用滑动切换，默认 true */
  swipeEnabled?: boolean;
}

/**
 * 可滑动切换的 Tab 页面容器
 * 
 * 用于 Tab 页面，支持左右滑动切换到相邻 Tab
 * 
 * 使用方法：
 * ```tsx
 * import { SwipeableTabScreen } from '@/components/SwipeableTabScreen';
 * 
 * export default function HomeScreen() {
 *   return (
 *     <SwipeableTabScreen backgroundColor={theme.backgroundRoot}>
 *       {/* 页面内容 *\/}
 *     </SwipeableTabScreen>
 *   );
 * }
 * ```
 */
export function SwipeableTabScreen({
  children,
  swipeEnabled = true,
  ...screenProps
}: SwipeableTabScreenProps) {
  const { gesture } = useTabSwipe({ enabled: swipeEnabled });

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ flex: 1 }}>
        <Screen {...screenProps}>
          {children}
        </Screen>
      </View>
    </GestureDetector>
  );
}
