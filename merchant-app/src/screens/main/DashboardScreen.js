import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Bell, ChevronRight, TrendingUp } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import StatCard from '../../components/StatCard';
import { LayoutDashboard, ShoppingBag, Star, TrendingUp as TrendingUpIcon } from 'lucide-react-native';
import { request } from '../../api/client';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const rest = await request('/restaurants/mine');
      setRestaurant(rest);
      
      const [ordersData, foodsData] = await Promise.all([
        request(`/orders/merchant/${rest._id}`),
        request(`/foods?restaurantId=${rest._id}`)
      ]);
      
      setOrders(ordersData || []);
      setDishes(foodsData || []);
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = 'confirmed';
    if (currentStatus === 'pending') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'delivering';
    else return;

    try {
      await request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status: nextStatus }
      });
      Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
      fetchData();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Calculate live stats
  const completedOrders = orders.filter(o => o.status === 'completed');
  const today = new Date().toDateString();
  const todayCompleted = completedOrders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayCompleted.reduce((sum, o) => sum + o.totalPrice, 0);

  const newOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status));
  const newOrdersCount = newOrders.length;

  const displayOrders = orders.slice(0, 3);

  const getActionButtonText = (status) => {
    if (status === 'pending') return 'Chấp nhận';
    if (status === 'confirmed') return 'Chuẩn bị';
    if (status === 'preparing') return 'Giao hàng';
    return null;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: restaurant?.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200' }} 
            style={styles.logo} 
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeText}>{restaurant?.name || 'Chef!'}</Text>
            <Text style={styles.subWelcomeText}>Trạng thái: {restaurant?.status === 'approved' ? 'Hoạt động' : 'Chờ duyệt'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notification')}
        >
          <Bell size={24} color={Colors.text} />
          {newOrdersCount > 0 && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Doanh thu hôm nay" 
          value={`${todayRevenue.toLocaleString()} đ`} 
          subValue="+5.4% so với hôm qua"
          icon={TrendingUpIcon} 
          color="#E67E22"
          style={{ width: '100%' }}
        />
        <StatCard 
          title="Đơn mới chưa xử lý" 
          value={newOrdersCount} 
          icon={ShoppingBag} 
          color="#3498DB" 
        />
        <StatCard 
          title="Tổng số đơn" 
          value={orders.length} 
          icon={Star} 
          color="#F1C40F" 
        />
      </View>

      {/* Performance Chart Placeholder */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Hiệu suất hoạt động</Text>
            <Text style={styles.sectionSubTitle}>Thống kê tổng quan của cửa hàng</Text>
          </View>
          <View style={styles.trendBadge}>
            <TrendingUp size={14} color="#2ECC71" />
            <Text style={styles.trendText}>Hoạt động tốt</Text>
          </View>
        </View>
        
        <View style={styles.chartPlaceholder}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: Colors.text }}>Tổng số đơn hàng hoàn thành: {completedOrders.length}</Text>
            <Text style={{ color: Colors.textSecondary, marginTop: 5 }}>Tổng doanh thu tích lũy: {completedOrders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()} đ</Text>
          </View>
        </View>
      </View>

      {/* Latest Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng mới nhất</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        {displayOrders.length === 0 ? (
          <View style={{ padding: 30, backgroundColor: Colors.white, borderRadius: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textSecondary }}>Chưa có đơn hàng nào</Text>
          </View>
        ) : (
          displayOrders.map((order, index) => {
            const firstItemName = order.items?.[0]?.foodId?.name || 'Món ăn';
            const extraItemsCount = (order.items?.length || 1) - 1;
            const itemText = extraItemsCount > 0 ? `${firstItemName} +${extraItemsCount} món` : firstItemName;
            const actionText = getActionButtonText(order.status);

            return (
              <View key={index} style={styles.orderItem}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>#{order._id.substring(order._id.length - 4).toUpperCase()}</Text>
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderName}>{itemText}</Text>
                  <Text style={styles.orderNote}>Trạng thái: {order.status.toUpperCase()}</Text>
                </View>
                {actionText && (
                  <TouchableOpacity 
                    style={styles.orderAction}
                    onPress={() => handleUpdateStatus(order._id, order.status)}
                  >
                    <Text style={styles.orderActionText}>{actionText}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Top Selling */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Món bán chạy hôm nay</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topSellingScroll}>
          {(dishes.length ? dishes : [
            {
              name: 'Cơm Tấm Đặc Biệt',
              price: 45000,
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300',
              orders: 45
            },
            {
              name: 'Bún Thịt Nướng',
              price: 35000,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300',
              orders: 32
            }
          ]).map((dish, index) => (
            <View key={index} style={styles.dishCard}>
              <Image source={{ uri: dish.image }} style={styles.dishImage} />
              <View style={styles.dishRank}>
                <Text style={styles.dishRankText}>TOP {index + 1}</Text>
              </View>
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishPrice}>{dish.price.toLocaleString()}đ</Text>
                <Text style={styles.dishOrders}>{dish.orders || (10 - index * 2)} lượt đặt</Text>
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
