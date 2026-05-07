import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { history } from '../../constants/mockData';

const HistoryScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.idContainer}>
          <Text style={styles.orderId}>#{item.id}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.amountText}>{item.income.toLocaleString()}đ</Text>
      </View>

      <View style={styles.timeline}>
        <View style={styles.timelineItem}>
          <View style={[styles.dot, { backgroundColor: '#A04000' }]} />
          <View style={styles.line} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Cửa hàng</Text>
            <Text style={styles.locationName} numberOfLines={1}>{item.restaurant}</Text>
          </View>
        </View>
        <View style={styles.timelineItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Khách hàng</Text>
            <Text style={styles.locationName} numberOfLines={1}>{item.destination}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        showBack={false} 
        title="Lịch sử giao hàng" 
        rightComponent={
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.text} />
            <Text style={styles.filterText}>Tháng 10, 2023</Text>
          </TouchableOpacity>
        }
      />
      
      <View style={styles.summaryContainer}>
         <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TỔNG THU NHẬP HÔM NAY</Text>
            <Text style={styles.summaryValue}>1.250.000đ</Text>
            <View style={styles.growthBadge}>
               <Ionicons name="trending-up" size={14} color={COLORS.white} />
               <Text style={styles.growthText}>+12%</Text>
            </View>
         </View>
         <View style={styles.row}>
            <View style={[styles.miniCard, { marginRight: SIZES.base }]}>
               <Text style={styles.miniLabel}>ĐƠN HOÀN THÀNH</Text>
               <Text style={styles.miniValue}>24 <Text style={{fontSize: 14, color: COLORS.success}}>Chuyến</Text></Text>
            </View>
            <View style={styles.miniCard}>
               <Text style={styles.miniLabel}>QUÃNG ĐƯỜNG</Text>
               <Text style={styles.miniValue}>142 <Text style={{fontSize: 14, color: COLORS.secondary}}>km</Text></Text>
            </View>
         </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
