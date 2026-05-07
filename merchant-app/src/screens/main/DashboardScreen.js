import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Bell, ChevronRight, TrendingUp } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { DASHBOARD_STATS, ORDERS, TOP_SELLING_DISHES, RESTAURANT_INFO } from '../../constants/mockData';
import StatCard from '../../components/StatCard';
import { LayoutDashboard, ShoppingBag, Star, TrendingUp as TrendingUpIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: RESTAURANT_INFO.logo }} style={styles.logo} />
          <View>
            <Text style={styles.welcomeText}>Chào buổi sáng, Chef!</Text>
            <Text style={styles.subWelcomeText}>Hôm nay nhà hàng của bạn đang hoạt động rất tốt.</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell size={24} color={Colors.text} />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Doanh thu hôm nay" 
          value={`${DASHBOARD_STATS.revenue} VND`} 
          subValue={DASHBOARD_STATS.revenueGrowth}
          icon={TrendingUpIcon} 
          color="#E67E22"
          style={{ width: '100%' }}
        />
        <StatCard 
          title="Đơn hàng mới" 
          value={DASHBOARD_STATS.newOrders} 
          icon={ShoppingBag} 
          color="#3498DB" 
        />
        <StatCard 
          title="Đánh giá TB" 
          value={DASHBOARD_STATS.avgRating} 
          icon={Star} 
          color="#F1C40F" 
        />
      </View>

      {/* Performance Chart Placeholder */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Hiệu suất tuần này</Text>
            <Text style={styles.sectionSubTitle}>So với 7 ngày trước</Text>
          </View>
          <View style={styles.trendBadge}>
            <TrendingUp size={14} color="#2ECC71" />
            <Text style={styles.trendText}>8.4%</Text>
          </View>
        </View>
        
        <View style={styles.chartPlaceholder}>
          <View style={styles.barContainer}>
            {DASHBOARD_STATS.performanceData.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: item.value, backgroundColor: index === 5 ? Colors.primary : '#F1E6E4' }]} />
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Latest Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng mới nhất</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        {ORDERS.slice(0, 2).map((order, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.orderBadge}>
              <Text style={styles.orderBadgeText}>#{order.id.split('-')[1]}</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderName}>{order.items[0].name} (x{order.items[0].quantity})</Text>
              <Text style={styles.orderNote}>Ghi chú: {order.isLargeOrder ? 'Đơn hàng lớn' : 'Nhanh chóng'}</Text>
            </View>
            <TouchableOpacity style={styles.orderAction}>
              <Text style={styles.orderActionText}>Bắt đầu làm</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Top Selling */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Món bán chạy hôm nay</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topSellingScroll}>
          {TOP_SELLING_DISHES.map((dish, index) => (
            <View key={index} style={styles.dishCard}>
              <Image source={{ uri: dish.image }} style={styles.dishImage} />
              <View style={styles.dishRank}>
                <Text style={styles.dishRankText}>TOP {dish.rank || index + 1}</Text>
              </View>
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishPrice}>{dish.price}</Text>
                <Text style={styles.dishOrders}>{dish.orders} lượt đặt</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  subWelcomeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ECC7115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2ECC71',
    marginLeft: 4,
  },
  chartPlaceholder: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    height: 200,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    width: (width - 120) / 7,
  },
  bar: {
    width: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  orderItem: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderBadge: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FBE9E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  orderName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  orderNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  orderAction: {
    backgroundColor: '#C14614',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  orderActionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  topSellingScroll: {
    marginTop: 10,
  },
  dishCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginRight: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dishImage: {
    width: '100%',
    height: 120,
  },
  dishRank: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dishRankText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  dishInfo: {
    padding: 15,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  dishOrders: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  }
});

export default DashboardScreen;
