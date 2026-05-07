import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Trở thành Đối tác</Text>
        <Text style={styles.subtitle}>Gia nhập đội ngũ giao hàng cao cấp và gia tăng thu nhập của bạn mỗi ngày.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Họ và Tên</Text>
          <CustomInput placeholder="Nhập họ và tên đầy đủ" icon="person-outline" />

          <Text style={styles.label}>Số điện thoại</Text>
          <CustomInput placeholder="09xx xxx xxx" icon="call-outline" keyboardType="phone-pad" />

          <Text style={styles.label}>Email</Text>
          <CustomInput placeholder="example@email.com" icon="mail-outline" keyboardType="email-address" />

          <Text style={styles.label}>CMND/CCCD hoặc GPLX</Text>
          <CustomInput placeholder="Nhập số giấy tờ" icon="card-outline" />

          <Text style={styles.label}>Phương tiện</Text>
          <CustomInput placeholder="Chọn loại xe" icon="bicycle-outline" editable={false} />

          <Text style={styles.label}>Thành phố</Text>
          <CustomInput placeholder="Chọn khu vực" icon="business-outline" editable={false} />

          <CustomButton 
            title="Đăng ký ngay" 
            onPress={() => navigation.navigate('OTP')} 
            style={styles.button}
          />

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
