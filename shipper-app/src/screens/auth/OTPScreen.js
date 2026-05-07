import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['7', '3', '', '', '', '']);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Xác thực tài khoản</Text>
        <Text style={styles.subtitle}>
          Chúng tôi vừa gửi mã xác thực 6 số đến số điện thoại{"\n"}
          <Text style={styles.phone}>+84 987 654 321</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={[styles.otpBox, digit !== '' && styles.activeOtpBox]}>
              <Text style={styles.otpText}>{digit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Chưa nhận được mã? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Gửi lại</Text>
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>00:59</Text>
          </View>
        </View>

        <CustomButton 
          title="Xác nhận" 
          onPress={() => navigation.navigate('ResetPassword')} 
          style={styles.button}
        />

        <TouchableOpacity style={styles.changeMethod}>
          <Text style={styles.changeMethodText}>Thay đổi số điện thoại / Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
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
