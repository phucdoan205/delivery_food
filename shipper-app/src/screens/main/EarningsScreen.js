import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { earnings } from '../../constants/mockData';

const EarningsScreen = () => {
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={[styles.iconBox, { backgroundColor: item.type === 'bonus' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(46, 204, 113, 0.1)' }]}>
        <Ionicons 
          name={item.type === 'bonus' ? 'ribbon-outline' : 'bicycle-outline'} 
          size={24} 
          color={item.type === 'bonus' ? COLORS.warning : COLORS.success} 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {item.type === 'bonus' ? item.title : `Đơn hàng #${item.orderId}`}
        </Text>
        <Text style={styles.transactionTime}>
          {item.time} • {item.method || item.program}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.amountValue}>+{item.amount.toLocaleString()}đ</Text>
        <Text style={styles.statusText}>Hoàn thành</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        showBack={false} 
        title="Thu nhập" 
        rightComponent={
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeBadgeText}>$142.50</Text>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
           <Text style={styles.mainLabel}>Tổng thu nhập hôm nay</Text>
           <Text style={styles.mainValue}>1.450.000đ</Text>
           <View style={styles.growthBadge}>
              <Ionicons name="trending-up" size={14} color={COLORS.white} />
              <Text style={styles.growthText}>+12.5% so với hôm qua</Text>
           </View>
        </View>

        <View style={styles.statsRow}>
           <View style={styles.statBox}>
              <Text style={styles.statLabel}>Số đơn hoàn thành</Text>
              <Text style={styles.statValue}>24 <Text style={{fontSize: 14, color: COLORS.success}}>đơn</Text></Text>
           </View>
           <View style={styles.statBox}>
              <Text style={styles.statLabel}>Thời gian làm việc</Text>
              <Text style={styles.statValue}>8.5 <Text style={{fontSize: 14, color: COLORS.secondary}}>giờ</Text></Text>
           </View>
        </View>

        <View style={styles.performanceSection}>
           <View style={styles.sectionHeader}>
              <View>
                 <Text style={styles.sectionTitle}>Hiệu suất tuần</Text>
                 <Text style={styles.sectionSubtitle}>Thứ Hai, 15 Th05 - Chủ Nhật, 21 Th05</Text>
              </View>
              <TouchableOpacity style={styles.detailButton}>
                 <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                 <Text style={styles.detailButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
           </View>

           {/* Simple Chart Placeholder */}
           <View style={styles.chartContainer}>
              <View style={styles.chartBars}>
                 {earnings.dailyStats.map((item, index) => (
                    <View key={index} style={styles.barColumn}>
                       <View style={[styles.bar, { height: (item.value / 1000) * 100 }]} />
                       <Text style={styles.barLabel}>{item.day}</Text>
                    </View>
                 ))}
              </View>
           </View>
        </View>

        <View style={styles.transactionSection}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
              <TouchableOpacity>
                 <Text style={styles.seeAll}>Tất cả</Text>
              </TouchableOpacity>
           </View>

           {earnings.transactions.map((item) => (
              <View key={item.id}>
                {renderTransaction({ item })}
              </View>
           ))}
        </View>

        <TouchableOpacity style={styles.tipsCard}>
           <View style={styles.tipsIcon}>
              <Ionicons name="map-outline" size={30} color={COLORS.white} />
           </View>
           <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Mẹo tăng thu nhập</Text>
              <Text style={styles.tipsText}>Khu vực Quận 1 đang có nhu cầu cao. Hãy di chuyển đến đó để nhận thêm +15.000đ mỗi đơn hàng.</Text>
              <TouchableOpacity style={styles.tipsButton}>
                 <Text style={styles.tipsButtonText}>Di chuyển ngay</Text>
              </TouchableOpacity>
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
