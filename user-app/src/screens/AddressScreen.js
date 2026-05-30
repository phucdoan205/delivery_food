import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Home, Search as Briefcase, User, MapPin, Search as Edit2, Trash2, Plus } from 'lucide-react-native';
import { request } from '../api/client';
import MapTilerView from '../components/MapTilerView';

const AddressScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState('Nhà riêng');

  const fetchProfile = async () => {
    try {
      const data = await request('/auth/profile');
      setProfile(data);
    } catch (error) {
      console.log('Error fetching address profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddAddress = () => {
    setModalMode('add');
    setInputText('');
    setInputType('Nhà riêng');
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleEditAddress = (item) => {
    setModalMode('edit');
    setInputText(item.address);
    setInputType(item.type || 'Nhà riêng');
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!inputText || !inputText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ');
      return;
    }
    
    setModalVisible(false);
    setLoading(true);
    try {
      const currentAddresses = profile?.addresses || [];
      let updatedAddresses = [];
      
      if (modalMode === 'add') {
        let baseAddresses = currentAddresses;
        if (baseAddresses.length === 0 && profile?.address) {
          baseAddresses = [{ type: 'Nhà riêng', address: profile.address, isDefault: true }];
        }
        const newAddrObj = {
          type: inputType,
          address: inputText,
          isDefault: baseAddresses.length === 0
        };
        updatedAddresses = [...baseAddresses, newAddrObj];
      } else {
        if (editingItem._id === 'old') {
          updatedAddresses = [{ type: inputType, address: inputText, isDefault: true }];
        } else {
          updatedAddresses = currentAddresses.map(addr => 
            (addr._id === editingItem._id)
              ? { ...addr, address: inputText, type: inputType }
              : addr
          );
        }
      }
      
      const updated = await request('/auth/profile', {
        method: 'PUT',
        body: { addresses: updatedAddresses }
      });
      setProfile(updated);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (itemToSet) => {
    setLoading(true);
    try {
      const currentAddresses = profile?.addresses || [];
      const updatedAddresses = currentAddresses.map(addr => ({
        ...addr,
        isDefault: addr._id === itemToSet._id
      }));
      const updated = await request('/auth/profile', {
        method: 'PUT',
        body: { addresses: updatedAddresses }
      });
      setProfile(updated);
      Alert.alert('Thành công', 'Đã đặt làm địa chỉ mặc định');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể thiết lập mặc định');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (itemToDelete) => {
    Alert.alert('Xác nhận', 'Bạn muốn xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const currentAddresses = profile?.addresses || [];
            const updatedAddresses = currentAddresses.filter(addr => addr._id !== itemToDelete._id);
            // Nếu xóa cái mặc định, phải set 1 cái khác làm mặc định (Backend đã xử lý phần nào, nma frontend xử lý cho an toàn)
            if (itemToDelete.isDefault && updatedAddresses.length > 0) {
                updatedAddresses[0].isDefault = true;
            }
            const updated = await request('/auth/profile', {
              method: 'PUT',
              body: { addresses: updatedAddresses }
            });
            setProfile(updated);
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xóa địa chỉ');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const displayAddresses = profile?.addresses?.length > 0 
    ? profile.addresses 
    : (profile?.address ? [{ _id: 'old', type: 'Nhà riêng', address: profile.address, isDefault: true }] : []);

  const renderAddressItem = ({ item }) => {
    return (
      <View style={styles.addressCard}>
        <View style={[styles.iconContainer, item.isDefault && styles.defaultIconContainer]}>
          <Home size={20} color={COLORS.white} />
        </View>
        <View style={styles.addressInfo}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressType}>{item.type}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>MẶC ĐỊNH</Text>
              </View>
            )}
          </View>
          <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditAddress(item)}>
              <Edit2 size={14} color={COLORS.textLight} />
              <Text style={styles.actionText}>Sửa</Text>
            </TouchableOpacity>
            {!item.isDefault && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleSetDefault(item)}>
                <MapPin size={14} color={COLORS.primary} />
                <Text style={[styles.actionText, { color: COLORS.primary }]}>Đặt mặc định</Text>
              </TouchableOpacity>
            )}
            {!item.isDefault && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteAddress(item)}>
                <Trash2 size={14} color="#E53935" />
                <Text style={[styles.actionText, { color: "#E53935" }]}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.promoCard}>
          <View style={styles.promoInfo}>
            <Text style={styles.promoTitle}>Địa chỉ giao hàng</Text>
            <Text style={styles.promoSubtitle}>
              Lưu địa điểm bạn thường xuyên nhận hàng để đặt món nhanh hơn.
            </Text>
          </View>
          <View style={styles.promoIcon}>
            <MapPin size={40} color={COLORS.white} fill="rgba(255,255,255,0.3)" />
          </View>
        </View>

        <FlatList
          data={displayAddresses}
          renderItem={renderAddressItem}
          keyExtractor={item => item._id || item.address}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.addBtn} onPress={handleAddAddress}>
              <View style={styles.addIconCircle}>
                <Plus size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.addText}>Thêm địa chỉ mới</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.mapContainer}>
          <MapTilerView center={[106.660172, 10.762622]} zoom={12} markers={[{ id: 1, lat: 10.762622, lng: 106.660172, title: 'Địa điểm giao hàng' }]} />
          <View pointerEvents="none" style={styles.mapOverlay}>
            <Text style={styles.mapText}>Bản đồ giao hàng</Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalMode === 'add' ? 'Thêm địa chỉ mới' : 'Sửa địa chỉ'}</Text>
            
            <View style={styles.typeSelector}>
              {['Nhà riêng', 'Công ty', 'Khác'].map((type) => (
                <TouchableOpacity 
                  key={type}
                  style={[styles.typeBtn, inputType === type && styles.typeBtnActive]}
                  onPress={() => setInputType(type)}
                >
                  <Text style={[styles.typeBtnText, inputType === type && styles.typeBtnTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ của bạn..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnTextCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveAddress}>
                <Text style={styles.modalBtnTextSave}>Lưu</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#FF7043',
    borderRadius: 25,
    padding: 20,
    marginTop: 10,
    marginBottom: 25,
    ...SHADOWS.medium,
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  promoSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    lineHeight: 18,
  },
  promoIcon: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    ...SHADOWS.light,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  defaultIconContainer: {
    backgroundColor: COLORS.primary,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  defaultBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.white,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 5,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 15,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E0B0A0',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  mapContainer: {
    height: 120,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  mapSmall: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mapText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  typeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeBtnActive: {
    backgroundColor: '#FFF1E8',
    borderColor: COLORS.primary,
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  typeBtnTextActive: {
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  modalBtnTextCancel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  modalBtnSave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalBtnTextSave: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  }
});

export default AddressScreen;
