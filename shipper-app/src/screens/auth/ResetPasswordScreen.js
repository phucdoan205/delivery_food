import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { request } from '../../api/client';
import { Alert, useState } from 'react';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email, otp } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const requirements = [
    { label: 'Ít nhất 6 ký tự', met: password.length >= 6 },
    { label: 'Bao gồm chữ và số', met: /[a-zA-Z]/.test(password) && /[0-9]/.test(password) },
    { label: 'Hai mật khẩu khớp nhau', met: password.length > 0 && password === confirmPassword },
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
      <Header />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Ionicons name="bicycle" size={40} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>Đặt lại mật khẩu mới</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập một mật khẩu mới cho tài khoản của bạn.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <CustomInput 
            placeholder="Nhập mật khẩu mới" 
            icon="lock-closed-outline" 
            secureTextEntry 
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setErrorMsg('');
            }}
          />

          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <CustomInput 
            placeholder="Nhập lại mật khẩu mới" 
            icon="refresh-outline" 
            secureTextEntry 
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              setErrorMsg('');
            }}
          />

          <View style={styles.requirements}>
            <Text style={styles.requirementTitle}>Yêu cầu mật khẩu:</Text>
            {requirements.map((req, index) => (
              <View key={index} style={styles.requirementRow}>
                <Ionicons 
                  name={req.met ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={req.met ? "#2ECC71" : COLORS.textLight} 
                />
                <Text style={[styles.requirementText, req.met && { color: COLORS.text, fontWeight: '700' }]}>
                  {req.label}
                </Text>
              </View>
            ))}
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

          <CustomButton 
            title={loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"} 
            onPress={handleResetPassword} 
            disabled={loading}
            style={styles.button}
          />
          
          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="arrow-back-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.backLinkText}>Quay lại đăng nhập</Text>
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
    padding: SIZES.padding,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    fontSize: 26,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  form: {
    width: '100%',
  },
  label: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  requirements: {
    backgroundColor: COLORS.white,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
  },
  requirementTitle: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 15,
    textAlign: 'center',
  },
  successText: {
    color: COLORS.success,
    fontSize: 13,
    marginTop: 15,
    textAlign: 'center',
  },
  button: {
    marginTop: SIZES.padding,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.padding * 1.5,
  },
  backLinkText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
  },
});

export default ResetPasswordScreen;
