import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Mail, Lock, User, Phone, ArrowLeft, Utensils } from 'lucide-react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
          <Text style={styles.backText}> Quay lại Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Utensils size={30} color={COLORS.white} />
        </View>

        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Bắt đầu hành trình ẩm thực tinh tuyển của bạn ngay hôm nay.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>HỌ VÀ TÊN</Text>
          <CustomInput
            placeholder="Nguyễn Văn A"
            value={name}
            onChangeText={setName}
            icon={User}
          />

          <Text style={styles.label}>ĐỊA CHỈ EMAIL</Text>
          <CustomInput
            placeholder="email@vidu.com"
            value={email}
            onChangeText={setEmail}
            icon={Mail}
          />

          <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
          <CustomInput
            placeholder="+84 (000) 000-000"
            value={phone}
            onChangeText={setPhone}
            icon={Phone}
          />

          <Text style={styles.label}>MẬT KHẨU</Text>
          <CustomInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            icon={Lock}
            secureTextEntry
          />

          <View style={styles.termsContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.termsText}>
              Tôi đồng ý với <Text style={styles.link}>Điều khoản dịch vụ</Text> và <Text style={styles.link}>Chính sách bảo mật.</Text>
            </Text>
          </View>

          <CustomButton 
            title="Tạo tài khoản của tôi" 
            showArrow
            onPress={() => navigation.replace('Main')} 
            style={styles.registerBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Đăng nhập tại đây</Text>
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
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  backText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.extraLarge,
  },
  form: {
    marginTop: SIZES.base,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
    letterSpacing: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.extraLarge,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  registerBtn: {
    height: 60,
    backgroundColor: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.extraLarge,
  },
  footerText: {
    color: COLORS.textLight,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default RegisterScreen;
