import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowRight, Eye, CheckCircle2, Circle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { request } from '../../api/client';
import { Alert } from 'react-native';

const ResetPasswordScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
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
    <ScrollView style={[styles.container, Platform.OS === 'web' && { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.brand}>Crave & Co.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Đặt lại mật khẩu mới</Text>
        <Text style={styles.subtitle}>
          Vui lòng thiết lập một mật khẩu mới cho tài khoản của bạn để tiếp tục.
        </Text>
        
        <CustomInput
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrorMsg('');
          }}
          secureTextEntry
          icon={Eye}
        />

        <CustomInput
          label="Xác nhận mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            setErrorMsg('');
          }}
          secureTextEntry
          icon={Eye}
        />

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>YÊU CẦU MẬT KHẨU</Text>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirementRow}>
              {req.met ? (
                <CheckCircle2 size={16} color="#2ECC71" />
              ) : (
                <Circle size={16} color={Colors.textSecondary} />
              )}
              <Text style={[styles.requirementText, req.met && styles.requirementMet]}>
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
          icon={!loading ? ArrowRight : undefined}
          style={styles.updateButton}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLogin}>
          <ChevronLeft size={16} color={Colors.textSecondary} />
          <Text style={styles.backToLoginText}>Quay lại trang Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F8',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 30,
  },
  requirementsContainer: {
    backgroundColor: '#FFF1F0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 10,
    fontWeight: '500',
  },
  requirementMet: {
    color: Colors.text,
    fontWeight: '700',
  },
  updateButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    color: '#2ECC71',
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 5,
  }
});

export default ResetPasswordScreen;
