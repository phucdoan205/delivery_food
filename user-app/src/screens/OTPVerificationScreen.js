import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { request } from '../api/client';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    setErrorMsg('');
    setSuccessMsg('');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 số OTP');
      return;
    }
    try {
      setLoading(true);
      await request('/auth/verify-reset-otp', {
        method: 'POST',
        body: { email, otp: otpString }
      });
      setSuccessMsg('Xác nhận thành công');
      setTimeout(() => {
        navigation.navigate('ResetPassword', { email, otp: otpString });
      }, 1000);
    } catch (error) {
      setErrorMsg(error.message || 'Mã OTP không đúng hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setResending(true);
      await request('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
      setTimer(60);
      setSuccessMsg('Mã OTP mới đã được gửi');
    } catch (error) {
      setErrorMsg(error.message || 'Có lỗi xảy ra');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Xác thực tài khoản</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email: {email}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              style={[styles.otpBox, { color: COLORS.primary }]}
              value={digit}
              onChangeText={(val) => handleOtpChange(val, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

        <TouchableOpacity 
          style={[styles.resendBtn, timer > 0 && { opacity: 0.5 }]} 
          onPress={handleResendOtp}
          disabled={timer > 0 || resending}
        >
          {resending ? <ActivityIndicator size="small" color={COLORS.primary} /> : (
            <Text style={styles.resendText}>
              Gửi lại mã {timer > 0 ? `sau ${timer}s` : ''}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <CustomButton 
            title={loading ? "Đang xác thực..." : "Xác nhận"} 
            icon={!loading ? CheckCircle : undefined}
            onPress={handleVerifyOtp} 
            disabled={loading}
            style={styles.confirmBtn}
          />
          <TouchableOpacity
            style={styles.changeContactBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.changeContactText}>Đổi email khác</Text>
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
    paddingBottom: SIZES.padding,
  },
  backBtn: {
    marginTop: SIZES.base,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 15,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 24,
    fontWeight: 'bold',
    ...SHADOWS.light,
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
  resendBtn: {
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: '#FFF1E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
  },
  changeContactBtn: {
    alignSelf: 'center',
    marginTop: 20,
  },
  changeContactText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  }
});

export default OTPVerificationScreen;
