import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowRight, Store, User, Mail, Phone, MapPin, ChefHat, Lock, Calendar, FileText } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { request, setToken } from '../../api/client';

const RegisterMerchantScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    type: 'Ẩm thực truyền thống',
    dob: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const foodTypes = ['Ẩm thực truyền thống', 'Đồ ăn nhanh', 'Món chay', 'Hải sản', 'Đồ uống & Trà sữa', 'Bánh ngọt', 'Món Âu', 'Món Á'];

  const handleRegister = async () => {
    const { restaurantName, ownerName, email, phone, address, password, dob, description } = formData;
    if (!restaurantName || !ownerName || !email || !phone || !address || !password || !dob || !description) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả thông tin đăng ký');
      return;
    }

    setLoading(true);
    try {
      // 1. Register user with role = 'merchant'
      const registerRes = await request('/auth/register', {
        method: 'POST',
        body: {
          fullName: ownerName,
          email,
          password,
          phone,
          role: 'merchant',
          dob
        }
      });

      // 2. Set token directly from register response
      setToken(registerRes.token);

      // 3. Create restaurant for this merchant
      await request('/restaurants', {
        method: 'POST',
        body: {
          name: restaurantName,
          address,
          description: description,
            category: formData.type || 'Ẩm thực truyền thống',
          image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop"
        }
      });

      Alert.alert(
        'Đăng ký thành công',
        'Cửa hàng của bạn đang chờ phê duyệt từ Ban quản trị hệ thống.'
      );
      navigation.navigate('Login');
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
        <Text style={styles.subtitle}>Tham gia cùng Crave & Go để mở rộng kinh doanh</Text>
        
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

        <CustomInput
          label="Ngày thành lập"
          placeholder="VD: 12/03/2022"
          value={formData.dob}
          onChangeText={(val) => setFormData({...formData, dob: val})}
          icon={Calendar}
        />

        <CustomInput
          label="Mô tả ngắn"
          placeholder="Giới thiệu về nhà hàng của bạn..."
          value={formData.description}
          onChangeText={(val) => setFormData({...formData, description: val})}
          icon={FileText}
        />

        <View style={{ zIndex: 10, position: 'relative' }}>
          <CustomInput
            label="Loại hình ẩm thực"
            placeholder="Nhập hoặc chọn từ danh sách"
            value={formData.type}
            onChangeText={(val) => {
              setFormData({...formData, type: val});
              setShowDropdown(true);
            }}
            icon={ChefHat}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {showDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 150 }}>
                {foodTypes.filter(t => t.toLowerCase().includes(formData.type.toLowerCase())).map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFormData({...formData, type: item});
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
                {foodTypes.filter(t => t.toLowerCase().includes(formData.type.toLowerCase())).length === 0 && (
                  <View style={styles.dropdownItem}>
                    <Text style={[styles.dropdownItemText, { color: Colors.textSecondary }]}>Bạn sẽ dùng loại hình tự nhập này</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
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
  dropdownList: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 999,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text,
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
