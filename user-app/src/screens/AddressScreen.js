import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Home, Search as Briefcase, User, MapPin, Search as Edit2, Trash2, Plus } from 'lucide-react-native';
import { request } from '../api/client';
import MapTilerView from '../components/MapTilerView';

const AddressScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleUpdateAddress = async () => {
    // Custom update prompt fallback or simple placeholder for simplicity
    Alert.prompt(
      'Cập nhật địa chỉ',
      'Nhập địa chỉ giao hàng mới của bạn:',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Cập nhật',
          onPress: async (newAddress) => {
            if (!newAddress || !newAddress.trim()) return;
            setLoading(true);
            try {
              const updated = await request('/auth/profile', {
                method: 'PUT',
                body: { address: newAddress }
              });
              setProfile(updated);
              Alert.alert('Thành công', 'Đã cập nhật địa chỉ mặc định');
            } catch (err) {
              Alert.alert('Lỗi', err.message || 'Không thể cập nhật địa chỉ');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      'plain-text',
      profile?.address || ''
    );
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const addressesData = [
    {
      id: 'default_1',
      type: 'Nhà riêng',
      address: profile?.address || 'Chưa thiết lập địa chỉ',
      isDefault: true
    }
  ];

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
            <TouchableOpacity style={styles.actionBtn} onPress={handleUpdateAddress}>
              <Edit2 size={14} color={COLORS.textLight} />
              <Text style={styles.actionText}>Chỉnh sửa</Text>
            </TouchableOpacity>
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
          data={addressesData}
          renderItem={renderAddressItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.addBtn} onPress={handleUpdateAddress}>
              <View style={styles.addIconCircle}>
                <Plus size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.addText}>Thay đổi địa chỉ mặc định</Text>
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
  }
});

export default AddressScreen;
