import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate to Main app flow
    navigation.replace('Main');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.brand}>Crave & Co.</Text>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }} 
          style={styles.heroImage} 
        />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Chào mừng Đối tác</Text>
        
        <CustomInput
          label="Email/Số điện thoại"
          placeholder="Nhập Email hoặc Số điện thoại"
          value={email}
          onChangeText={setEmail}
          icon={Mail}
        />

        <CustomInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          icon={Lock}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <CustomButton
          title="Đăng nhập"
          onPress={handleLogin}
          icon={ArrowRight}
          style={styles.loginButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản đối tác?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <View style={styles.registerButton}>
              <Text style={styles.registerText}>Đăng ký cửa hàng mới</Text>
            </View>
          </TouchableOpacity>
        </View>
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 20,
  },
  heroImage: {
    width: '90%',
    height: 180,
    borderRadius: 30,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  forgotText: {
    textAlign: 'right',
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 30,
  },
  loginButton: {
    marginBottom: 40,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#FFEBE6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  registerText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  }
});

export default LoginScreen;
