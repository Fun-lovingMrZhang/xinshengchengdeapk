import { useRef, useCallback } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { usePathname, useRouter } from 'expo-router';
import { runOnJS } from 'react-native-reanimated';

// Tab 顺序配置（排除 ai-placeholder，只包含可切换的 Tab）
const TAB_ORDER = ['/', '/food', '/stats', '/profile'];

interface UseTabSwipeOptions {
  /** 是否启用滑动切换，默认 true */
  enabled?: boolean;
  /** 滑动阈值（像素），默认 80 */
  threshold?: number;
}

interface UseTabSwipeResult {
  /** 手势识别器，需要包裹在 GestureDetector 中 */
  gesture: ReturnType<typeof Gesture.Pan>;
  /** 当前 Tab 索引 */
  currentIndex: number;
  /** 总 Tab 数量 */
  totalTabs: number;
}

/**
 * Tab 滑动切换 Hook
 * 
 * 使用方法：
 * ```tsx
 * import { useTabSwipe } from '@/hooks/useTabSwipe';
 * import { GestureDetector } from 'react-native-gesture-handler';
 * 
 * export default function MyTabScreen() {
 *   const { gesture } = useTabSwipe();
 *   
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <View style={{ flex: 1 }}>
 *         {/* 页面内容 *\/}
 *       </View>
 *     </GestureDetector>
 *   );
 * }
 * ```
 */
export function useTabSwipe(options: UseTabSwipeOptions = {}): UseTabSwipeResult {
  const { enabled = true, threshold = 80 } = options;
  const router = useRouter();
  const pathname = usePathname();

  // 获取当前 Tab 索引
  const currentIndex = TAB_ORDER.findIndex(tab => {
    // 匹配路径：'/' 匹配根路径，其他匹配路径名
    if (tab === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname.startsWith(tab);
  });
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  // 切换到指定 Tab（JS 函数，通过 runOnJS 调用）
  const navigateToTab = useCallback((index: number) => {
    if (index >= 0 && index < TAB_ORDER.length) {
      const targetPath = TAB_ORDER[index];
      // 使用 replace 替换当前页面，不增加导航栈
      router.replace(targetPath as any);
    }
  }, [router]);

  // 创建手势
  const gesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-30, 30])   // 只有横向滑动超过 30px 才激活
    .failOffsetY([-15, 15])     // 纵向滑动超过 15px 则失败（允许垂直滚动）
    .onEnd((e) => {
      'worklet';
      const swipeDistance = e.translationX;
      const swipeVelocity = e.velocityX;
      
      // 结合滑动距离和速度判断
      const shouldSwipe = Math.abs(swipeDistance) > threshold || Math.abs(swipeVelocity) > 500;
      
      if (!shouldSwipe) return;
      
      // 向左滑动（下一页）- swipeDistance 为负数
      if (swipeDistance < 0 && safeIndex < TAB_ORDER.length - 1) {
        runOnJS(navigateToTab)(safeIndex + 1);
        return;
      }
      
      // 向右滑动（上一页）- swipeDistance 为正数
      if (swipeDistance > 0 && safeIndex > 0) {
        runOnJS(navigateToTab)(safeIndex - 1);
        return;
      }
    });

  return {
    gesture,
    currentIndex: safeIndex,
    totalTabs: TAB_ORDER.length,
  };
}

export { TAB_ORDER };
