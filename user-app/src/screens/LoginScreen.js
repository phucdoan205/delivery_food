import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Mail, Lock, Globe } from 'lucide-react-native';
import { request, setToken } from '../api/client';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      if (data.role !== 'user') {
        setErrorMessage('Tài khoản này không thuộc về khách hàng');
        return;
      }
      setToken(data.token);
      navigation.replace('Main');
    } catch (error) {
      setErrorMessage(error.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.langButton}>
            <Globe size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Chào mừng trở lại</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục hành trình ẩm thực của bạn</Text>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>Địa chỉ Email</Text>
          <CustomInput
            placeholder="ten@vidu.com"
            value={email}
            onChangeText={setEmail}
            icon={Mail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <CustomInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            icon={Lock}
            secureTextEntry
          />

          <View style={styles.forgotContainer}>
            <View style={styles.rememberRow}>
              <View style={styles.checkbox} />
              <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton 
            title={loading ? "Đang xử lý..." : "Đăng nhập"} 
            onPress={handleLogin} 
            disabled={loading}
            style={styles.loginBtn}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
              style={styles.socialIcon} 
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} 
              style={styles.socialIcon} 
            />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    alignItems: 'flex-end',
    marginTop: SIZES.base,
  },
  langButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SIZES.extraLarge,
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.extraLarge * 1.5,
  },
  errorContainer: {
    backgroundColor: '#FDEDEC',
    padding: 12,
    borderRadius: 10,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: '#F5B7B1',
  },
  errorText: {
    color: COLORS.red || '#E74C3C',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    marginTop: SIZES.padding,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 4,
    marginRight: 8,
  },
  rememberText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  loginBtn: {
    height: 60,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.extraLarge,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: SIZES.font,
    fontWeight: '700',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.extraLarge * 2,
  },
  footerText: {
    color: COLORS.textLight,
  },
  registerText: {
    color: COLORS.green,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
