import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { currentUser } from '../../constants/mockData';

const PersonalInfoScreen = () => {
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

  return (
    <View style={styles.container}>
      <Header title="Thông tin cá nhân" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
           <View style={styles.avatarContainer}>
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarButton}>
                 <Ionicons name="camera" size={20} color={COLORS.white} />
              </TouchableOpacity>
           </View>
           <Text style={styles.userName}>{currentUser.name}</Text>
           <View style={styles.levelBadge}>
              <View style={styles.dot} />
              <Text style={styles.levelText}>{currentUser.level}</Text>
           </View>
        </View>

        <View style={styles.card}>
           <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
              <TouchableOpacity style={styles.editButton}>
                 <Ionicons name="pencil" size={14} color={COLORS.white} />
                 <Text style={styles.editButtonText}>Chỉnh sửa</Text>
              </TouchableOpacity>
           </View>
           
           <View style={styles.infoList}>
              <InfoItem icon="call-outline" label="Số điện thoại" value={currentUser.phone} />
              <InfoItem icon="mail-outline" label="Email" value={currentUser.email} />
              <InfoItem icon="card-outline" label="Số CCCD" value={currentUser.idCard} />
              <InfoItem icon="calendar-outline" label="Ngày sinh" value={currentUser.dob} />
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
              <Text style={styles.addressText}>{currentUser.address}</Text>
           </View>
        </View>

        <View style={styles.statsContainer}>
           <View style={[styles.statBox, { backgroundColor: COLORS.success + '20' }]}>
              <Text style={styles.statLabel}>Điểm tin cậy</Text>
              <View style={styles.statRow}>
                 <Text style={[styles.statValue, { color: COLORS.success }]}>{currentUser.stats.trustScore}</Text>
                 <Ionicons name="star" size={20} color={COLORS.success} />
              </View>
           </View>
           <View style={[styles.statBox, { backgroundColor: COLORS.warning + '20' }]}>
              <Text style={styles.statLabel}>Chuyến đi</Text>
              <View style={styles.statRow}>
                 <Text style={[styles.statValue, { color: COLORS.warning }]}>{currentUser.stats.totalTrips.toLocaleString()}</Text>
                 <Ionicons name="git-merge" size={20} color={COLORS.warning} />
              </View>
           </View>
        </View>

        <TouchableOpacity style={styles.menuItem}>
           <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.secondary} />
           <Text style={styles.menuText}>Mật khẩu & Bảo mật</Text>
           <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
           <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
           <Text style={styles.logoutText}>Đăng xuất</Text>
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
  editAvatarButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userName: {
    ...FONTS.h2,
    fontSize: 26,
    color: COLORS.text,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  levelText: {
    ...FONTS.body4,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  cardTitle: {
    ...FONTS.h3,
    fontSize: 18,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontSize: 11,
    marginLeft: 6,
  },
  infoList: {
    marginTop: SIZES.base,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    ...FONTS.h4,
    fontSize: 15,
    marginTop: 2,
  },
  subLabel: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.textLight,
  },
  addressBox: {
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
    padding: SIZES.base * 1.5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(211, 84, 0, 0.1)',
  },
  addressText: {
    ...FONTS.body4,
    fontSize: 14,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    padding: SIZES.padding / 1.5,
    marginRight: SIZES.base,
  },
  statLabel: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statValue: {
    ...FONTS.h1,
    fontSize: 28,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    padding: SIZES.padding / 1.5,
    borderRadius: 20,
    marginBottom: SIZES.padding,
  },
  menuText: {
    ...FONTS.h4,
    flex: 1,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: '#FDEDEC',
    marginBottom: SIZES.padding * 2,
  },
  logoutText: {
    ...FONTS.h3,
    color: COLORS.error,
    marginLeft: SIZES.base,
  },
});

export default PersonalInfoScreen;
