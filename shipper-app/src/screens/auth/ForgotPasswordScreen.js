import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-open-outline" size={40} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Nhập email hoặc số điện thoại đã đăng ký để nhận mã xác thực.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>THÔNG TIN LIÊN HỆ</Text>
          <CustomInput placeholder="Email hoặc Số điện thoại" icon="mail-outline" />

          <CustomButton 
            title="Gửi yêu cầu" 
            onPress={() => navigation.navigate('OTP')} 
            style={styles.button}
          />
          
          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.backLinkText}>Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 12,
    letterSpacing: 1,
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

export default ForgotPasswordScreen;
