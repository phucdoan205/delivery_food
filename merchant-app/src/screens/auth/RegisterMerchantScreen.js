import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { ChevronLeft, ArrowRight, Store, User, Mail, Phone, MapPin, ChefHat, Lock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { request, setToken } from '../../api/client';

const RegisterMerchantScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    type: 'Ẩm thực truyền thống'
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { restaurantName, ownerName, email, phone, address, password } = formData;
    if (!restaurantName || !ownerName || !email || !phone || !address || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả thông tin đăng ký');
      return;
    }

    setLoading(true);
    try {
      // 1. Register user with role = 'merchant'
      await request('/auth/register', {
        method: 'POST',
        body: {
          fullName: ownerName,
          email,
          password,
          phone,
          role: 'merchant'
        }
      });

      // 2. Login user to get auth token
      const loginRes = await request('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      setToken(loginRes.token);

      // 3. Create restaurant for this merchant
      await request('/restaurants', {
        method: 'POST',
        body: {
          name: restaurantName,
          address,
          description: formData.type || "Quán ăn đối tác mới đăng ký trên hệ thống",
          image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop"
        }
      });

      Alert.alert(
        'Đăng ký thành công',
        'Cửa hàng của bạn đang chờ phê duyệt từ Ban quản trị hệ thống. Vui lòng đăng nhập lại.',
        [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Lỗi đăng ký', error.message || 'Đã xảy ra lỗi, vui lòng thử lại');
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
          autoCapitalize="none"
        />

        <CustomInput
          label="Mật khẩu tài khoản"
          placeholder="Nhập mật khẩu của bạn"
          value={formData.password}
          onChangeText={(val) => setFormData({...formData, password: val})}
          icon={Lock}
          secureTextEntry
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
            <Text style={styles.dropdownText}>{formData.type}</Text>
            <ChevronLeft size={20} color={Colors.textSecondary} style={{ transform: [{ rotate: '-90deg' }] }} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <CustomButton
            title="Gửi hồ sơ đăng ký"
            onPress={handleRegister}
            style={styles.registerButton}
          />
        )}

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
