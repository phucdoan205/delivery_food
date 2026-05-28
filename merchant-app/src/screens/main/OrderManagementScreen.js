import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Clock, Star } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import OrderCard from '../../components/OrderCard';
import { request, API_URL } from '../../api/client';
import io from 'socket.io-client/dist/socket.io.js';

const OrderManagementScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  
  const fetchOrders = async () => {
    try {
      const rest = await request('/restaurants/mine');
      setRestaurant(rest);
      const ordersData = await request(`/orders/merchant/${rest._id}`);
      setOrders(ordersData);
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!restaurant) return;
    
    const socketUrl = API_URL.replace('/api', '');
    const socket = io(socketUrl);
    
    socket.on('order_status_updated', (data) => {
      const restId = typeof data.restaurantId === 'object' ? data.restaurantId._id : data.restaurantId;
      if (restId === restaurant._id || restId === restaurant.id) {
        fetchOrders();
      }
    });
    
    socket.on('new_order', (data) => {
      const restId = typeof data.restaurantId === 'object' ? data.restaurantId._id : data.restaurantId;
      if (restId === restaurant._id || restId === restaurant.id) {
        fetchOrders();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurant]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = 'confirmed';
    if (currentStatus === 'pending') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else return;

    try {
      await request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status: nextStatus }
      });
      Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
      fetchOrders();
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

  // Filter orders by active tab
  const filteredOrders = orders.filter(o => {
    if (activeTab === 'new') return ['pending', 'confirmed'].includes(o.status);
    if (activeTab === 'preparing') return o.status === 'preparing';
    if (activeTab === 'ready') return ['ready', 'delivering'].includes(o.status);
    if (activeTab === 'completed') return ['completed', 'cancelled'].includes(o.status);
    return false;
  });

  const newCount = orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => ['ready', 'delivering'].includes(o.status)).length;
  const completedCount = orders.filter(o => ['completed', 'cancelled'].includes(o.status)).length;

  const tabs = [
    { id: 'new', label: `MỚI (${newCount})` },
    { id: 'preparing', label: `ĐANG CHUẨN BỊ (${preparingCount})` },
    { id: 'ready', label: `SẴN SÀNG (${readyCount})` },
    { id: 'completed', label: `HOÀN THÀNH (${completedCount})` },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.restInfo}>
            {restaurant?.image && <Image source={{ uri: restaurant.image }} style={styles.restLogo} />}
            <Text style={styles.restName}>{restaurant?.name || 'Cửa hàng'}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{restaurant?.status === 'approved' ? 'Hoạt động' : 'Chờ duyệt'}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.title}>Quản lý đơn hàng</Text>
        <Text style={styles.subtitle}>Theo dõi và cập nhật trạng thái đơn hàng của bạn.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Order List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredOrders.length === 0 ? (
          <View style={{ padding: 40, backgroundColor: Colors.white, borderRadius: 20, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: Colors.textSecondary }}>Không có đơn hàng nào thuộc mục này</Text>
          </View>
        ) : (
          filteredOrders.map((order, index) => (
            <OrderCard 
              key={index} 
              order={order} 
              onPress={() => navigation.navigate('OrderDetail', { orderId: order._id })}
              onStatusChange={handleUpdateStatus}
            />
          ))
        )}

        {/* Stats Summary at bottom */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hiệu suất hôm nay</Text>
          <Text style={styles.summarySub}>Bạn có {orders.filter(o => o.status === 'completed').length} đơn hàng hoàn thành.</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>100%</Text>
              <Text style={styles.mainStatTrend}>Hoàn thành tốt</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.subStats}>
              <View style={styles.subStatItem}>
                <Clock size={16} color="#2ECC71" />
                <Text style={styles.subStatValue}>15 phút</Text>
                <Text style={styles.subStatLabel}>CHUẨN BỊ TB</Text>
              </View>
              <View style={styles.subStatItem}>
                <Star size={16} color="#F1C40F" />
                <Text style={styles.subStatValue}>4.9/5.0</Text>
                <Text style={styles.subStatLabel}>ĐÁNH GIÁ KHÁCH</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F8',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  restInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  restName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: '#2ECC7115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2ECC71',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTab: {
    backgroundColor: '#FFEBE6',
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.primary,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF1F0',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  summarySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainStat: {
    flex: 1,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
  },
  mainStatTrend: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2ECC71',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
  },
  subStats: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subStatItem: {
    alignItems: 'flex-start',
  },
  subStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  subStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
});

export default OrderManagementScreen;
