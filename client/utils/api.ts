import Constants from 'expo-constants';

/**
 * 获取后端 API 基础地址
 * 优先使用环境变量，其次使用 app.config.ts 中的 extra 配置
 */
export function getBackendBaseUrl(): string {
  // 优先使用环境变量（构建时注入）
  if (process.env.EXPO_PUBLIC_BACKEND_BASE_URL) {
    return process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
  }
  
  // 其次使用 app.config.ts 中的 extra 配置
  const extra = Constants.expoConfig?.extra as { backendBaseUrl?: string } | undefined;
  if (extra?.backendBaseUrl) {
    return extra.backendBaseUrl;
  }
  
  // 默认地址
  return 'https://health-assistant-api-dy1i.onrender.com';
}
