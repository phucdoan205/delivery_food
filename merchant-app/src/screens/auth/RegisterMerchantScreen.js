import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ChevronLeft, ArrowRight, Store, User, Mail, Phone, MapPin, ChefHat } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const RegisterMerchantScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    type: ''
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Trở thành Đối tác</Text>
        <Text style={styles.subtitle}>Tham gia cùng Crave & Co. để mở rộng kinh doanh</Text>
        
        <CustomInput
          label="Tên nhà hàng"
          placeholder="Ví dụ: Bếp Của Mẹ"
          value={formData.restaurantName}
          onChangeText={(val) => setFormData({...formData, restaurantName: val})}
          icon={Store}
        />

        <CustomInput
          label="Tên chủ sở hữu"
          placeholder="Họ và tên"
          value={formData.ownerName}
          onChangeText={(val) => setFormData({...formData, ownerName: val})}
          icon={User}
        />

        <CustomInput
          label="Email"
          placeholder="email@example.com"
          value={formData.email}
          onChangeText={(val) => setFormData({...formData, email: val})}
          icon={Mail}
          keyboardType="email-address"
        />

        <CustomInput
          label="Số điện thoại"
          placeholder="09xx xxx xxx"
          value={formData.phone}
          onChangeText={(val) => setFormData({...formData, phone: val})}
          icon={Phone}
          keyboardType="phone-pad"
        />

        <CustomInput
          label="Địa chỉ kinh doanh"
          placeholder="Số nhà, Tên đường, Phường/Xã..."
          value={formData.address}
          onChangeText={(val) => setFormData({...formData, address: val})}
          icon={MapPin}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loại hình ẩm thực</Text>
          <TouchableOpacity style={styles.dropdown}>
            <ChefHat size={20} color={Colors.textSecondary} style={styles.icon} />
            <Text style={styles.dropdownText}>Chọn loại hình</Text>
            <ChevronLeft size={20} color={Colors.textSecondary} style={{ transform: [{ rotate: '-90deg' }] }} />
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Gửi hồ sơ đăng ký"
          onPress={() => navigation.navigate('OTP')}
          style={styles.registerButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã là đối tác? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Đăng nhập tại đây</Text>
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
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 40,
    padding: 30,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  icon: {
    marginRight: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  }
});

export default RegisterMerchantScreen;
