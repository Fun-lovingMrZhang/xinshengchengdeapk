import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

const appInfo = {
  name: '营养追踪',
  version: '1.0.0',
  description: '一款专注于饮食和运动记录的健康管理应用，帮助您轻松追踪营养摄入，达成健康目标。',
  slogan: '记录每一天，健康每一刻',
  year: '2024',
};

const features = [
  { icon: 'utensils', title: '智能饮食记录', description: '轻松记录每餐饮食，自动计算营养摄入' },
  { icon: 'dumbbell', title: '运动追踪', description: '记录运动消耗，全面掌握热量平衡' },
  { icon: 'chart-pie', title: '数据分析', description: '可视化数据报告，科学分析健康状况' },
  { icon: 'target', title: '目标管理', description: '设定健康目标，追踪每日进展' },
];

const policies = [
  { icon: 'file-contract', title: '服务条款', url: '#' },
  { icon: 'shield-halved', title: '隐私政策', url: '#' },
  { icon: 'envelope-open-text', title: '用户协议', url: '#' },
];

const socialLinks = [
  { icon: 'weixin', label: '微信公众号', color: '#07C160' },
  { icon: 'weibo', label: '官方微博', color: '#E6162D' },
  { icon: 'envelope', label: '联系我们', color: '#3B82F6' },
];

export default function AboutScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleOpenLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('无法打开链接:', error);
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* App 图标和名称 */}
          <View style={styles.logoSection}>
            <View style={styles.logo}>
              <Text style={{ fontSize: 64 }}>🥦</Text>
            </View>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>{appInfo.name}</Text>
            <Text style={[styles.appSlogan, { color: theme.textMuted }]}>{appInfo.slogan}</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v{appInfo.version}</Text>
            </View>
          </View>

          {/* App 简介 */}
          <View style={[styles.introCard, { backgroundColor: theme.backgroundDefault }]}>
            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              {appInfo.description}
            </Text>
          </View>

          {/* 核心功能 */}
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>核心功能</Text>
            {features.map((feature) => (
              <View
                key={feature.title}
                style={[styles.featureCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: `${theme.primary}15` }]}>
                  <FontAwesome6 name={feature.icon as any} size={24} color={theme.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.textMuted }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* 政策链接 */}
          <View style={styles.policiesSection}>
            {policies.map((policy) => (
              <TouchableOpacity
                key={policy.title}
                style={[styles.policyItem, { backgroundColor: theme.backgroundDefault }]}
                onPress={() => handleOpenLink(policy.url)}
              >
                <View style={[styles.policyIcon, { backgroundColor: `${theme.accent}15` }]}>
                  <FontAwesome6 name={policy.icon as any} size={18} color={theme.accent} />
                </View>
                <Text style={[styles.policyText, { color: theme.textSecondary }]}>{policy.title}</Text>
                <FontAwesome6 name="chevron-right" size={14} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* 社交媒体 */}
          <View style={styles.socialSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>关注我们</Text>
            <View style={styles.socialLinks}>
              {socialLinks.map((social) => (
                <TouchableOpacity
                  key={social.label}
                  style={[styles.socialLink, { backgroundColor: theme.backgroundDefault }]}
                  onPress={() => Alert.alert('功能开发中', '社交媒体链接即将上线')}
                >
                  <FontAwesome6 name={social.icon as any} size={20} color={social.color} />
                  <Text style={[styles.socialLabel, { color: theme.textSecondary }]}>
                    {social.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 版权信息 */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              © {appInfo.year} {appInfo.name}. All rights reserved.
            </Text>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Made with ❤️ for healthy living
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
