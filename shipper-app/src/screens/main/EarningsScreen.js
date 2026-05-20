import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { request } from '../../api/client';

const EarningsScreen = ({ navigation }) => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEarningsData = async () => {
    try {
      const data = await request('/orders/shipper');
      const completed = data.filter(o => o.status === 'completed');
      setCompletedOrders(completed);
    } catch (error) {
      console.log('Error fetching completed shipper orders for earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEarningsData();
    });
    return unsubscribe;
  }, [navigation]);

  const renderTransaction = ({ item }) => {
    const orderTime = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong';
    return (
      <View style={styles.transactionCard}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
          <Ionicons 
            name="bicycle-outline" 
            size={24} 
            color={COLORS.success} 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>
            {`Đơn hàng #${item._id.substring(item._id.length - 6).toUpperCase()}`}
          </Text>
          <Text style={styles.transactionTime}>
            {orderTime} • {item.paymentMethod === 'cash' ? 'Tiền mặt' : 'Online'}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={styles.amountValue}>+{item.totalPrice?.toLocaleString()}đ</Text>
          <Text style={styles.statusText}>Hoàn thành</Text>
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

  // Generate charts data based on last 7 days completed orders or mock placeholder matching actual total
  const dailyEarnings = [
    { day: 'T2', value: todayEarnings * 0.1 },
    { day: 'T3', value: todayEarnings * 0.15 },
    { day: 'T4', value: todayEarnings * 0.2 },
    { day: 'T5', value: todayEarnings * 0.12 },
    { day: 'T6', value: todayEarnings * 0.25 },
    { day: 'T7', value: todayEarnings * 0.3 },
    { day: 'CN', value: todayEarnings }
  ];

  return (
    <View style={styles.container}>
      <Header 
        showBack={false} 
        title="Thu nhập" 
        rightComponent={
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeBadgeText}>HÔM NAY</Text>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
           <Text style={styles.mainLabel}>Tổng thu nhập hôm nay</Text>
           <Text style={styles.mainValue}>{todayEarnings.toLocaleString()}đ</Text>
           <View style={styles.growthBadge}>
              <Ionicons name="trending-up" size={14} color={COLORS.white} />
              <Text style={styles.growthText}>+100% so với hôm qua</Text>
           </View>
        </View>

        <View style={styles.statsRow}>
           <View style={styles.statBox}>
              <Text style={styles.statLabel}>Số đơn hoàn thành</Text>
              <Text style={styles.statValue}>{completedOrders.length} <Text style={{fontSize: 14, color: COLORS.success}}>đơn</Text></Text>
           </View>
           <View style={styles.statBox}>
              <Text style={styles.statLabel}>Thời gian làm việc</Text>
              <Text style={styles.statValue}>{completedOrders.length * 0.5} <Text style={{fontSize: 14, color: COLORS.secondary}}>giờ</Text></Text>
           </View>
        </View>

        <View style={styles.performanceSection}>
           <View style={styles.sectionHeader}>
              <View>
                 <Text style={styles.sectionTitle}>Hiệu suất tuần</Text>
                 <Text style={styles.sectionSubtitle}>Biểu đồ phân bổ thu nhập dự kiến</Text>
              </View>
           </View>

           {/* Simple Chart Placeholder */}
           <View style={styles.chartContainer}>
              <View style={styles.chartBars}>
                 {dailyEarnings.map((item, index) => {
                    const barHeight = todayEarnings > 0 ? (item.value / todayEarnings) * 100 : 0;
                    return (
                      <View key={index} style={styles.barColumn}>
                         <View style={[styles.bar, { height: Math.max(10, barHeight), opacity: todayEarnings > 0 ? 1 : 0.2 }]} />
                         <Text style={styles.barLabel}>{item.day}</Text>
                      </View>
                    );
                 })}
              </View>
           </View>
        </View>

        <View style={styles.transactionSection}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
           </View>

           {completedOrders.length === 0 ? (
             <View style={{ padding: 30, backgroundColor: COLORS.white, borderRadius: 20, alignItems: 'center' }}>
               <Text style={{ color: COLORS.textSecondary }}>Không có giao dịch nào gần đây</Text>
             </View>
           ) : (
             completedOrders.slice(0, 5).map((item) => (
                <View key={item._id}>
                  {renderTransaction({ item })}
                </View>
             ))
           )}
        </View>

        <TouchableOpacity style={styles.tipsCard}>
           <View style={styles.tipsIcon}>
              <Ionicons name="map-outline" size={30} color={COLORS.white} />
           </View>
           <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Mẹo tăng thu nhập</Text>
              <Text style={styles.tipsText}>Khu vực Quận 1 đang có nhu cầu cao. Hãy di chuyển đến đó để nhận thêm +15.000đ mỗi đơn hàng.</Text>
           </View>
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
  incomeBadge: {
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  incomeBadgeText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  mainCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  mainLabel: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
  },
  mainValue: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 42,
    marginVertical: 10,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  growthText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SIZES.padding / 1.5,
    marginRight: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  statValue: {
    ...FONTS.h2,
    fontSize: 26,
    marginTop: 4,
  },
  performanceSection: {
    backgroundColor: '#FDF2F0',
    borderRadius: 25,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h2,
    fontSize: 18,
  },
  sectionSubtitle: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detailButtonText: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontSize: 10,
    marginLeft: 4,
  },
  chartContainer: {
    height: 150,
    justifyContent: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barColumn: {
    alignItems: 'center',
  },
  bar: {
    width: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    opacity: 0.3,
  },
  barLabel: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  transactionSection: {
    marginBottom: SIZES.padding,
  },
  seeAll: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.base * 1.5,
    borderRadius: 20,
    marginBottom: SIZES.base,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    ...FONTS.h4,
    fontSize: 14,
  },
  transactionTime: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    ...FONTS.h3,
    color: COLORS.text,
    fontSize: 15,
  },
  statusText: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.success,
  },
  tipsCard: {
    backgroundColor: '#3E2723',
    borderRadius: 25,
    padding: SIZES.padding,
    flexDirection: 'row',
    marginBottom: SIZES.padding * 2,
  },
  tipsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: 4,
  },
  tipsText: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    lineHeight: 18,
  },
  tipsButton: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  tipsButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontSize: 12,
  },
});

export default EarningsScreen;
