import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Mail, ArrowLeft } from 'lucide-react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop' }} 
            style={styles.image} 
          />
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 24 }}>🔄</Text>
          </View>
        </View>

        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Đừng lo lắng, ngay cả những người sành ăn nhất cũng có lúc lạc đường. Nhập email của bạn để nhận liên kết khôi phục.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Địa chỉ Email</Text>
          <CustomInput
            placeholder="gourmet@example.com"
            value={email}
            onChangeText={setEmail}
            icon={Mail}
          />

          <CustomButton 
            title="Gửi liên kết khôi phục" 
            showArrow
            onPress={() => navigation.navigate('OTPVerification')} 
            style={styles.submitBtn}
          />
        </View>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.goBack()}>
          <ArrowLeft size={16} color={COLORS.primary} />
          <Text style={styles.footerText}> Quay lại Đăng nhập</Text>
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
  backBtn: {
    marginTop: SIZES.base,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 30,
    transform: [{ rotate: '5deg' }],
  },
  iconCircle: {
    position: 'absolute',
    bottom: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  form: {
    marginTop: 40,
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: SIZES.radiusLarge,
    ...SHADOWS.light,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 10,
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
    fontWeight: 'bold',
    color: COLORS.primary,
  }
});

export default ForgotPasswordScreen;
