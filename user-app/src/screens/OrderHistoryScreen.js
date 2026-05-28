import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { MapPin, Search as ChevronRight, Search as RotateCcw, CheckCircle } from 'lucide-react-native';
import { request, API_URL } from '../api/client';
import io from 'socket.io-client/dist/socket.io.js';
import { Alert } from 'react-native';

const OrderHistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Hiện tại');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordersData, profileData] = await Promise.all([
        request('/orders/myorders'),
        request('/auth/profile').catch(() => null)
      ]);
      setOrders(ordersData);
      setProfile(profileData);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let socket;
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      
      if (!socket) {
        const socketUrl = API_URL.replace('/api', '');
        socket = io(socketUrl);
        
        socket.on('order_status_updated', (data) => {
          fetchData(); // Tải lại danh sách đơn
        });
      }
    });
    
    return () => {
      unsubscribe();
      if (socket) socket.disconnect();
    };
  }, [navigation]);

  const handleCompleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status: 'completed' }
      });
      Alert.alert('Thành công', 'Cảm ơn bạn đã xác nhận nhận hàng!');
      fetchData();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => {
    const isCurrent = ['pending', 'confirmed', 'preparing', 'delivering'].includes(item.status);
    const restaurantName = item.restaurantId?.name || "Nhà hàng đối tác";
    const restaurantImage = item.restaurantId?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
    
    // Generate text summary of items
    const itemsSummary = item.items?.map(i => `${i.quantity}x ${i.foodId?.name || 'Món ăn'}`).join(', ') || 'Đơn hàng thực phẩm';
    const orderDate = new Date(item.createdAt).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const getStatusLabel = (status) => {
      switch (status) {
        case 'pending': return 'ĐANG CHỜ DUYỆT';
        case 'confirmed': return 'ĐÃ XÁC NHẬN';
        case 'preparing': return 'ĐANG CHUẨN BỊ';
        case 'delivering': return 'ĐANG GIAO HÀNG';
        case 'completed': return 'ĐÃ HOÀN THÀNH';
        case 'cancelled': return 'ĐÃ HỦY';
        default: return 'ĐƠN HÀNG';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => isCurrent && navigation.navigate('OrderTracking', { orderId: item._id })}
      >
        {isCurrent ? (
          <>
            <Image source={{ uri: restaurantImage }} style={styles.currentOrderImage} />
            <View style={styles.currentOrderInfo}>
              <View style={[styles.tagBadge, { backgroundColor: item.status === 'delivering' ? COLORS.green : COLORS.primary }]}>
                <Text style={styles.tagText}>{getStatusLabel(item.status)}</Text>
              </View>
              <Text style={styles.restaurantName}>{restaurantName}</Text>
              <Text style={styles.orderTime}>Đặt lúc {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
              <View style={styles.itemsRow}>
                <Text style={styles.orderItems} numberOfLines={1}>🍽️ {itemsSummary}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.totalPrice.toLocaleString()}đ</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {item.status === 'delivering' && (
                    <TouchableOpacity 
                      style={[styles.trackBtn, { backgroundColor: COLORS.green }]} 
                      onPress={() => handleCompleteOrder(item._id)}
                    >
                      <CheckCircle size={16} color={COLORS.white} />
                      <Text style={styles.trackBtnText}>Đã nhận</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.trackBtn} 
                    onPress={() => navigation.navigate('OrderTracking', { orderId: item._id })}
                  >
                    <MapPin size={16} color={COLORS.white} />
                    <Text style={styles.trackBtnText}>Theo dõi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.pastOrderContainer}>
            <Image source={{ uri: restaurantImage }} style={styles.pastOrderImage} />
            <View style={styles.pastOrderInfo}>
              <View style={styles.pastOrderHeader}>
                <Text style={styles.restaurantNameSmall}>{restaurantName}</Text>
                <Text style={styles.orderDate}>{orderDate}</Text>
              </View>
              <Text style={styles.orderItemsSmall} numberOfLines={1}>{itemsSummary}</Text>
              <View style={styles.pastOrderFooter}>
                <Text style={styles.priceSmall}>{item.totalPrice.toLocaleString()}đ</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.status === 'completed' && (
                    <TouchableOpacity 
                      style={{ backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginRight: 8 }}
                      onPress={() => navigation.navigate('Review', { order: item })}
                    >
                      <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold' }}>Đánh giá</Text>
                    </TouchableOpacity>
                  )}
                  <View style={[styles.tagBadge, { backgroundColor: item.status === 'completed' ? COLORS.green : '#E0E0E0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginBottom: 0 }]}>
                    <Text style={[styles.tagText, { fontSize: 8, color: item.status === 'completed' ? COLORS.white : '#616161' }]}>{getStatusLabel(item.status)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const currentOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status));
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationHeader}>
          <MapPin size={16} color={COLORS.primary} fill={COLORS.primary} />
          <Text style={styles.locationText}>Vị trí hiện tại</Text>
        </View>
        <Image 
          source={{ uri: profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.fullName || 'U'}&background=E63946&color=fff` }} 
          style={styles.avatar} 
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Lịch sử ăn uống</Text>
        <Text style={styles.subtitle}>
          Xem lại những cuộc phiêu lưu ẩm thực và theo dõi các đơn hàng hiện tại.
        </Text>

        <View style={styles.tabContainer}>
          {['Hiện tại', 'Đã xong'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Hiện tại' && (
          <FlatList
            data={currentOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <Text style={styles.sectionTitle}>Đang giao</Text>}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, padding: 30, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textLight }}>Không có đơn hàng hiện tại nào</Text>
              </View>
            )}
          />
        )}

        {activeTab === 'Đã xong' && (
          <FlatList
            data={pastOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <Text style={styles.sectionTitle}>Lịch sử đã đặt</Text>}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, padding: 30, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textLight }}>Lịch sử trống</Text>
              </View>
            )}
          />
        )}
      </View>
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
    paddingVertical: 10,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 5,
    fontWeight: '500',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: 'rgba(178, 58, 0, 0.1)',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 20,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginBottom: 20,
    ...SHADOWS.light,
    overflow: 'hidden',
  },
  currentOrderImage: {
    width: '100%',
    height: 180,
  },
  currentOrderInfo: {
    padding: 15,
  },
  tagBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemsRow: {
    marginTop: 10,
  },
  orderItems: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pastOrderContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  pastOrderImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  pastOrderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  pastOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantNameSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  orderItemsSmall: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  pastOrderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceSmall: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  }
});

export default OrderHistoryScreen;
