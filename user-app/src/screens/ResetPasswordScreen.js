import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Lock, ArrowLeft, Check } from 'lucide-react-native';

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements = [
    { text: 'Ít nhất 8 ký tự', met: true },
    { text: 'Bao gồm chữ hoa và chữ thường', met: false },
    { text: 'Bao gồm số hoặc ký tự đặc biệt', met: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
              onChangeText={setPassword}
              icon={Lock}
              secureTextEntry
              showEyeIcon
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Xác nhận mật khẩu mới</Text>
            <CustomInput
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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

            <CustomButton 
              title="Cập nhật mật khẩu" 
              showArrow
              onPress={() => navigation.navigate('Login')} 
              style={styles.submitBtn}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
          <ArrowLeft size={16} color={COLORS.textLight} />
          <Text style={styles.footerText}> Quay lại trang Đăng nhập</Text>
        </TouchableOpacity>
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
    marginTop: 30,
    backgroundColor: COLORS.primary,
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
