import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { request } from '../api/client';
import { Alert, ActivityIndicator } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleForgotPassword = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Vui lòng nhập email');
      return;
    }
    try {
      setLoading(true);
      const res = await request('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
      setSuccessMsg(res.message || 'Mã OTP đã được gửi');
      setTimeout(() => {
        navigation.navigate('OTPVerification', { email });
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerDecoration}>
          <View style={styles.iconCircle}>
            <Mail size={40} color={COLORS.primary} />
          </View>
        </View>

        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Đừng lo lắng, ngay cả những người sành ăn nhất cũng có lúc lạc đường. Nhập email của bạn để nhận liên kết khôi phục.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Địa chỉ Email</Text>
          <CustomInput
            placeholder="gourmet@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMsg('');
            }}
            icon={Mail}
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

          <CustomButton 
            title={loading ? "Đang xử lý..." : "Nhận mã OTP"} 
            showArrow={!loading}
            onPress={handleForgotPassword} 
            disabled={loading}
            style={styles.submitBtn}
          />
        </View>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.goBack()}>
          <ArrowLeft size={16} color={COLORS.primary} />
          <Text style={styles.footerText}> Quay lại Đăng nhập</Text>
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
  backBtn: {
    marginTop: SIZES.base,
  },
  headerDecoration: {
    alignItems: 'center',
    marginVertical: 40,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255, 241, 232, 0.5)',
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  form: {
    marginTop: 35,
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 25,
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 27,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  successText: {
    color: '#2ECC71',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  }
});

export default ForgotPasswordScreen;
