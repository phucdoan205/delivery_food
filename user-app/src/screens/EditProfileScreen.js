import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, User, Phone, Mail, Lock, Search as Camera } from 'lucide-react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { USER_INFO } from '../constants/mockData';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState(USER_INFO.name);
  const [phone, setPhone] = useState(USER_INFO.phone);
  const [email, setEmail] = useState(USER_INFO.email);
  const [currentPassword, setCurrentPassword] = useState('********');
  const [newPassword, setNewPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1627087820883-7a102b79179a?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={16} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userSince}>Thành viên từ 2023</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>HỌ VÀ TÊN</Text>
            <CustomInput
              value={name}
              onChangeText={setName}
              placeholder="Họ và tên"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
            <CustomInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <CustomInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Bảo mật</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MẬT KHẨU HIỆN TẠI</Text>
            <CustomInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="********"
              secureTextEntry
              showEyeIcon
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>MẬT KHẨU MỚI</Text>
            <CustomInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry
              showEyeIcon
            />
          </View>
        </View>

        <CustomButton 
          title="Lưu thay đổi" 
          onPress={() => navigation.goBack()} 
          style={styles.saveBtn}
        />
        
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Hủy bỏ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 55,
    right: width * 0.5 - 60,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
  },
  userSince: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 5,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radiusLarge,
    marginBottom: 20,
    ...SHADOWS.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  }
});

export default EditProfileScreen;
