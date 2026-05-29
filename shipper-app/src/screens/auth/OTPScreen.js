import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { request } from '../../api/client';

const OTPScreen = ({ route, navigation }) => {
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

  const handleChange = (text, index) => {
    setErrorMsg('');
    setSuccessMsg('');
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
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
      <Header />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Xác thực tài khoản</Text>
        <Text style={styles.subtitle}>
          Chúng tôi vừa gửi mã xác thực 6 số đến email{"\n"}
          <Text style={styles.phone}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              style={[styles.otpBox, digit !== '' && styles.activeOtpBox, styles.otpText]}
              value={digit}
              onChangeText={(val) => handleChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Chưa nhận được mã? </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0 || resending}>
            {resending ? <ActivityIndicator size="small" color={COLORS.primary} /> : (
              <Text style={[styles.resendLink, timer > 0 && { color: COLORS.textSecondary }]}>Gửi lại</Text>
            )}
          </TouchableOpacity>
          {timer > 0 && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
            </View>
          )}
        </View>

        <CustomButton 
          title={loading ? "Đang xác thực..." : "Xác nhận"} 
          onPress={handleVerifyOtp} 
          disabled={loading}
          style={styles.button}
        />

        <TouchableOpacity style={styles.changeMethod} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.changeMethodText}>Thay đổi Email</Text>
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
    padding: SIZES.padding,
    alignItems: 'center',
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
    marginBottom: SIZES.padding * 2,
  },
  phone: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SIZES.padding * 1.5,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOtpBox: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  otpText: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    color: COLORS.success,
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  resendText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  resendLink: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  timerContainer: {
    marginLeft: SIZES.base,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timerText: {
    ...FONTS.body4,
    color: COLORS.error,
    fontSize: 12,
  },
  button: {
    width: '100%',
  },
  changeMethod: {
    marginTop: SIZES.padding * 1.5,
  },
  changeMethodText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
});

export default OTPScreen;
