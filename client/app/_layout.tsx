import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { UserProvider } from '@/contexts/UserContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FoodRecordProvider } from '@/contexts/FoodRecordContext';
import { ExerciseProvider } from '@/contexts/ExerciseRecordContext';
import { ColorSchemeProvider } from '@/hooks/useColorScheme';

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <AuthProvider>
        <UserProvider>
          <FoodRecordProvider>
            <ExerciseProvider>
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
              </Stack>
            </ExerciseProvider>
          </FoodRecordProvider>
        </UserProvider>
      </AuthProvider>
    </ColorSchemeProvider>
  );
}
