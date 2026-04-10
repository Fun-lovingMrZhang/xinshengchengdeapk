import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsItem = {
  icon: string;
  label: string;
  description?: string;
  color: string;
  onPress: () => void;
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const router = useSafeRouter();

  // 修改密码弹窗
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 修改用户名弹窗
  const [changeNameModalVisible, setChangeNameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('提示', '新密码至少需要6个字符');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('成功', '密码修改成功');
        setChangePasswordModalVisible(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('失败', data.error || '密码修改失败');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
    }
  };

  const handleChangeName = async () => {
    if (!newName.trim()) {
      Alert.alert('提示', '请输入用户名');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        Alert.alert('成功', '用户名修改成功');
        setChangeNameModalVisible(false);
        setNewName('');
      } else {
        Alert.alert('失败', '用户名修改失败');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请重试');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      '注销账号',
      '确定要注销账号吗？此操作不可恢复，所有数据将被删除。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定注销',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/${user?.id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                // 清除本地数据
                await AsyncStorage.removeItem('auth_user');
                await AsyncStorage.removeItem('is_guest');
                router.replace('/login');
              } else {
                Alert.alert('失败', '账号注销失败');
              }
            } catch (error) {
              Alert.alert('错误', '网络错误，请重试');
            }
          },
        },
      ]
    );
  };

  const settingsItems: SettingsItem[] = [
    {
      icon: 'user',
      label: '修改用户名',
      description: `当前：${user?.name}`,
      color: theme.primary,
      onPress: () => setChangeNameModalVisible(true),
    },
    {
      icon: 'envelope',
      label: '邮箱',
      description: user?.email,
      color: '#3B82F6',
      onPress: () => {
        // 邮箱不可修改
      },
    },
    {
      icon: 'lock',
      label: '修改密码',
      description: '定期更换密码保护账号安全',
      color: '#F59E0B',
      onPress: () => setChangePasswordModalVisible(true),
    },
    {
      icon: 'bell',
      label: '通知设置',
      description: '管理推送通知和提醒',
      color: '#8B5CF6',
      onPress: () => Alert.alert('功能开发中', '通知设置功能即将上线'),
    },
    {
      icon: 'trash-can',
      label: '注销账号',
      description: '删除所有数据，此操作不可恢复',
      color: '#EF4444',
      onPress: handleDeleteAccount,
    },
  ];

  return (
    <Screen>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 页面标题 */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>设置</Text>
          </View>

          {/* 用户信息卡片 */}
          <View style={[styles.userCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 40 }}>🥦</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>{user?.name}</Text>
              <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email}</Text>
            </View>
          </View>

          {/* 设置列表 */}
          <View style={styles.settingsSection}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingItem,
                  { backgroundColor: theme.backgroundDefault, borderBottomColor: theme.border },
                  index === settingsItems.length - 1 && styles.settingItemLast,
                ]}
                onPress={item.onPress}
                disabled={item.icon === 'envelope'}
              >
                <View style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}>
                  <FontAwesome6 name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                  {item.description && (
                    <Text style={[styles.settingDescription, { color: theme.textMuted }]}>
                      {item.description}
                    </Text>
                  )}
                </View>
                <FontAwesome6
                  name="chevron-right"
                  size={14}
                  color={item.icon === 'envelope' ? 'transparent' : theme.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* 版本信息 */}
          <View style={styles.versionInfo}>
            <Text style={[styles.versionText, { color: theme.textMuted }]}>营养追踪 v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* 修改密码弹窗 */}
      <Modal
        visible={changePasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === 'web'}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>修改密码</Text>
                  <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                    <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>旧密码</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      placeholder="请输入旧密码"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>新密码</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="请输入新密码（至少6位）"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>确认密码</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="请再次输入新密码"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => setChangePasswordModalVisible(false)}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleChangePassword}>
                    <Text style={styles.confirmButtonText}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 修改用户名弹窗 */}
      <Modal
        visible={changeNameModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChangeNameModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === 'web'}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>修改用户名</Text>
                  <TouchableOpacity onPress={() => setChangeNameModalVisible(false)}>
                    <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>新用户名</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
                      value={newName}
                      onChangeText={setNewName}
                      placeholder="请输入新用户名"
                      placeholderTextColor={theme.textMuted}
                      autoFocus
                    />
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => setChangeNameModalVisible(false)}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleChangeName}>
                    <Text style={styles.confirmButtonText}>确定</Text>
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
