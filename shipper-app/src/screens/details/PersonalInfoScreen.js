import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { request } from '../../api/client';
import * as ImagePicker from 'expo-image-picker';

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconBox}>
      <Ionicons name={icon} size={20} color={COLORS.secondary} />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const PersonalInfoScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', avatar: '', cccd: '', dob: '' });

  const fetchProfile = async () => {
    try {
      const data = await request('/auth/profile');
      setProfile(data);
    } catch (err) {
      console.log('Error fetching profile', err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const openEditModal = () => {
    setFormData({
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      avatar: profile?.avatar || '',
      cccd: profile?.cccd || '',
      dob: profile?.dob || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Lỗi", "Họ tên không được để trống!");
      return;
    }
    try {
      setLoading(true);
      await request('/auth/profile', { method: 'PUT', body: formData });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      Alert.alert('Lỗi', 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để chọn avatar!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true
    });
    if (!result.canceled) {
      // Create a data URI with the base64 content
      const base64Data = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFormData(prev => ({ ...prev, avatar: base64Data }));
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header title="Thông tin cá nhân" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
           <View style={styles.avatarContainer}>
              <Image source={{ uri: profile?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + (profile?.fullName || 'Driver') }} style={styles.avatar} />
           </View>
           <Text style={styles.userName}>{profile?.fullName || 'Đang tải...'}</Text>
           <View style={styles.levelBadge}>
              <View style={styles.dot} />
              <Text style={styles.levelText}>Tài xế</Text>
           </View>
        </View>

        <View style={styles.card}>
           <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
              <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                 <Ionicons name="pencil" size={14} color={COLORS.white} />
                 <Text style={styles.editButtonText}>Chỉnh sửa</Text>
              </TouchableOpacity>
           </View>
           
           <View style={styles.infoList}>
              <InfoItem icon="call-outline" label="Số điện thoại" value={profile?.phone || 'Chưa cập nhật'} />
              <InfoItem icon="mail-outline" label="Email" value={profile?.email || 'Chưa cập nhật'} />
              <InfoItem icon="card-outline" label="Số CCCD" value={profile?.cccd || 'Chưa cập nhật'} />
              <InfoItem icon="calendar-outline" label="Ngày sinh" value={profile?.dob || 'Chưa cập nhật'} />
           </View>
        </View>

        <View style={styles.card}>
           <View style={styles.infoItem}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(211, 84, 0, 0.1)' }]}>
                 <Ionicons name="location-outline" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.infoText}>
                 <Text style={styles.infoLabel}>Địa chỉ thường trú</Text>
                 <Text style={styles.subLabel}>Khu vực hoạt động chính</Text>
              </View>
           </View>
           <View style={styles.addressBox}>
              <Text style={styles.addressText}>{profile?.address || 'Chưa cập nhật'}</Text>
           </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa hồ sơ</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <View style={styles.editAvatarSection}>
                <Image 
                  source={{ uri: formData.avatar || profile?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + (profile?.fullName || 'Driver') }} 
                  style={styles.editAvatarImage} 
                />
                <TouchableOpacity style={styles.changeAvatarBtn} onPress={handlePickImage}>
                  <Ionicons name="camera" size={20} color={COLORS.white} />
                  <Text style={{color: COLORS.white, marginLeft: 5}}>Đổi ảnh</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput
                style={styles.inputField}
                value={formData.fullName}
                onChangeText={(t) => setFormData({...formData, fullName: t})}
                placeholder="Nhập họ và tên"
              />

              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.inputField}
                value={formData.phone}
                onChangeText={(t) => setFormData({...formData, phone: t})}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Số CCCD</Text>
              <TextInput
                style={styles.inputField}
                value={formData.cccd}
                onChangeText={(t) => setFormData({...formData, cccd: t})}
                placeholder="Nhập số CCCD"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Ngày sinh</Text>
              <TextInput
                style={styles.inputField}
                value={formData.dob}
                onChangeText={(t) => setFormData({...formData, dob: t})}
                placeholder="VD: 15/05/1992"
              />

              <Text style={styles.inputLabel}>Địa chỉ</Text>
              <TextInput
                style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
                value={formData.address}
                onChangeText={(t) => setFormData({...formData, address: t})}
                placeholder="Nhập địa chỉ của bạn"
                multiline
              />
              
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.base,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  levelText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editButtonText: {
    ...FONTS.body5,
    color: COLORS.white,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  subLabel: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addressBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  addressText: {
    ...FONTS.body4,
    color: COLORS.text,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text
  },
  editAvatarSection: {
    alignItems: 'center',
    marginBottom: 20
  },
  editAvatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.border
  },
  changeAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: -15
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: 5,
    fontWeight: '600'
  },
  inputField: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    ...FONTS.body3,
    color: COLORS.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  saveBtnText: {
    color: COLORS.white,
    ...FONTS.h3
  }
});

export default PersonalInfoScreen;
