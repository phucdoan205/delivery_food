import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="bicycle" size={40} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>Đặt lại mật khẩu mới</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập một mật khẩu mới cho tài khoản của bạn.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <CustomInput placeholder="Nhập mật khẩu mới" icon="lock-closed-outline" secureTextEntry />

          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <CustomInput placeholder="Nhập lại mật khẩu mới" icon="refresh-outline" secureTextEntry />

          <View style={styles.requirements}>
            <Text style={styles.requirementTitle}>Yêu cầu mật khẩu:</Text>
            <View style={styles.requirementRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.textLight} />
              <Text style={styles.requirementText}>Ít nhất 8 ký tự</Text>
            </View>
            <View style={styles.requirementRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.textLight} />
              <Text style={styles.requirementText}>Chứa ít nhất 1 chữ cái và 1 số</Text>
            </View>
          </View>

          <CustomButton 
            title="Cập nhật mật khẩu" 
            onPress={() => navigation.navigate('Login')} 
            style={styles.button}
          />
          
          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => navigation.navigate('Login')}
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
  },
  requirements: {
    backgroundColor: COLORS.white,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
  },
  requirementTitle: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
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

export default ResetPasswordScreen;
