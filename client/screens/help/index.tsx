import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: '如何添加饮食记录？',
    answer: '在首页点击"添加饮食"按钮，选择预设食物或手动输入食物名称和份量即可。',
  },
  {
    question: '如何设置体重目标？',
    answer: '在"我的"页面点击"目标体重"旁边的编辑图标，输入您的目标体重即可。',
  },
  {
    question: '如何修改个人信息？',
    answer: '在"我的"页面点击右上角的"个人参数设置"按钮，可以修改性别、年龄、身高、体重等信息。',
  },
  {
    question: '数据会自动保存吗？',
    answer: '是的，所有数据会自动保存到云端，即使更换设备也不会丢失。',
  },
  {
    question: '如何联系客服？',
    answer: '您可以通过"意见反馈"功能提交问题，我们的客服会在24小时内回复。',
  },
];

export default function HelpScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');

  const handleSubmitFeedback = async () => {
    if (!feedbackType || !feedbackContent.trim()) {
      Alert.alert('提示', '请填写反馈类型和内容');
      return;
    }

    try {
      // 反馈提交功能开发中
      Alert.alert('成功', '感谢您的反馈，我们会尽快处理！');
      setFeedbackModalVisible(false);
      setFeedbackType('');
      setFeedbackContent('');
    } catch (error) {
      Alert.alert('错误', '提交失败，请重试');
    }
  };

  const quickLinks = [
    { icon: 'book', label: '使用指南', color: '#3B82F6' },
    { icon: 'life-ring', label: '常见问题', color: '#10B981' },
    { icon: 'headset', label: '联系客服', color: '#F59E0B' },
    { icon: 'star', label: '给我们评分', color: '#EF4444' },
  ];

  return (
    <Screen>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 页面标题 */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>帮助与反馈</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              我们随时为您提供帮助
            </Text>
          </View>

          {/* 快捷入口 */}
          <View style={styles.quickLinksGrid}>
            {quickLinks.map((link) => (
              <TouchableOpacity
                key={link.label}
                style={[styles.quickLinkCard, { backgroundColor: theme.backgroundDefault }]}
                onPress={() => {
                  if (link.label === '常见问题') {
                    // 滚动到 FAQ 区域
                  } else {
                    Alert.alert('功能开发中', '该功能即将上线');
                  }
                }}
              >
                <View style={[styles.quickLinkIcon, { backgroundColor: `${link.color}15` }]}>
                  <FontAwesome6 name={link.icon as any} size={24} color={link.color} />
                </View>
                <Text style={[styles.quickLinkLabel, { color: theme.textSecondary }]}>
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 常见问题 */}
          <View style={styles.faqSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>常见问题</Text>
            {faqs.map((faq, index) => (
              <View
                key={index}
                style={[styles.faqItem, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.faqQuestionRow}>
                  <FontAwesome6
                    name="circle-question"
                    size={18}
                    color={theme.primary}
                    style={styles.faqIcon}
                  />
                  <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>{faq.question}</Text>
                </View>
                <Text style={[styles.faqAnswer, { color: theme.textMuted }]}>{faq.answer}</Text>
              </View>
            ))}
          </View>

          {/* 意见反馈 */}
          <View style={styles.feedbackSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>意见反馈</Text>
            <View style={[styles.feedbackCard, { backgroundColor: theme.backgroundDefault }]}>
              <Text style={[styles.feedbackDescription, { color: theme.textMuted }]}>
                我们非常重视您的意见和建议，您的反馈将帮助我们更好地改进产品。
              </Text>
              <TouchableOpacity
                style={[styles.feedbackButton, { backgroundColor: theme.primary }]}
                onPress={() => setFeedbackModalVisible(true)}
              >
                <FontAwesome6 name="paper-plane" size={18} color="#FFFFFF" />
                <Text style={styles.feedbackButtonText}>提交反馈</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 反馈弹窗 */}
      <Modal
        visible={feedbackModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === 'web'}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>意见反馈</Text>
                  <TouchableOpacity onPress={() => setFeedbackModalVisible(false)}>
                    <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>反馈类型</Text>
                    <View style={styles.feedbackTypes}>
                      {['功能建议', '问题反馈', '使用体验', '其他'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeButton,
                            {
                              backgroundColor:
                                feedbackType === type ? `${theme.primary}15` : theme.backgroundTertiary,
                              borderColor: feedbackType === type ? theme.primary : theme.border,
                            },
                          ]}
                          onPress={() => setFeedbackType(type)}
                        >
                          <Text
                            style={[
                              styles.typeButtonText,
                              {
                                color: feedbackType === type ? theme.primary : theme.textSecondary,
                              },
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>反馈内容</Text>
                    <TextInput
                      style={[
                        styles.textArea,
                        { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary },
                      ]}
                      value={feedbackContent}
                      onChangeText={setFeedbackContent}
                      placeholder="请详细描述您的问题或建议..."
                      placeholderTextColor={theme.textMuted}
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => setFeedbackModalVisible(false)}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleSubmitFeedback}
                  >
                    <Text style={styles.confirmButtonText}>提交</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </Screen>
  );
}
