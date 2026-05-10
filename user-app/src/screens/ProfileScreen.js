import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { MapPin, ChevronRight, User, MapPin as MapPinIcon, Heart, Bell, Tag, LogOut, ArrowLeft } from 'lucide-react-native';
import { USER_INFO } from '../constants/mockData';

const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    { icon: User, title: 'Chỉnh sửa hồ sơ', color: '#FFF1E8', iconColor: '#B23A00', screen: 'EditProfile' },
    { icon: MapPinIcon, title: 'Quản lý địa chỉ', color: '#E8F5E9', iconColor: '#2E7D32', screen: 'Address' },
    { icon: Heart, title: 'Quán ăn yêu thích', color: '#FCE4EC', iconColor: '#C2185B', screen: 'Favorite' },
    { icon: Bell, title: 'Cài đặt thông báo', color: '#E3F2FD', iconColor: '#1976D2', screen: 'NotificationSettings' },
    { icon: Tag, title: 'Mã giảm giá', color: '#FFF9C4', iconColor: '#FBC02D', badge: 'PRO', screen: 'Voucher' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationHeader}>
          <MapPin size={16} color={COLORS.primary} />
          <Text style={styles.locationText}>Vị trí hiện tại</Text>
          <View style={styles.avatarMiniContainer}>
            <Image source={{ uri: USER_INFO.avatar }} style={styles.avatarMini} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: USER_INFO.avatar }} style={styles.avatar} />
          </View>
          <Text style={styles.userName}>{USER_INFO.name}</Text>
          <Text style={styles.userEmail}>{USER_INFO.email}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ĐƠN HÀNG</Text>
              <Text style={styles.statValue}>{USER_INFO.orders}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ĐIỂM</Text>
              <Text style={styles.statValue}>{USER_INFO.points}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Cài đặt tài khoản</Text>
          {menuItems.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                <item.icon size={20} color={item.iconColor} />
              </View>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FFE8E8' }]}>
              <LogOut size={20} color="#D32F2F" />
            </View>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>THE CULINARY CURATOR</Text>
          <Text style={styles.versionText}>Phiên bản 2.4.0 — Được tạo ra với đam mê cho người sành ăn</Text>
        </View>
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  avatarMiniContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarMini: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: SIZES.padding,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    ...SHADOWS.medium,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    padding: 2,
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFF1E8',
    borderRadius: SIZES.radius,
    paddingVertical: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  menuSection: {
    marginTop: 30,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: SIZES.radius,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE8E8',
  },
  logoutText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
    letterSpacing: 2,
    marginBottom: 5,
  },
  versionText: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  }
});

export default ProfileScreen;
