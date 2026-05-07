import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Switch, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import StatCard from '../../components/StatCard';
import OrderCard from '../../components/OrderCard';
import { currentUser, newOrders } from '../../constants/mockData';

const ReadyScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
        <View style={styles.userText}>
          <Text style={styles.userName}>Crave & Co. Driver</Text>
          <View style={styles.onlineBadge}>
             <View style={[styles.dot, { backgroundColor: isOnline ? COLORS.success : COLORS.textLight }]} />
             <Text style={styles.onlineText}>{isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'}</Text>
          </View>
        </View>
      </View>
      <Switch 
        value={isOnline} 
        onValueChange={setIsOnline} 
        trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <StatCard 
        label="Thu nhập hôm nay" 
        value={currentUser.stats.todayIncome.toLocaleString() + 'đ'} 
        style={styles.statCard}
      />
      <StatCard 
        label="Số đơn đã giao" 
        value={currentUser.stats.todayOrders.toString()} 
        style={styles.statCard}
      />
    </View>
  );

  const renderMapPreview = () => (
    <View style={styles.mapContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop' }} 
        style={styles.mapImage}
      />
      <View style={styles.mapOverlay}>
        <View style={styles.locationBadge}>
          <Ionicons name="navigate" size={16} color={COLORS.primary} />
          <Text style={styles.locationText}>Quận 1, TP.HCM</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        
        <View style={styles.card}>
          {renderMapPreview()}
          {renderStats()}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng mới</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{newOrders.length} ĐANG CHỜ</Text>
          </View>
        </View>

        {newOrders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onAccept={() => navigation.navigate('PickupConfirmation')}
            onReject={() => {}}
          />
        ))}

        <TouchableOpacity style={styles.hotZoneCard}>
          <View style={styles.hotZoneInfo}>
            <Text style={styles.hotZoneTitle}>Khu vực nóng</Text>
            <Text style={styles.hotZoneSubtitle}>Nhu cầu cao tại Quận 3 - x1.2 thu nhập</Text>
          </View>
          <TouchableOpacity style={styles.mapButton}>
             <Text style={styles.mapButtonText}>Xem bản đồ</Text>
          </TouchableOpacity>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
  },
  userName: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  onlineText: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: SIZES.base,
  },
  locationBadge: {
    position: 'absolute',
    top: SIZES.base,
    left: SIZES.base,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    ...FONTS.h4,
    fontSize: 12,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SIZES.base,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: SIZES.base / 2,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    ...FONTS.h2,
    fontSize: 20,
  },
  badge: {
    backgroundColor: 'rgba(230, 126, 34, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    ...FONTS.h4,
    fontSize: 10,
    color: COLORS.primary,
  },
  hotZoneCard: {
    backgroundColor: '#FEF5E7',
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
    marginBottom: SIZES.padding * 2,
  },
  hotZoneInfo: {
    flex: 1,
  },
  hotZoneTitle: {
    ...FONTS.h3,
    color: '#935116',
  },
  hotZoneSubtitle: {
    ...FONTS.body4,
    fontSize: 12,
    color: '#935116',
    marginTop: 2,
  },
  mapButton: {
    backgroundColor: '#935116',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapButtonText: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.white,
  },
});

export default ReadyScreen;
