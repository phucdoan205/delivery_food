import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { request } from '../../api/client';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [vehicle, setVehicle] = useState('Xe máy');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, SĐT, Email, Mật khẩu)');
      return;
    }

    setLoading(true);
    try {
      await request('/auth/register', {
        method: 'POST',
        body: {
          fullName,
          email,
          password,
          role: 'shipper'
        }
      });
      Alert.alert('Thành công', 'Đăng ký tài khoản shipper thành công, hệ thống đang chờ phê duyệt.');
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Đăng ký thất bại', error.message || 'Không thể đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Trở thành Đối tác</Text>
        <Text style={styles.subtitle}>Gia nhập đội ngũ giao hàng cao cấp và gia tăng thu nhập của bạn mỗi ngày.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Họ và Tên *</Text>
          <CustomInput 
            placeholder="Nhập họ và tên đầy đủ" 
            icon="person-outline" 
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Số điện thoại *</Text>
          <CustomInput 
            placeholder="09xx xxx xxx" 
            icon="call-outline" 
            keyboardType="phone-pad" 
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Email *</Text>
          <CustomInput 
            placeholder="example@email.com" 
            icon="mail-outline" 
            keyboardType="email-address" 
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Mật khẩu *</Text>
          <CustomInput 
            placeholder="••••••••" 
            icon="lock-closed-outline" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>CMND/CCCD hoặc GPLX</Text>
          <CustomInput 
            placeholder="Nhập số giấy tờ" 
            icon="card-outline" 
            value={documentId}
            onChangeText={setDocumentId}
          />

          <Text style={styles.label}>Phương tiện</Text>
          <CustomInput 
            placeholder="Chọn loại xe" 
            icon="bicycle-outline" 
            value={vehicle}
            onChangeText={setVehicle}
          />

          <Text style={styles.label}>Thành phố</Text>
          <CustomInput 
            placeholder="Chọn khu vực" 
            icon="business-outline" 
            value={city}
            onChangeText={setCity}
          />

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : (
            <CustomButton 
              title="Đăng ký ngay" 
              onPress={handleRegister} 
              style={styles.button}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    fontSize: 26,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  form: {
    marginTop: SIZES.base,
  },
  label: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  button: {
    marginTop: SIZES.padding,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
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

export default RegisterScreen;
