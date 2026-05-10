import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

const OTPVerificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Xác thực tài khoản</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mã OTP 6 chữ số đã được gửi đến số điện thoại/email của bạn.
        </Text>

        <View style={styles.otpContainer}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <View key={idx} style={styles.otpBox}>
              <Text style={styles.otpValue}>{idx < 2 ? [4, 8][idx] : '•'}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.resendBtn}>
          <Text style={styles.resendText}>Gửi lại mã sau <Text style={{ color: COLORS.primary }}>59s</Text></Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <CustomButton 
            title="Xác nhận" 
            icon={CheckCircle}
            onPress={() => navigation.navigate('ResetPassword')} 
            style={styles.confirmBtn}
          />
          <TouchableOpacity
            style={styles.changeContactBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.changeContactText}>Thay đổi số điện thoại/email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
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
    width: 50,
    height: 60,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  otpValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
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
