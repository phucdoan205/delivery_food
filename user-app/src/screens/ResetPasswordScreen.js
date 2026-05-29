import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Lock, ArrowLeft, Check } from 'lucide-react-native';
import { request } from '../api/client';
import { Alert } from 'react-native';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email, otp } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const requirements = [
    { text: 'Ít nhất 6 ký tự', met: password.length >= 6 },
    { text: 'Bao gồm chữ và số', met: /[a-zA-Z]/.test(password) && /[0-9]/.test(password) },
    { text: 'Hai mật khẩu khớp nhau', met: password.length > 0 && password === confirmPassword },
  ];

  const handleResetPassword = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!requirements.every(req => req.met)) {
      setErrorMsg('Vui lòng đáp ứng tất cả yêu cầu mật khẩu');
      return;
    }
    try {
      setLoading(true);
      const res = await request('/auth/reset-password', {
        method: 'POST',
        body: { email, otp, newPassword: password }
      });
      setSuccessMsg(res.message || 'Mật khẩu đã được cập nhật');
      setTimeout(() => {
        navigation.navigate('Login', { email, password });
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Không thể cập nhật mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Crave & Co.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Đặt lại mật khẩu mới</Text>
          <Text style={styles.subtitle}>
            Vui lòng thiết lập một mật khẩu mới cho tài khoản của bạn để tiếp tục.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <CustomInput
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                setErrorMsg('');
              }}
              icon={Lock}
              secureTextEntry
              showEyeIcon
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Xác nhận mật khẩu mới</Text>
            <CustomInput
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                setErrorMsg('');
              }}
              icon={Lock}
              secureTextEntry
              showEyeIcon
            />

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>YÊU CẦU MẬT KHẨU</Text>
              {requirements.map((req, index) => (
                <View key={index} style={styles.requirementRow}>
                  {req.met ? (
                    <Check size={16} color={COLORS.green} />
                  ) : (
                    <View style={styles.unmetCircle} />
                  )}
                  <Text style={[styles.requirementText, req.met && styles.requirementMet]}>
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

            <CustomButton 
              title={loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"} 
              showArrow={!loading}
              onPress={handleResetPassword} 
              disabled={loading}
              style={styles.submitBtn}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
          <ArrowLeft size={16} color={COLORS.textLight} />
          <Text style={styles.footerText}> Quay lại trang Đăng nhập</Text>
        </TouchableOpacity>
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
    paddingBottom: SIZES.padding,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: SIZES.radiusLarge,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 10,
    lineHeight: 20,
    marginBottom: 25,
  },
  form: {
    marginTop: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  requirementsContainer: {
    marginTop: 25,
    backgroundColor: '#FFF5F2',
    padding: 15,
    borderRadius: SIZES.radius,
  },
  requirementsTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unmetCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E0B0A0',
  },
  requirementText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 10,
  },
  requirementMet: {
    color: COLORS.green,
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  },
  successText: {
    color: '#2ECC71',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textLight,
  }
});

export default ResetPasswordScreen;
