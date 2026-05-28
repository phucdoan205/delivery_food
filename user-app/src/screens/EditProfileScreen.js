import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';

const { width } = Dimensions.get('window');
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, User, Phone, Mail, Lock, Search as Camera } from 'lucide-react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { request } from '../api/client';
import { pickAndUploadImage } from '../utils/cloudinary';

const EditProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [cccd, setCccd] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await request('/auth/profile');
      setName(data.fullName || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setAvatar(data.avatar || '');
      setCccd(data.cccd || '');
      setDob(data.dob || '');
      setAddress(data.address || '');
    } catch (error) {
      console.log('Error fetching profile inside EditProfileScreen:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        fullName: name,
        phone,
        avatar,
        cccd,
        dob,
        address
      };

      if (newPassword.trim()) {
        updateData.password = newPassword;
      }

      await request('/auth/profile', {
        method: 'PUT',
        body: updateData
      });

      Alert.alert('Thành công', 'Cập nhật tài khoản thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handlePickAvatar = async () => {
    try {
      setUploadingImage(true);
      const url = await pickAndUploadImage();
      if (url) {
        setAvatar(url);
        Alert.alert('Thành công', 'Đã tải ảnh lên. Hãy nhấn Lưu thay đổi.');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const profileAvatar = avatar || `https://ui-avatars.com/api/?name=${name || 'U'}&background=E63946&color=fff`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: profileAvatar }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.cameraBtn} onPress={handlePickAvatar} disabled={uploadingImage}>
            {uploadingImage ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Camera size={16} color={COLORS.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{name}</Text>
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
              editable={false}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SỐ CCCD</Text>
            <CustomInput
              value={cccd}
              onChangeText={setCccd}
              placeholder="Nhập số CCCD"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NGÀY SINH</Text>
            <CustomInput
              value={dob}
              onChangeText={setDob}
              placeholder="VD: 15/05/1992"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ĐỊA CHỈ</Text>
            <CustomInput
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>MẬT KHẨU MỚI (ĐỂ TRỐNG NẾU KHÔNG ĐỔI)</Text>
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
          title={saving ? "Đang lưu..." : "Lưu thay đổi"} 
          onPress={handleSave} 
          disabled={saving}
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
