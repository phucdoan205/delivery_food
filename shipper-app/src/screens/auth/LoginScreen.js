import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate to Main flow
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1526367790999-0150786486a2?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.headerImage}
          />
          <View style={styles.logoContainer}>
             <Text style={styles.logoText}>CRAVE & CO.</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Chào mừng{"\n"}Đối tác Giao hàng</Text>
          <Text style={styles.subtitle}>Đăng nhập để bắt đầu hành trình mang hương vị tinh tế đến khách hàng.</Text>

          <View style={styles.inputs}>
            <Text style={styles.label}>Email hoặc Số điện thoại</Text>
            <CustomInput 
              placeholder="Nhập email hoặc SĐT của bạn"
              icon="person-outline"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.row}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <CustomInput 
              placeholder="••••••••"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <CustomButton 
            title="Đăng nhập" 
            onPress={handleLogin}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản Đối tác? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 250,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    ...FONTS.h2,
    color: COLORS.white,
    letterSpacing: 2,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    fontSize: 28,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  inputs: {
    marginTop: SIZES.base,
  },
  label: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  forgotText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  button: {
    marginTop: SIZES.padding,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  linkText: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
});

export default LoginScreen;
