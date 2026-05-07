import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { currentUser } from '../../constants/mockData';

const ProfileScreen = ({ navigation }) => {
  const MenuItem = ({ icon, title, onPress, color = COLORS.text }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconBox, { backgroundColor: color + '10' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        showBack={false} 
        title="Hồ sơ" 
        rightComponent={
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userId}>ID: {currentUser.id}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F1C40F" />
              <Text style={styles.ratingText}>{currentUser.rating} ({currentUser.reviewsCount} đánh giá)</Text>
            </View>
          </View>
        </View>

        <View style={styles.vehicleCard}>
           <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleLabel}>THÔNG TIN PHƯƠNG TIỆN</Text>
              <Text style={styles.vehicleName}>{currentUser.vehicle.name}</Text>
              <Text style={styles.vehiclePlate}>{currentUser.vehicle.plate}</Text>
              <View style={styles.statusBadge}>
                 <Text style={styles.statusText}>{currentUser.vehicle.status}</Text>
              </View>
           </View>
           <Ionicons name="bicycle" size={80} color="rgba(255,255,255,0.1)" style={styles.vehicleIcon} />
        </View>

        <View style={styles.experienceCard}>
           <Ionicons name="ribbon" size={24} color={COLORS.primary} />
           <View style={styles.expInfo}>
              <Text style={styles.expLabel}>Thâm niên</Text>
              <Text style={styles.expValue}>{currentUser.vehicle.experience}</Text>
           </View>
           <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>CÀI ĐẶT & HỖ TRỢ</Text>
           <View style={styles.menuList}>
              <MenuItem 
                icon="person-outline" 
                title="Thông tin cá nhân" 
                color={COLORS.success}
                onPress={() => navigation.navigate('PersonalInfo')}
              />
              <MenuItem 
                icon="card-outline" 
                title="Tài khoản ngân hàng" 
                color="#8E44AD"
                onPress={() => navigation.navigate('BankAccounts')}
              />
              <MenuItem 
                icon="settings-outline" 
                title="Cài đặt ứng dụng" 
                color={COLORS.secondary}
                onPress={() => navigation.navigate('Settings')}
              />
              <MenuItem 
                icon="help-circle-outline" 
                title="Trung tâm trợ giúp" 
                color={COLORS.error}
                onPress={() => navigation.navigate('HelpCenter')}
              />
           </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
           <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
           <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
           <Text style={styles.footerText}>The Culinary Curator</Text>
        </View>
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
  notifButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.white,
    padding: SIZES.padding / 1.5,
    borderRadius: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: SIZES.padding / 2,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...FONTS.h2,
    fontSize: 22,
  },
  userId: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 8,
  },
  ratingText: {
    ...FONTS.h4,
    fontSize: 11,
    color: '#9A7D0A',
    marginLeft: 4,
  },
  vehicleCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: SIZES.padding,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: SIZES.padding,
  },
  vehicleInfo: {
    flex: 1,
    zIndex: 1,
  },
  vehicleLabel: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    letterSpacing: 1,
  },
  vehicleName: {
    ...FONTS.h2,
    color: COLORS.white,
    marginTop: 4,
  },
  vehiclePlate: {
    ...FONTS.body3,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 12,
  },
  statusText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontSize: 12,
  },
  vehicleIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  experienceCard: {
    backgroundColor: '#FDF2F0',
    borderRadius: 20,
    padding: SIZES.padding / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  expInfo: {
    flex: 1,
    marginLeft: SIZES.base,
  },
  expLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  expValue: {
    ...FONTS.h3,
    fontSize: 16,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: SIZES.base,
  },
  menuList: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: SIZES.base,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  menuTitle: {
    ...FONTS.body3,
    flex: 1,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDEDEC',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  logoutText: {
    ...FONTS.h3,
    color: COLORS.error,
    marginLeft: SIZES.base,
  },
  footer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  footerText: {
    ...FONTS.h2,
    fontSize: 24,
    color: COLORS.border,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
