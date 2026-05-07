import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // Auto focus logic would go here in a real app
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Xác thực tài khoản</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mã OTP 6 chữ số đã được gửi đến số điện thoại/email của bạn.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpInputBox}>
              <Text style={styles.otpDigit}>{digit || '•'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Gửi lại mã sau <Text style={styles.timerBold}>59s</Text></Text>
        </View>

        <CustomButton
          title="Xác nhận"
          onPress={() => navigation.navigate('ResetPassword')}
          icon={CheckCircle2}
          style={styles.confirmButton}
        />

        <TouchableOpacity style={styles.changeContact}>
          <Text style={styles.changeContactText}>Thay đổi số điện thoại/email</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
