import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useMemo } from 'react';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useSafeRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.backgroundDefault,
          borderTopColor: theme.border,
          height: Platform.OS === 'web' ? 65 : 55 + insets.bottom,
          paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarItemStyle: {
          height: Platform.OS === 'web' ? 65 : undefined,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      {/* 记录 - 首页 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '记录',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome6 
                name={focused ? "clipboard-list" : "clipboard"} 
                size={20} 
                color={color} 
                solid={focused}
              />
            </View>
          ),
        }}
      />
      
      {/* 食物库 */}
      <Tabs.Screen
        name="food"
        options={{
          title: '食物',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome6 
                name="bowl-food" 
                size={20} 
                color={color} 
                solid={focused}
              />
            </View>
          ),
        }}
      />
      
      {/* 中央+号按钮 - 跳转到独立AI对话页 */}
      <Tabs.Screen
        name="ai-placeholder"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.centerButtonContainer}>
              <FontAwesome6 name="plus" size={24} color="#FFFFFF" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/ai');
          },
        }}
      />
      
      {/* 统计 */}
      <Tabs.Screen
        name="stats"
        options={{
          title: '统计',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome6 
                name="chart-simple" 
                size={20} 
                color={color} 
                solid={focused}
              />
            </View>
          ),
        }}
      />
      
      {/* 我的 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome6 
                name="user" 
                size={20} 
                color={color} 
                solid={focused}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerButtonContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -16,
      elevation: 5,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });
