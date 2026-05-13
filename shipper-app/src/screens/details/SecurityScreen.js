import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const SecurityScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }
    
    // Mock update success
    Alert.alert(
      'Thành công',
      'Mật khẩu của bạn đã được cập nhật',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Mật khẩu & Bảo mật" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={40} color={COLORS.secondary} />
            </View>
            <Text style={styles.title}>Thay đổi mật khẩu</Text>
            <Text style={styles.subtitle}>
                Để bảo vệ tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
            </Text>
        </View>

        <View style={styles.formCard}>
            <Text style={styles.label}>Mật khẩu hiện tại</Text>
            <CustomInput 
                placeholder="Nhập mật khẩu hiện tại" 
                icon="lock-closed-outline" 
                secureTextEntry 
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />

            <View style={styles.divider} />

            <Text style={styles.label}>Mật khẩu mới</Text>
            <CustomInput 
                placeholder="Nhập mật khẩu mới" 
                icon="key-outline" 
                secureTextEntry 
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <CustomInput 
                placeholder="Nhập lại mật khẩu mới" 
                icon="refresh-outline" 
                secureTextEntry 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <View style={styles.requirements}>
                <Text style={styles.requirementTitle}>Yêu cầu mật khẩu:</Text>
                <View style={styles.requirementRow}>
                    <Ionicons name="checkmark-circle" size={16} color={newPassword.length >= 8 ? COLORS.success : COLORS.textLight} />
                    <Text style={[styles.requirementText, newPassword.length >= 8 && {color: COLORS.text}]}>Ít nhất 8 ký tự</Text>
                </View>
                <View style={styles.requirementRow}>
                    <Ionicons name="checkmark-circle" size={16} color={(/\d/.test(newPassword) && /[a-zA-Z]/.test(newPassword)) ? COLORS.success : COLORS.textLight} />
                    <Text style={[styles.requirementText, (/\d/.test(newPassword) && /[a-zA-Z]/.test(newPassword)) && {color: COLORS.text}]}>Chứa ít nhất 1 chữ cái và 1 số</Text>
                </View>
            </View>

            <CustomButton 
                title="Cập nhật mật khẩu" 
                onPress={handleUpdatePassword} 
                style={styles.button}
            />
        </View>

        <TouchableOpacity style={styles.securityItem}>
            <View style={[styles.itemIcon, { backgroundColor: '#E8F6F3' }]}>
                <Ionicons name="finger-print" size={22} color={COLORS.success} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Xác thực vân tay</Text>
                <Text style={styles.itemSubtitle}>Sử dụng vân tay để đăng nhập nhanh hơn</Text>
            </View>
            <TouchableOpacity style={styles.toggle}>
                <View style={styles.toggleTrack}>
                    <View style={styles.toggleThumb} />
                </View>
            </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.securityItem}>
            <View style={[styles.itemIcon, { backgroundColor: '#FEF9E7' }]}>
                <Ionicons name="phone-portrait-outline" size={22} color={COLORS.warning} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Xác thực 2 lớp (2FA)</Text>
                <Text style={styles.itemSubtitle}>Tăng cường bảo mật bằng mã OTP qua SMS</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base * 2,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: SIZES.padding,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: SIZES.padding,
  },
  requirements: {
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  requirementTitle: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  button: {
    marginTop: SIZES.base,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding / 1.2,
    borderRadius: 20,
    marginBottom: SIZES.base * 1.5,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  itemSubtitle: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  toggle: {
    padding: 4,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7E9',
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  }
});

export default SecurityScreen;
