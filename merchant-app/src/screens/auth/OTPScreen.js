import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { request } from '../../api/client';

const OTPScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
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
    <ScrollView style={[styles.container, Platform.OS === 'web' && { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Xác thực tài khoản</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email: {email}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              style={[styles.otpInputBox, styles.otpDigit]}
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

        <TouchableOpacity 
          style={[styles.timerContainer, timer > 0 && { opacity: 0.5 }]}
          onPress={handleResendOtp}
          disabled={timer > 0 || resending}
        >
          {resending ? <ActivityIndicator size="small" color={Colors.primary} /> : (
            <Text style={styles.timerText}>
              Gửi lại mã {timer > 0 ? <Text style={styles.timerBold}>{timer}s</Text> : ''}
            </Text>
          )}
        </TouchableOpacity>

        <CustomButton
          title={loading ? "Đang xác thực..." : "Xác nhận"}
          onPress={handleVerifyOtp}
          disabled={loading}
          icon={!loading ? CheckCircle2 : undefined}
          style={styles.confirmButton}
        />

        <TouchableOpacity style={styles.changeContact} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.changeContactText}>Đổi email khác</Text>
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
    padding: 30,
  },
  header: {
    paddingTop: 40,
    marginBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInputBox: {
    width: 48,
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 0,
    textAlign: 'center',
    lineHeight: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
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
  timerContainer: {
    backgroundColor: '#FFF1EF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 100,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timerBold: {
    color: Colors.primary,
    fontWeight: '800',
  },
  confirmButton: {
    marginBottom: 30,
  },
  changeContact: {
    alignItems: 'center',
  },
  changeContactText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  }
});

export default OTPScreen;
