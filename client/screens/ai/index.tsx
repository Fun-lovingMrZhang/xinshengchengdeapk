import React, { useMemo, useState, useRef, useEffect, useCallback, JSX } from 'react';
import { 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Text,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFoodRecords } from '@/contexts/FoodRecordContext';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { LinearGradient } from 'expo-linear-gradient';
import { createFormDataFile } from '@/utils';
import * as ImagePicker from 'expo-image-picker';
import { getBackendBaseUrl } from '@/utils/api';

interface Message {
  id: string;
  type: 'ai' | 'user' | 'food_card' | 'image' | 'time_hint';
  content: string;
  timestamp: string;
  confirmed?: boolean;
  imageUri?: string;
  foodData?: {
    name: string;
    mealType: string;
    date: string;
    weight: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecognizedFood {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType?: string;
}

const CHAT_STORAGE_KEY = 'ai_chat_messages';

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const getWelcomeMessage = (): Message => ({
  id: '1',
  type: 'ai',
  content: '你好呀！我是你的营养小助手🥦\n\n我可以帮你：\n• 📸 识别食物照片，计算热量\n• 💬 记录今天吃了什么\n• 🥗 给出营养建议\n\n试试拍照识别，或者告诉我你今天吃了什么~',
  timestamp: new Date().toISOString(),
});

const MEAL_TYPE_OPTIONS = ['早餐', '午餐', '晚餐', '加餐'];

const COMMON_FOODS = [
  '鸡蛋', '牛奶', '豆浆', '全麦面包', '包子', '馒头', '粥', '面条',
  '米饭', '鸡胸肉', '鸡腿', '牛肉', '猪肉', '鱼', '虾', '豆腐',
];

const parseFoodDataFromAI = (content: string): RecognizedFood[] => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*"foods"[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      if (data.foods && Array.isArray(data.foods)) {
        return data.foods.map((food: any) => ({
          name: food.name || '未知食物',
          weight: food.weight || 100,
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          mealType: data.mealType || '午餐',
        }));
      }
    }
    return [];
  } catch (e) {
    console.error('Failed to parse food data:', e);
    return [];
  }
};

export default function AIScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ imageUri?: string; mode?: string }>();
  const { addRecord } = useFoodRecords();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 使用 ref 追踪已处理的图片 URI，避免重复处理
  const processedImageUriRef = useRef<string | null>(null);

  // 编辑Modal状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    mealType: '午餐',
    weight: '100',
    calories: '0',
    protein: '0',
    carbs: '0',
    fat: '0',
  });

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // 图片识别核心函数
  const handleImageRecognition = useCallback(async (imageUri: string) => {
    console.log('[AI] 开始识别图片:', imageUri);
    
    // 先添加用户发送的图片消息
    const userImageMessage: Message = {
      id: `user-img-${Date.now()}`,
      type: 'image',
      content: '',
      timestamp: new Date().toISOString(),
      imageUri,
    };
    setMessages(prev => [...prev, userImageMessage]);
    
    setIsTyping(true);

    try {
      const baseUrl = getBackendBaseUrl();
      const formData = new FormData();
      const file = await createFormDataFile(imageUri, 'food.jpg', 'image/jpeg');
      formData.append('image', file as any);

      const aiMessageId = `ai-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
      }]);

      const response = await fetch(`${baseUrl}/api/v1/ai/recognize-food`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('识别请求失败');

      const text = await response.text();
      const lines = text.split('\n');
      let fullContent = '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            // 确保 content 是字符串类型
            if (parsed.content && typeof parsed.content === 'string') {
              fullContent += parsed.content;
              setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
              ));
              scrollToBottom();
            } else if (parsed.content) {
              // 如果 content 不是字符串，记录警告
              console.warn('[AI Chat] content 不是字符串:', typeof parsed.content, parsed.content);
            }
            // 处理可能的错误响应
            if (parsed.error) {
              console.error('[AI Chat] API 错误:', parsed.error);
            }
          } catch (e) {
            console.error('[AI Chat] JSON 解析错误:', e);
          }
        }
      }

      setIsTyping(false);

      const foods = parseFoodDataFromAI(fullContent);
      if (foods.length > 0) {
        setTimeout(() => {
          foods.forEach((food, index) => {
            setTimeout(() => {
              const today = new Date();
              const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
              const foodMessage: Message = {
                id: `${Date.now()}-food-${index}`,
                type: 'food_card',
                content: '',
                timestamp: new Date().toISOString(),
                foodData: {
                  name: food.name,
                  mealType: food.mealType || '午餐',
                  date: dateStr,
                  weight: food.weight,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fat: food.fat,
                },
              };
              setMessages(prev => [...prev, foodMessage]);
              scrollToBottom();
            }, index * 300);
          });
        }, 500);
      }
    } catch (error) {
      console.error('Image recognition error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `${Date.now()}-error`,
        type: 'ai',
        content: '抱歉，识别失败了，请重试~',
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [scrollToBottom]);

  // 加载聊天记录
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const today = getTodayString();
        const stored = await AsyncStorage.getItem(`${CHAT_STORAGE_KEY}_${today}`);
        if (stored) {
          const parsed = JSON.parse(stored) as Message[];
          const todayMessages = parsed.filter(msg => {
            const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
            return msgDate === today;
          });
          if (todayMessages.length > 0) {
            setMessages(todayMessages);
          } else {
            setMessages([getWelcomeMessage()]);
          }
        } else {
          setMessages([getWelcomeMessage()]);
        }
      } catch (e) {
        console.error('Failed to load chat messages:', e);
        setMessages([getWelcomeMessage()]);
      }
      setIsLoaded(true);
    };
    loadMessages();
  }, []);

  // 处理从首页传来的图片识别请求
  useEffect(() => {
    const imageUri = params.imageUri;
    const mode = params.mode;
    
    console.log('[AI] params:', { mode, imageUri, isLoaded, processedUri: processedImageUriRef.current });
    
    // 只在以下情况处理：
    // 1. mode === 'recognize'
    // 2. imageUri 存在
    // 3. 已加载完成
    // 4. 这个 imageUri 还没被处理过
    if (mode === 'recognize' && imageUri && isLoaded && processedImageUriRef.current !== imageUri) {
      console.log('[AI] 开始处理首页传来的图片');
      processedImageUriRef.current = imageUri; // 标记为已处理
      handleImageRecognition(imageUri);
    }
  }, [params.mode, params.imageUri, isLoaded, handleImageRecognition]);

  // 保存聊天记录
  useEffect(() => {
    if (!isLoaded) return;
    const saveMessages = async () => {
      try {
        const today = getTodayString();
        await AsyncStorage.setItem(`${CHAT_STORAGE_KEY}_${today}`, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat messages:', e);
      }
    };
    saveMessages();
  }, [messages, isLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 拍照识别
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限提示', '请在系统设置中允许访问相机，以便拍照识别食物');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageRecognition(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('错误', '打开相机失败，请重试');
    }
  };

  // 从相册选择
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限提示', '请在系统设置中允许访问相册，以便选择图片识别食物');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageRecognition(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('错误', '打开相册失败，请重试');
    }
  };

  // 发送文本消息
  const handleSendText = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const baseUrl = getBackendBaseUrl();
      const conversationHistory = messages
        .filter(m => m.type === 'user' || m.type === 'ai')
        .map(m => ({
          role: m.type === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        }));
      conversationHistory.push({ role: 'user', content: userMessage.content });

      const aiMessageId = `ai-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
      }]);

      const response = await fetch(`${baseUrl}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) throw new Error('聊天请求失败');

      const text = await response.text();
      const lines = text.split('\n');
      let fullContent = '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            // 确保 content 是字符串类型
            if (parsed.content && typeof parsed.content === 'string') {
              fullContent += parsed.content;
              setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
              ));
              scrollToBottom();
            } else if (parsed.content) {
              // 如果 content 不是字符串，记录警告
              console.warn('[AI Chat] content 不是字符串:', typeof parsed.content, parsed.content);
            }
            // 处理可能的错误响应
            if (parsed.error) {
              console.error('[AI Chat] API 错误:', parsed.error);
            }
          } catch (e) {
            console.error('[AI Chat] JSON 解析错误:', e);
          }
        }
      }

      setIsTyping(false);

      const foods = parseFoodDataFromAI(fullContent);
      if (foods.length > 0) {
        setTimeout(() => {
          foods.forEach((food, index) => {
            setTimeout(() => {
              const today = new Date();
              const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
              const foodMessage: Message = {
                id: `${Date.now()}-food-${index}`,
                type: 'food_card',
                content: '',
                timestamp: new Date().toISOString(),
                foodData: {
                  name: food.name,
                  mealType: food.mealType || '午餐',
                  date: dateStr,
                  weight: food.weight,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fat: food.fat,
                },
              };
              setMessages(prev => [...prev, foodMessage]);
              scrollToBottom();
            }, index * 300);
          });
        }, 500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `${Date.now()}-error`,
        type: 'ai',
        content: '抱歉，出了点问题，请重试~',
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  // 编辑功能
  const handleOpenEdit = (message: Message) => {
    if (!message.foodData) return;
    setEditingMessage(message);
    setEditFormData({
      name: message.foodData.name,
      mealType: message.foodData.mealType,
      weight: String(message.foodData.weight),
      calories: String(message.foodData.calories),
      protein: String(message.foodData.protein),
      carbs: String(message.foodData.carbs),
      fat: String(message.foodData.fat),
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editingMessage) return;
    const updatedFoodData = {
      name: editFormData.name,
      mealType: editFormData.mealType,
      date: editingMessage.foodData?.date || '',
      weight: parseFloat(editFormData.weight) || 0,
      calories: parseFloat(editFormData.calories) || 0,
      protein: parseFloat(editFormData.protein) || 0,
      carbs: parseFloat(editFormData.carbs) || 0,
      fat: parseFloat(editFormData.fat) || 0,
    };
    setMessages(prev => prev.map(msg => 
      msg.id === editingMessage.id ? { ...msg, foodData: updatedFoodData } : msg
    ));
    setEditModalVisible(false);
    setEditingMessage(null);
  };

  // 确认记录
  const handleConfirmFood = async (message: Message) => {
    if (!message.foodData || message.confirmed) return;
    const fd = message.foodData;
    try {
      const today = getTodayString();
      const mealTypeMap: { [key: string]: string } = {
        '早餐': 'breakfast', '午餐': 'lunch', '晚餐': 'dinner', '加餐': 'snack',
      };
      await addRecord({
        date: today,
        meal_type: mealTypeMap[fd.mealType] || 'lunch',
        food_name: fd.name,
        weight: fd.weight,
        calories: fd.calories,
        protein: fd.protein,
        carbs: fd.carbs,
        fat: fd.fat,
      });
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, confirmed: true } : msg
      ));
      setMessages(prev => [...prev, {
        id: `${Date.now()}-confirm`,
        type: 'ai',
        content: `✅ 已记录「${fd.name}」到你的${fd.mealType}`,
        timestamp: new Date().toISOString(),
      }]);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to save food record:', error);
    }
  };

  // 渲染消息
  const renderMessages = () => {
    const elements: JSX.Element[] = [];
    
    messages.forEach((message, index) => {
      const showTime = index === 0 || 
        (messages[index - 1] && 
         new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 5 * 60 * 1000);

      if (showTime && message.type !== 'time_hint') {
        elements.push(
          <View key={`time-${message.id}`} style={styles.timeContainer}>
            <View style={styles.timeBadge}>
              <ThemedText variant="tiny" color={theme.textMuted}>{formatTime(message.timestamp)}</ThemedText>
            </View>
          </View>
        );
      }

      if (message.type === 'user') {
        elements.push(
          <View key={message.id} style={styles.messageRowUser}>
            <View style={styles.userBubble}>
              <ThemedText variant="body" color="#FFFFFF">{message.content}</ThemedText>
            </View>
          </View>
        );
        return;
      }

      if (message.type === 'image' && message.imageUri) {
        elements.push(
          <View key={message.id} style={styles.messageRowUser}>
            <Image 
              source={{ uri: message.imageUri }} 
              style={styles.messageImage} 
              resizeMode="cover" 
            />
          </View>
        );
        return;
      }

      if (message.type === 'ai') {
        elements.push(
          <View key={message.id} style={styles.messageRowAI}>
            <View style={styles.aiAvatar}>
              <Text style={styles.aiAvatarEmoji}>🥦</Text>
            </View>
            <View style={styles.aiBubble}>
              <ThemedText variant="body" color={theme.textPrimary}>{message.content}</ThemedText>
            </View>
          </View>
        );
        return;
      }

      if (message.type === 'food_card' && message.foodData) {
        const fd = message.foodData;
        const isConfirmed = message.confirmed;

        elements.push(
          <View key={message.id} style={styles.messageRowAI}>
            <View style={styles.aiAvatar}>
              <Text style={styles.aiAvatarEmoji}>🥦</Text>
            </View>
            <View style={[styles.foodCard, isConfirmed && styles.foodCardConfirmed]}>
              {isConfirmed && (
                <View style={styles.confirmedBadge}>
                  <FontAwesome6 name="check-circle" size={12} color="#22C55E" />
                  <ThemedText variant="tiny" color="#22C55E">已记录</ThemedText>
                </View>
              )}
              <View style={styles.foodCardHeader}>
                <View style={styles.foodCardTag}>
                  <ThemedText variant="tiny" color="#FFFFFF">{fd.mealType}</ThemedText>
                </View>
                <ThemedText variant="tiny" color={theme.textMuted}>{fd.date}</ThemedText>
              </View>
              <View style={styles.foodCardBody}>
                <View style={styles.foodCalorieCircle}>
                  <ThemedText variant="h4" color={theme.primary}>{fd.calories}</ThemedText>
                  <ThemedText variant="tiny" color={theme.textMuted}>kcal</ThemedText>
                </View>
                <View style={styles.foodInfo}>
                  <ThemedText variant="bodyMedium" color={theme.textPrimary}>{fd.name}</ThemedText>
                  <ThemedText variant="caption" color={theme.textSecondary}>{fd.weight}g</ThemedText>
                  <View style={styles.nutrientRow}>
                    <View style={styles.nutrientItem}>
                      <ThemedText variant="tiny" color={theme.textMuted}>碳水</ThemedText>
                      <ThemedText variant="small" color={theme.textSecondary}>{fd.carbs}g</ThemedText>
                    </View>
                    <View style={styles.nutrientItem}>
                      <ThemedText variant="tiny" color={theme.textMuted}>蛋白质</ThemedText>
                      <ThemedText variant="small" color={theme.textSecondary}>{fd.protein}g</ThemedText>
                    </View>
                    <View style={styles.nutrientItem}>
                      <ThemedText variant="tiny" color={theme.textMuted}>脂肪</ThemedText>
                      <ThemedText variant="small" color={theme.textSecondary}>{fd.fat}g</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.foodCardActions}>
                {!isConfirmed && (
                  <>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleOpenEdit(message)} activeOpacity={0.7}>
                      <FontAwesome6 name="pen" size={14} color={theme.primary} />
                      <ThemedText variant="small" color={theme.primary}>编辑</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmFood(message)} activeOpacity={0.8}>
                      <LinearGradient colors={[theme.primary, '#896BFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirmButtonGradient}>
                        <FontAwesome6 name="check" size={14} color="#FFFFFF" />
                        <ThemedText variant="smallMedium" color="#FFFFFF">确认记录</ThemedText>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
                {isConfirmed && (
                  <TouchableOpacity style={styles.editButton} onPress={() => handleOpenEdit(message)} activeOpacity={0.7}>
                    <FontAwesome6 name="pen" size={14} color={theme.textMuted} />
                    <ThemedText variant="small" color={theme.textMuted}>修改</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
        return;
      }
    });

    return elements;
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      {/* 顶部标题栏 */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <FontAwesome6 name="chevron-left" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarEmoji}>🥦</Text>
          </View>
          <View style={styles.headerInfo}>
            <ThemedText variant="bodyMedium" color={theme.textPrimary}>AI营养助手</ThemedText>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <ThemedText variant="tiny" color={theme.textMuted}>在线</ThemedText>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome6 name="ellipsis-vertical" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* 使用 KeyboardAvoidingView 实现键盘上推 */}
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* 消息列表 */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollToBottom()}
        >
          {renderMessages()}
          {isTyping && (
            <View style={styles.messageRowAI}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarEmoji}>🥦</Text>
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* 底部输入栏 */}
        <View style={[styles.inputBar, { backgroundColor: theme.cardBackground }]}>
          {/* 快捷操作按钮 */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickBtn} 
              onPress={handleTakePhoto} 
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome6 name="camera" size={20} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickBtn} 
              onPress={handlePickImage} 
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome6 name="image" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* 输入行 */}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
              placeholder="问我任何关于营养的问题..."
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.primary : theme.backgroundTertiary }]}
              onPress={handleSendText}
              disabled={!inputText.trim() || isTyping}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="paper-plane" size={18} color={inputText.trim() ? '#FFFFFF' : theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ThemedText variant="tiny" color={theme.textMuted} style={styles.disclaimer}>
            内容由AI生成，仅供参考
          </ThemedText>
        </View>
      </KeyboardAvoidingView>

      {/* 编辑Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === 'web'}>
          <View style={styles.modalOverlay}>
            <View style={[styles.editModal, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.editModalHeader}>
                <ThemedText variant="bodyMedium" color={theme.textPrimary}>编辑食物记录</ThemedText>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <FontAwesome6 name="xmark" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.editField}>
                  <ThemedText variant="small" color={theme.textSecondary}>食物名称</ThemedText>
                  <View style={styles.foodSuggestions}>
                    {COMMON_FOODS.filter(f => f.includes(editFormData.name) || editFormData.name === '').slice(0, 6).map(food => (
                      <TouchableOpacity
                        key={food}
                        style={[styles.foodSuggestion, editFormData.name === food && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                        onPress={() => setEditFormData(prev => ({ ...prev, name: food }))}
                      >
                        <ThemedText variant="small" color={editFormData.name === food ? '#FFFFFF' : theme.textPrimary}>{food}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                    value={editFormData.name}
                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, name: text }))}
                    placeholder="输入食物名称"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                <View style={styles.editField}>
                  <ThemedText variant="small" color={theme.textSecondary}>餐次</ThemedText>
                  <View style={styles.mealTypeSelector}>
                    {MEAL_TYPE_OPTIONS.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.mealTypeOption, editFormData.mealType === type && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                        onPress={() => setEditFormData(prev => ({ ...prev, mealType: type }))}
                      >
                        <ThemedText variant="small" color={editFormData.mealType === type ? '#FFFFFF' : theme.textPrimary}>{type}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.editField}>
                  <ThemedText variant="small" color={theme.textSecondary}>重量 (克)</ThemedText>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                    value={editFormData.weight}
                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, weight: text }))}
                    placeholder="100"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.nutrientsDisplay}>
                  <View style={styles.nutrientDisplayItem}>
                    <ThemedText variant="tiny" color={theme.textMuted}>热量</ThemedText>
                    <ThemedText variant="bodyMedium" color={theme.primary}>{editFormData.calories} kcal</ThemedText>
                  </View>
                  <View style={styles.nutrientDisplayItem}>
                    <ThemedText variant="tiny" color={theme.textMuted}>碳水</ThemedText>
                    <ThemedText variant="bodyMedium" color={theme.textPrimary}>{editFormData.carbs}g</ThemedText>
                  </View>
                  <View style={styles.nutrientDisplayItem}>
                    <ThemedText variant="tiny" color={theme.textMuted}>蛋白质</ThemedText>
                    <ThemedText variant="bodyMedium" color={theme.textPrimary}>{editFormData.protein}g</ThemedText>
                  </View>
                  <View style={styles.nutrientDisplayItem}>
                    <ThemedText variant="tiny" color={theme.textMuted}>脂肪</ThemedText>
                    <ThemedText variant="bodyMedium" color={theme.textPrimary}>{editFormData.fat}g</ThemedText>
                  </View>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                  <LinearGradient colors={[theme.primary, '#896BFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButtonGradient}>
                    <ThemedText variant="bodyMedium" color="#FFFFFF">保存修改</ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Screen>
  );
}
