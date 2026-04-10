import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

type MembershipTier = {
  name: string;
  price: string;
  duration: string;
  features: string[];
  color: string;
  badge?: string;
};

const membershipTiers: MembershipTier[] = [
  {
    name: '免费版',
    price: '免费',
    duration: '永久',
    color: '#6B7280',
    features: [
      '基础饮食记录',
      '基础运动记录',
      '每日热量计算',
      '体重目标追踪',
    ],
    badge: '当前',
  },
  {
    name: '高级版',
    price: '¥68',
    duration: '月度订阅',
    color: '#F59E0B',
    features: [
      '无限制数据记录',
      'AI 智能饮食建议',
      '详细营养分析报告',
      '个性化运动计划',
      '高级图表统计',
      '无广告体验',
      '专属客服支持',
    ],
  },
  {
    name: '专业版',
    price: '¥598',
    duration: '年度订阅',
    color: '#8B5CF6',
    features: [
      '包含高级版所有功能',
      '深度身体成分分析',
      '一对一营养师咨询',
      '定制化训练方案',
      '数据导出功能',
      '优先新功能体验',
      '家庭成员共享',
    ],
  },
];

type FeatureItem = {
  icon: string;
  label: string;
  color: string;
};

const features: FeatureItem[] = [
  { icon: 'chart-line', label: '数据统计', color: '#3B82F6' },
  { icon: 'robot', label: 'AI 助手', color: '#8B5CF6' },
  { icon: 'file-export', label: '数据导出', color: '#10B981' },
  { icon: 'users', label: '家庭共享', color: '#F59E0B' },
];

export default function MembershipScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSubscribe = (tier: MembershipTier) => {
    if (tier.name === '免费版') return;

    // 订阅功能开发中
    alert('订阅功能开发中');
  };

  return (
    <Screen>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 页面标题 */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>会员中心</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              解锁更多高级功能，全面提升健康管理体验
            </Text>
          </View>

          {/* 会员卡片列表 */}
          {membershipTiers.map((tier) => (
            <View
              key={tier.name}
              style={[
                styles.membershipCard,
                { backgroundColor: theme.backgroundDefault, borderColor: tier.color },
              ]}
            >
              {tier.badge && (
                <View style={[styles.badge, { backgroundColor: tier.color }]}>
                  <Text style={styles.badgeText}>{tier.badge}</Text>
                </View>
              )}

              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.tierName, { color: theme.textPrimary }]}>{tier.name}</Text>
                  <Text style={[styles.tierDuration, { color: theme.textMuted }]}>
                    {tier.duration}
                  </Text>
                </View>
                <Text style={[styles.tierPrice, { color: tier.color }]}>{tier.price}</Text>
              </View>

              <View style={styles.featureList}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <FontAwesome6 name="check" size={16} color={tier.color} />
                    <Text style={[styles.featureText, { color: theme.textSecondary }]}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  { backgroundColor: tier.color },
                  tier.name === '免费版' && styles.disabledButton,
                ]}
                onPress={() => handleSubscribe(tier)}
                disabled={tier.name === '免费版'}
              >
                <Text style={styles.subscribeButtonText}>
                  {tier.name === '免费版' ? '当前使用' : '立即订阅'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* 功能亮点 */}
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>功能亮点</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature) => (
                <View key={feature.label} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                    <FontAwesome6 name={feature.icon as any} size={24} color={feature.color} />
                  </View>
                  <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>
                    {feature.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 常见问题 */}
          <View style={styles.faqSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>常见问题</Text>
            <View style={[styles.faqItem, { backgroundColor: theme.backgroundDefault }]}>
              <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>
                如何取消订阅？
              </Text>
              <Text style={[styles.faqAnswer, { color: theme.textMuted }]}>
                您可以在应用内随时取消订阅，取消后将在当前订阅周期结束后停止计费。
              </Text>
            </View>
            <View style={[styles.faqItem, { backgroundColor: theme.backgroundDefault }]}>
              <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>
                支持哪些支付方式？
              </Text>
              <Text style={[styles.faqAnswer, { color: theme.textMuted }]}>
                目前支持微信支付、支付宝和 Apple Pay。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
