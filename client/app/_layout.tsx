import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { useRootNavigationState as useExpoRootState, useSegments } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { FoodRecordProvider } from '@/contexts/FoodRecordContext';
import { ExerciseProvider } from '@/contexts/ExerciseRecordContext';
import { ColorSchemeProvider } from '@/hooks/useColorScheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';

// 包装原生 useRootNavigationState，返回类型兼容
function useNavigationState() {
  return useExpoRootState();
}

// 登录状态检查组件
function AuthGuard({ children }: { children: React.ReactNode }) {
  const rootState = useNavigationState();
  const segments = useSegments();
  const router = useSafeRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 1. 待机检测：导航未挂载 或 鉴权正在加载中，直接返回
    if (!rootState?.key || isLoading) return;

    // 2. 路径检测：确认当前不在登录页 (防止死循环)
    const inAuthRoute = segments.includes('login');

    // 3. 未登录保护：未登录且不在登录页 → 跳转登录页
    if (!isAuthenticated && !inAuthRoute) {
      router.replace('/login', {});
    }

    // 4. 已登录保护：已登录但在登录页 → 跳转首页
    if (isAuthenticated && inAuthRoute) {
      router.replace('/', {});
    }
  }, [rootState?.key, isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <AuthProvider>
        <UserProvider>
          <FoodRecordProvider>
            <ExerciseProvider>
              <AuthGuard>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen 
                    name="login" 
                    options={{ 
                      presentation: 'card',
                      animation: 'slide_from_bottom',
                    }} 
                  />
                <Stack.Screen 
                  name="ai" 
                  options={{ 
                    // iOS 使用 modal 样式，Web/Android 使用普通页面
                    presentation: Platform.OS === 'ios' ? 'modal' : 'card',
                    animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="weight-detail" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="water" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="exercise-records" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="exercise-library" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="plan" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="plan-settings" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="settings" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="membership" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="help" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
                <Stack.Screen 
                  name="about" 
                  options={{ 
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }} 
                />
              </Stack>
              </AuthGuard>
            </ExerciseProvider>
          </FoodRecordProvider>
        </UserProvider>
      </AuthProvider>
    </ColorSchemeProvider>
  );
}
