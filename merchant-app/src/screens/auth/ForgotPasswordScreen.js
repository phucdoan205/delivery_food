import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ArrowRight, Mail } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }} 
            style={styles.heroImage} 
          />
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🔄</Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Nhập email hoặc số điện thoại đã đăng ký để nhận mã xác thực khôi phục tài khoản.
        </Text>
        
        <CustomInput
          label="Email / Số điện thoại"
          placeholder="Ví dụ: email@example.com"
          value={email}
          onChangeText={setEmail}
          icon={Mail}
        />

        <CustomButton
          title="Gửi yêu cầu khôi phục"
          onPress={() => navigation.navigate('OTP')}
          icon={ArrowRight}
          style={styles.resetButton}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>Quay lại Đăng nhập</Text>
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
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 10,
  },
  heroContainer: {
    width: '90%',
    height: 200,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    opacity: 0.8,
  },
  logoCircle: {
    position: 'absolute',
    bottom: -30,
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoIcon: {
    fontSize: 32,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  resetButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  }
});

export default ForgotPasswordScreen;
