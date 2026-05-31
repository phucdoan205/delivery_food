import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [cccd, setCccd] = useState('');
  const [dob, setDob] = useState('');
  const [vehicleType, setVehicleType] = useState('Xe máy');
  const [licensePlate, setLicensePlate] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [address, setAddress] = useState('TP. Hồ Chí Minh');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !phone || !cccd || !licensePlate || !driverLicense) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các thông tin bắt buộc có dấu *');
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
          phone,
          cccd,
          dob,
          vehicleType,
          licensePlate,
          driverLicense,
          address,
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
    <SafeAreaView edges={['top']} style={styles.container}>
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

          <Text style={styles.label}>Số CCCD *</Text>
          <CustomInput 
            placeholder="Nhập số CCCD" 
            icon="card-outline" 
            value={cccd}
            onChangeText={setCccd}
          />

          <Text style={styles.label}>Ngày sinh</Text>
          <CustomInput 
            placeholder="DD/MM/YYYY" 
            icon="calendar-outline" 
            value={dob}
            onChangeText={setDob}
          />

          <Text style={styles.label}>Loại phương tiện *</Text>
          <View style={styles.vehicleToggleContainer}>
            <TouchableOpacity
              style={[styles.vehicleToggleButton, vehicleType === 'Xe máy' && styles.vehicleToggleButtonActive]}
              onPress={() => setVehicleType('Xe máy')}
            >
              <Ionicons name="bicycle-outline" size={20} color={vehicleType === 'Xe máy' ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.vehicleToggleText, vehicleType === 'Xe máy' && styles.vehicleToggleTextActive]}>Xe máy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.vehicleToggleButton, vehicleType === 'Ô tô' && styles.vehicleToggleButtonActive]}
              onPress={() => setVehicleType('Ô tô')}
            >
              <Ionicons name="car-outline" size={20} color={vehicleType === 'Ô tô' ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.vehicleToggleText, vehicleType === 'Ô tô' && styles.vehicleToggleTextActive]}>Ô tô</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Biển số xe *</Text>
          <CustomInput 
            placeholder="59-X1 234.56" 
            icon="pricetag-outline" 
            value={licensePlate}
            onChangeText={setLicensePlate}
          />

          <Text style={styles.label}>Giấy phép lái xe *</Text>
          <CustomInput 
            placeholder="Mã số giấy phép lái xe" 
            icon="id-card-outline" 
            value={driverLicense}
            onChangeText={setDriverLicense}
          />

          <Text style={styles.label}>Thành phố</Text>
          <CustomInput 
            placeholder="Chọn khu vực" 
            icon="business-outline" 
            value={address}
            onChangeText={setAddress}
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
    </SafeAreaView>
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
  vehicleToggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SIZES.base,
  },
  vehicleToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  vehicleToggleButtonActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  vehicleToggleText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  vehicleToggleTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
