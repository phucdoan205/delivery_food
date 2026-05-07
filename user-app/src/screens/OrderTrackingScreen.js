import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Bell, HelpCircle, Phone, MessageSquare, ChevronRight, MapPin } from 'lucide-react-native';

const OrderTrackingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}><Bell size={20} color={COLORS.text} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><HelpCircle size={20} color={COLORS.text} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.mapImage} 
        />
        <View style={styles.driverMarker}>
          <View style={styles.driverPulse} />
          <View style={styles.driverIcon}><Text>🛵</Text></View>
        </View>
        <View style={styles.homeMarker}>
          <View style={styles.homeIcon}><Text>🏠</Text></View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.bottomSheet}>
        <View style={styles.etaCard}>
          <View style={styles.etaIconContainer}>
            <Text style={{ fontSize: 24 }}>🕒</Text>
          </View>
          <View style={styles.etaInfo}>
            <Text style={styles.etaLabel}>Thời gian dự kiến</Text>
            <Text style={styles.etaValue}>15 - 20 phút</Text>
          </View>
          <View style={styles.distanceInfo}>
            <Text style={styles.distLabel}>KHOẢNG CÁCH</Text>
            <Text style={styles.distValue}>2.4 km</Text>
          </View>
        </View>

        <View style={styles.statusSection}>
          <View style={styles.statusLine} />
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>✓</Text></View>
            <View style={[styles.statusDot, styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>🍳</Text></View>
            <View style={[styles.statusDot, styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>🛵</Text></View>
            <View style={styles.statusDot} />
          </View>
          <View style={styles.statusLabels}>
            <Text style={styles.activeStatusLabel}>Đã nhận đơn</Text>
            <Text style={styles.activeStatusLabel}>Đang chuẩn bị</Text>
            <Text style={styles.activeStatusLabel}>Đang giao</Text>
            <Text style={styles.statusLabel}>Hoàn thành</Text>
          </View>
        </View>

        <View style={styles.driverCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' }} 
            style={styles.driverAvatar} 
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Nguyễn Văn Nam</Text>
            <Text style={styles.vehicleInfo}>🛵 Wave Alpha • 29-S1 234.56</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.driverActionBtn}><MessageSquare size={20} color={COLORS.green} /></TouchableOpacity>
            <TouchableOpacity style={[styles.driverActionBtn, { backgroundColor: COLORS.primary }]}><Phone size={20} color={COLORS.white} /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.orderDetailsCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Chi tiết đơn hàng</Text>
            <TouchableOpacity><Text style={styles.viewOrder}>XEM ĐƠN</Text></TouchableOpacity>
          </View>
          <View style={styles.orderItem}>
            <View style={styles.itemIcon}><Text>🍱</Text></View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Cơm Tấm Phúc Lộc Thọ</Text>
              <Text style={styles.itemMeta}>2 món • Cơm tấm sườn bì chả...</Text>
            </View>
            <Text style={styles.itemPrice}>115.000đ</Text>
          </View>
          <View style={styles.addrRow}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.addrText}>123 Lê Lợi, Phường Bến Thành, Quận 1</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 2,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  driverMarker: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(178, 58, 0, 0.2)',
  },
  driverIcon: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  homeMarker: {
    position: 'absolute',
    top: '70%',
    right: '20%',
  },
  homeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  bottomSheet: {
    flex: 1,
    marginTop: -30,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SIZES.padding,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radiusLarge,
    ...SHADOWS.medium,
    marginBottom: 20,
  },
  etaIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  etaInfo: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  etaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  distanceInfo: {
    alignItems: 'flex-end',
  },
  distLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  distValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusSection: {
    paddingVertical: 10,
    marginBottom: 25,
  },
  statusLine: {
    position: 'absolute',
    top: 25,
    left: 30,
    right: 30,
    height: 2,
    backgroundColor: COLORS.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  statusDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    width: 60,
    textAlign: 'center',
  },
  activeStatusLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    width: 60,
    textAlign: 'center',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E8',
    padding: 15,
    borderRadius: SIZES.radiusLarge,
    marginBottom: 20,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 15,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  vehicleInfo: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 10,
  },
  driverActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  orderDetailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: 20,
    ...SHADOWS.light,
    marginBottom: 50,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewOrder: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemMeta: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addrText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 8,
    flex: 1,
  }
});

export default OrderTrackingScreen;
