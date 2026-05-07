import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mapType, setMapType] = useState('google');

  const SettingItem = ({ icon, title, subtitle, rightElement, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingIconBox}>
        <Ionicons name={icon} size={22} color={COLORS.secondary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Cài đặt ứng dụng" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>CẤU HÌNH HỆ THỐNG</Text>
           <View style={styles.card}>
              <SettingItem 
                icon="globe-outline" 
                title="Ngôn ngữ" 
                subtitle="Tiếng Việt" 
                rightElement={<Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />}
              />
              <SettingItem 
                icon="notifications-outline" 
                title="Thông báo" 
                subtitle="Âm thanh và rung" 
                rightElement={
                  <Switch 
                    value={notifications} 
                    onValueChange={setNotifications}
                    trackColor={{ false: COLORS.border, true: COLORS.secondary }}
                    thumbColor={COLORS.white}
                  />
                }
              />
              <SettingItem 
                icon="moon-outline" 
                title="Chế độ tối" 
                subtitle="Tự động theo hệ thống" 
                rightElement={
                  <Switch 
                    value={darkMode} 
                    onValueChange={setDarkMode}
                    trackColor={{ false: COLORS.border, true: COLORS.secondary }}
                    thumbColor={COLORS.white}
                  />
                }
              />
           </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>BẢN ĐỒ & ĐIỀU HƯỚNG</Text>
           <View style={styles.card}>
              <TouchableOpacity 
                style={styles.mapOption} 
                onPress={() => setMapType('google')}
              >
                 <View style={styles.mapIconBox}>
                    <Ionicons name="map" size={20} color="#4285F4" />
                 </View>
                 <View style={styles.mapInfo}>
                    <Text style={styles.mapTitle}>Google Maps</Text>
                    <Text style={styles.mapBadge}>Khuyên dùng</Text>
                 </View>
                 <View style={[styles.radio, mapType === 'google' && styles.radioActive]}>
                    {mapType === 'google' && <View style={styles.radioInner} />}
                 </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.mapOption, { borderBottomWidth: 0 }]} 
                onPress={() => setMapType('waze')}
              >
                 <View style={[styles.mapIconBox, { backgroundColor: '#F39C1210' }]}>
                    <Ionicons name="navigate" size={20} color="#F39C12" />
                 </View>
                 <View style={styles.mapInfo}>
                    <Text style={styles.mapTitle}>Waze</Text>
                    <Text style={[styles.mapBadge, { color: COLORS.textSecondary }]}>Điều hướng cộng đồng</Text>
                 </View>
                 <View style={[styles.radio, mapType === 'waze' && styles.radioActive]}>
                    {mapType === 'waze' && <View style={styles.radioInner} />}
                 </View>
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>DUNG LƯỢNG</Text>
           <View style={styles.card}>
              <TouchableOpacity style={styles.storageItem}>
                 <View style={[styles.settingIconBox, { backgroundColor: '#E74C3C10' }]}>
                    <Ionicons name="trash-outline" size={22} color={COLORS.error} />
                 </View>
                 <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Xóa bộ nhớ đệm</Text>
                    <Text style={styles.settingSubtitle}>Đã dùng 128 MB</Text>
                 </View>
                 <Text style={styles.actionText}>Xóa ngay</Text>
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.versionInfo}>
           <View style={styles.appLogoBox}>
              <Ionicons name="bicycle" size={30} color={COLORS.white} />
           </View>
           <Text style={styles.appName}>Culinary Courier</Text>
           <Text style={styles.versionText}>Phiên bản 2.4.0 (Build 882)</Text>
           <Text style={styles.copyrightText}>© 2024 Culinary Courier Driver. All rights reserved.</Text>
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: SIZES.base,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.h4,
    fontSize: 15,
  },
  settingSubtitle: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mapOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mapIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mapInfo: {
    flex: 1,
  },
  mapTitle: {
    ...FONTS.h4,
    fontSize: 15,
  },
  mapBadge: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.success,
    marginTop: 2,
    fontWeight: '600',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.secondary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 1.5,
  },
  actionText: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontSize: 12,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  appLogoBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    ...FONTS.h2,
    fontSize: 18,
  },
  versionText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  copyrightText: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 12,
  },
});

export default SettingsScreen;
