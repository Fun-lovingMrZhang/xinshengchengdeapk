import { ExpoConfig, ConfigContext } from 'expo/config';

// 应用名称
const appName = '健康助手';
// EAS 项目 ID
const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || 'e0de832a-8ef2-43b7-862a-2e47c9617820';
// 后端 API 地址
const backendBaseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://health-assistant-api-dy1i.onrender.com';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    "name": appName,
    "slug": "health-assistant",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "healthassistant",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "extra": {
      "eas": {
        "projectId": easProjectId
      },
      "backendBaseUrl": backendBaseUrl
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.healthassistant.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#4F46E5"
      },
      "package": "com.healthassistant.app"
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": backendBaseUrl
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#4F46E5"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "允许应用访问您的相册，以便上传食物照片进行识别",
          "cameraPermission": "允许应用使用相机拍摄食物照片进行识别",
          "microphonePermission": "允许应用访问麦克风以录制视频声音"
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "允许应用使用相机拍摄食物照片进行识别",
          "microphonePermission": "允许应用访问麦克风以录制视频声音",
          "recordAudioAndroid": true
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
