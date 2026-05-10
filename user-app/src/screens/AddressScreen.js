import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Home, Search as Briefcase, User, MapPin, Search as Edit2, Trash2, Plus } from 'lucide-react-native';
import { ADDRESSES } from '../constants/mockData';

const AddressScreen = ({ navigation }) => {
  const renderAddressItem = ({ item }) => {
    let Icon = Home;
    if (item.type === 'Công ty') Icon = Briefcase;
    else if (item.type.includes('bạn')) Icon = User;

    return (
      <View style={styles.addressCard}>
        <View style={[styles.iconContainer, item.isDefault && styles.defaultIconContainer]}>
          <Icon size={20} color={item.isDefault ? COLORS.white : COLORS.primary} />
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
            <TouchableOpacity style={styles.actionBtn}>
              <Edit2 size={14} color={COLORS.textLight} />
              <Text style={styles.actionText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Trash2 size={14} color={COLORS.textLight} />
              <Text style={styles.actionText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.promoCard}>
          <View style={styles.promoInfo}>
            <Text style={styles.promoTitle}>Địa chỉ giao hàng</Text>
            <Text style={styles.promoSubtitle}>
              Lưu các địa điểm bạn thường xuyên đặt món để đặt hàng nhanh hơn.
            </Text>
          </View>
          <View style={styles.promoIcon}>
            <MapPin size={40} color={COLORS.white} fill="rgba(255,255,255,0.3)" />
          </View>
        </View>

        <FlatList
          data={ADDRESSES}
          renderItem={renderAddressItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.addBtn}>
              <View style={styles.addIconCircle}>
                <Plus size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.addText}>Thêm địa chỉ mới</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=500&auto=format&fit=crop' }} 
            style={styles.mapSmall}
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapText}>Tìm cửa hàng gần bạn</Text>
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
