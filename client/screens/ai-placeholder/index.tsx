// AI Tab 占位页面 - 实际跳转到 AI 聊天页面
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function AIPlaceholderScreen() {
  const router = useSafeRouter();

  useEffect(() => {
    // 自动跳转到 AI 聊天页面
    router.replace('/ai');
  }, [router]);

  return <View />;
}
