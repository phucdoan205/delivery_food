import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowRight, Mail } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { request } from '../../api/client';
import { Alert } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleForgotPassword = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Vui lòng nhập email');
      return;
    }
    try {
      setLoading(true);
      const res = await request('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
      setSuccessMsg(res.message || 'Mã OTP đã được gửi');
      setTimeout(() => {
        navigation.navigate('OTP', { email });
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, Platform.OS === 'web' && { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }]} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
          Nhập email đã đăng ký để nhận mã xác thực khôi phục tài khoản.
        </Text>
        
        <CustomInput
          label="Email"
          placeholder="Ví dụ: email@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMsg('');
          }}
          icon={Mail}
        />

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

        <CustomButton
          title={loading ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
          onPress={handleForgotPassword}
          disabled={loading}
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
    marginTop: 20,
    marginBottom: 30,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },
  successText: {
    color: '#2ECC71',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
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
