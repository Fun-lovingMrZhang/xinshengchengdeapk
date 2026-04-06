import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { login, register } = useAuth();
  const router = useSafeRouter();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!email.trim()) {
      setError('请输入邮箱');
      return;
    }

    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('请输入用户名');
        return;
      }
      if (password.length < 6) {
        setError('密码至少需要6个字符');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(email.trim(), password);
      } else {
        result = await register(name.trim(), email.trim(), password);
      }

      if (result.success) {
        // 登录/注册成功，导航到首页
        router.replace('/');
      } else {
        setError(result.error || '操作失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    // 跳过登录，直接进入应用（作为游客模式）
    router.replace('/');
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <FontAwesome6 name="leaf" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.appName}>健康助手</Text>
              <Text style={styles.appSlogan}>记录饮食，管理健康</Text>
            </View>

            {/* 表单卡片 */}
            <View style={styles.formCard}>
              {/* Tab 切换 */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, mode === 'login' && styles.tabActive]}
                  onPress={() => {
                    setMode('login');
                    setError('');
                  }}
                >
                  <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                    登录
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, mode === 'register' && styles.tabActive]}
                  onPress={() => {
                    setMode('register');
                    setError('');
                  }}
                >
                  <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                    注册
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 注册时显示用户名输入框 */}
              {mode === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>用户名</Text>
                  <TextInput
                    style={[styles.input, error && name === '' && styles.inputError]}
                    placeholder="请输入用户名"
                    placeholderTextColor={theme.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                  />
                </View>
              )}

              {/* 邮箱 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>邮箱</Text>
                <TextInput
                  style={[styles.input, error && email === '' && styles.inputError]}
                  placeholder="请输入邮箱"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* 密码 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  style={[styles.input, error && password === '' && styles.inputError]}
                  placeholder="请输入密码"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>

              {/* 确认密码（仅注册时显示） */}
              {mode === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>确认密码</Text>
                  <TextInput
                    style={[styles.input, error && confirmPassword === '' && styles.inputError]}
                    placeholder="请再次输入密码"
                    placeholderTextColor={theme.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              )}

              {/* 错误提示 */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {/* 提交按钮 */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {mode === 'login' ? '登录' : '注册'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* 切换登录/注册提示 */}
              <Text style={styles.switchText}>
                {mode === 'login' ? (
                  <>
                    还没有账号？{' '}
                    <Text
                      style={styles.switchLink}
                      onPress={() => {
                        setMode('register');
                        setError('');
                      }}
                    >
                      立即注册
                    </Text>
                  </>
                ) : (
                  <>
                    已有账号？{' '}
                    <Text
                      style={styles.switchLink}
                      onPress={() => {
                        setMode('login');
                        setError('');
                      }}
                    >
                      立即登录
                    </Text>
                  </>
                )}
              </Text>
            </View>

            {/* 游客模式 */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>或</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode}>
              <Text style={styles.guestButtonText}>先逛逛看（游客模式）</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}
