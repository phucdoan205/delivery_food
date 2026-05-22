import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { request } from '../../api/client';

const HistoryScreen = ({ navigation }) => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const data = await request('/orders/shipper');
      const completed = data.filter(o => o.status === 'completed');
      setCompletedOrders(completed);
    } catch (error) {
      console.log('Error fetching completed shipper orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    const orderTime = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong';

    return (
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.idContainer}>
            <Text style={styles.orderId}>#{item._id.substring(item._id.length - 6).toUpperCase()}</Text>
            <Text style={styles.timeText}>{orderTime}</Text>
          </View>
          <Text style={styles.amountText}>{item.totalPrice?.toLocaleString()}đ</Text>
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, { backgroundColor: '#A04000' }]} />
            <View style={styles.line} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Cửa hàng</Text>
              <Text style={styles.locationName} numberOfLines={1}>{item.restaurantId?.name || 'Cửa hàng'}</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Khách hàng</Text>
              <Text style={styles.locationName} numberOfLines={1}>{item.deliveryAddress || 'Địa chỉ giao hàng'}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const todayEarnings = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <View style={styles.container}>
      <Header 
        showBack={false} 
        title="Lịch sử giao hàng" 
        rightComponent={
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.text} />
            <Text style={styles.filterText}>Hôm nay</Text>
          </TouchableOpacity>
        }
      />
      
      <View style={styles.summaryContainer}>
         <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TỔNG THU NHẬP HÔM NAY</Text>
            <Text style={styles.summaryValue}>{todayEarnings.toLocaleString()}đ</Text>
            <View style={styles.growthBadge}>
               <Ionicons name="trending-up" size={14} color={COLORS.white} />
               <Text style={styles.growthText}>+100%</Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={[styles.miniCard, { marginRight: SIZES.base }]}>
               <Text style={styles.miniLabel}>ĐƠN HOÀN THÀNH</Text>
               <Text style={styles.miniValue}>{completedOrders.length} <Text style={{fontSize: 14, color: COLORS.success}}>Chuyến</Text></Text>
            </View>
            <View style={styles.miniCard}>
               <Text style={styles.miniLabel}>QUÃNG ĐƯỜNG</Text>
               <Text style={styles.miniValue}>{completedOrders.length * 3} <Text style={{fontSize: 14, color: COLORS.secondary}}>km</Text></Text>
            </View>
         </View>
      </View>

      <FlatList
        data={completedOrders}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 40, backgroundColor: COLORS.white, borderRadius: 20, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textSecondary }}>Bạn chưa hoàn thành chuyến giao hàng nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  filterText: {
    ...FONTS.h4,
    marginLeft: 6,
    fontSize: 12,
  },
  summaryContainer: {
    padding: SIZES.padding,
  },
  summaryCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  summaryLabel: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    letterSpacing: 1,
  },
  summaryValue: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 36,
    marginVertical: 4,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  growthText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FAD7A0',
    borderRadius: 20,
    padding: SIZES.base * 1.5,
    opacity: 0.6,
  },
  miniLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 9,
    letterSpacing: 1,
  },
  miniValue: {
    ...FONTS.h2,
    fontSize: 24,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    flexGrow: 1,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SIZES.padding / 1.5,
    marginBottom: SIZES.base * 1.5,
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
    marginBottom: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.base,
  },
  orderId: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontSize: 12,
  },
  timeText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  amountText: {
    ...FONTS.h3,
    color: COLORS.success,
  },
  timeline: {
    marginTop: SIZES.base,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 10,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    left: 4.5,
    top: 15,
    bottom: 0,
    width: 1,
    backgroundColor: COLORS.border,
    height: 25,
  },
  locationInfo: {
    flex: 1,
    marginBottom: 10,
  },
  locationLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  locationName: {
    ...FONTS.h4,
    color: COLORS.text,
    fontSize: 13,
  },
});

export default HistoryScreen;
