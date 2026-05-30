import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Bell, HelpCircle, Phone, MessageSquare, MapPin } from 'lucide-react-native';
import { request, API_URL } from '../api/client';
import io from 'socket.io-client';
import MapTilerView from '../components/MapTilerView';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);

  const fetchOrderDetails = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      let targetId = orderId;
      if (!targetId) {
        // Fallback to fetch latest order if none passed
        const ordersList = await request('/orders/myorders');
        if (ordersList && ordersList.length > 0) {
          targetId = ordersList[0]._id;
        } else {
          setLoading(false);
          return;
        }
      }

      const data = await request(`/orders/${targetId}`);
      setOrder(data);
    } catch (error) {
      console.log('Error fetching order details for tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let socket;
    fetchOrderDetails(true);
    
    try {
      const socketUrl = API_URL.replace('/api', '');
      socket = io(socketUrl);
      socket.on('order_status_updated', (updatedOrder) => {
        if (!orderId || updatedOrder._id === orderId) {
          fetchOrderDetails(false);
        }
      });
    } catch (error) {
      console.log('Socket connection error', error);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [orderId]);

  const handleCompleteOrder = async () => {
    try {
      setLoading(true);
      await request(`/orders/${order._id}/status`, {
        method: 'PUT',
        body: { status: 'completed' }
      });
      Alert.alert('Thành công', 'Cảm ơn bạn đã xác nhận nhận hàng!');
      fetchOrderDetails(true);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Xác nhận hủy",
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      [
        { text: "Không", style: "cancel" },
        { 
          text: "Hủy đơn", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await request(`/orders/${order._id}/status`, {
                method: 'PUT',
                body: { status: 'cancelled' }
              });
              Alert.alert('Thành công', 'Đơn hàng đã được hủy!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textLight, marginBottom: 15 }}>Không tìm thấy đơn hàng nào cần theo dõi</Text>
        <TouchableOpacity style={{ padding: 12, backgroundColor: COLORS.primary, borderRadius: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isStepActive = (step) => {
    const status = order.status;
    if (step === 1) return ['pending', 'confirmed', 'preparing', 'delivering', 'completed'].includes(status);
    if (step === 2) return ['preparing', 'delivering', 'completed'].includes(status);
    if (step === 3) return ['delivering', 'completed'].includes(status);
    if (step === 4) return ['completed'].includes(status);
    return false;
  };

  const getStepIconColor = (step) => {
    return isStepActive(step) ? COLORS.primary : COLORS.border;
  };

  const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const itemsText = order.items?.map(i => `${i.quantity}x ${i.foodId?.name || 'Món ăn'}`).join(', ') || '';

  // Calculate deterministic offset similar to Shipper App for demo purposes
  const getOffset = (seedStr, index) => {
    let hash = 0;
    const str = seedStr ? seedStr.toString() : index.toString();
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const offsetBase = (hash % 100) / 10000;
    return offsetBase * (index % 2 === 0 ? 1 : -1);
  };

  const handleMarkerPress = async (id) => {
    if (!order) return;
    
    // Default Shipper coordinates (or center)
    const shipperLng = 106.660172;
    const shipperLat = 10.762622;
    
    const restId = order.restaurantId?._id || order._id;
    const custId = order.userId?._id || order.deliveryAddress || 'customer';
    
    let targetLng, targetLat;
    if (id === 'rest') {
      targetLng = 106.660172 + getOffset(restId + 'lng', 0);
      targetLat = 10.762622 + getOffset(restId, 0);
    } else if (id === 'cust') {
      targetLng = 106.660172 + getOffset(custId + 'lng', 1);
      targetLat = 10.762622 + getOffset(custId, 1);
    } else {
      return; // 'shipper' marker
    }

    try {
      const coordinates = `${shipperLng},${shipperLat};${targetLng},${targetLat}`;
      const json = await request(`/orders/route?coordinates=${coordinates}`);
      if (json.routes && json.routes[0]) {
        setRouteData(json.routes[0].geometry);
      }
    } catch (e) {
      console.log('Routing failed, using fallback', e);
      setRouteData({
        type: 'LineString',
        coordinates: [
          [shipperLng, shipperLat],
          [targetLng, targetLat]
        ]
      });
    }
  };

  const getDynamicMarkers = () => {
    const defaultShipper = { id: 'shipper', lat: 10.762622, lng: 106.660172, title: 'Shipper', color: '#3B82F6', label: 'U' };
    if (!order) return [defaultShipper];

    const restId = order.restaurantId?._id || order._id;
    const custId = order.userId?._id || order.deliveryAddress || 'customer';
    
    return [
      defaultShipper,
      {
        id: 'rest',
        lat: 10.762622 + getOffset(restId, 0),
        lng: 106.660172 + getOffset(restId + 'lng', 0),
        title: order.restaurantId?.name || 'Nhà hàng',
        color: COLORS.primary,
        label: 'N'
      },
      {
        id: 'cust',
        lat: 10.762622 + getOffset(custId, 1),
        lng: 106.660172 + getOffset(custId + 'lng', 1),
        title: 'Bạn',
        color: '#10B981',
        label: 'K'
      }
    ];
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}><Bell size={20} color={COLORS.text} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><HelpCircle size={20} color={COLORS.text} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapTilerView 
          center={[106.660172, 10.762622]} 
          zoom={13} 
          markers={getDynamicMarkers()} 
          route={routeData}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.bottomSheet}>
        <View style={styles.etaCard}>
          <View style={styles.etaIconContainer}>
            <Text style={{ fontSize: 24 }}>🕒</Text>
          </View>
          <View style={styles.etaInfo}>
            <Text style={styles.etaLabel}>Trạng thái đơn</Text>
            <Text style={styles.etaValue}>
              {order.status === 'pending' && 'Chờ cửa hàng xác nhận'}
              {order.status === 'confirmed' && 'Cửa hàng đã nhận đơn'}
              {order.status === 'preparing' && 'Đang chuẩn bị món'}
              {order.status === 'delivering' && 'Tài xế đang giao hàng'}
              {order.status === 'completed' && 'Giao hàng thành công'}
              {order.status === 'cancelled' && 'Đã hủy đơn'}
            </Text>
          </View>
          <View style={styles.distanceInfo}>
            <Text style={styles.distLabel}>TỔNG TIỀN</Text>
            <Text style={styles.distValue}>{order.totalPrice?.toLocaleString()}đ</Text>
          </View>
        </View>

        <View style={styles.statusSection}>
          <View style={styles.statusLine} />
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isStepActive(1) && styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>✓</Text></View>
            <View style={[styles.statusDot, isStepActive(2) && styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>🍳</Text></View>
            <View style={[styles.statusDot, isStepActive(3) && styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>🛵</Text></View>
            <View style={[styles.statusDot, isStepActive(4) && styles.activeDot]}><Text style={{ color: COLORS.white, fontSize: 10 }}>✓</Text></View>
          </View>
          <View style={styles.statusLabels}>
            <Text style={isStepActive(1) ? styles.activeStatusLabel : styles.statusLabel}>Đã nhận</Text>
            <Text style={isStepActive(2) ? styles.activeStatusLabel : styles.statusLabel}>Chuẩn bị</Text>
            <Text style={isStepActive(3) ? styles.activeStatusLabel : styles.statusLabel}>Đang giao</Text>
            <Text style={isStepActive(4) ? styles.activeStatusLabel : styles.statusLabel}>Hoàn thành</Text>
          </View>
        </View>

        {order.shipperId && (
          <View style={styles.driverCard}>
            <Image 
              source={{ uri: order.shipperId?.avatar || `https://ui-avatars.com/api/?name=${order.shipperId?.fullName || 'T'}&background=3B82F6&color=fff` }} 
              style={styles.driverAvatar} 
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{order.shipperId.fullName}</Text>
              <Text style={styles.vehicleInfo}>🛵 Tài xế giao hàng • {order.shipperId.phone}</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.driverActionBtn} onPress={() => Alert.alert('Tính năng', 'Tính năng nhắn tin đang phát triển')}><MessageSquare size={20} color={COLORS.green} /></TouchableOpacity>
              <TouchableOpacity style={[styles.driverActionBtn, { backgroundColor: COLORS.primary }]} onPress={() => Alert.alert('Gọi tài xế', `Đang gọi đến số: ${order.shipperId.phone}`)}><Phone size={20} color={COLORS.white} /></TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.orderDetailsCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Chi tiết đơn hàng</Text>
          </View>
          <View style={styles.orderItem}>
            <View style={[styles.itemIcon, { backgroundColor: 'transparent', overflow: 'hidden' }]}>
              {order.items?.[0]?.foodId?.image ? (
                <Image source={{ uri: order.items[0].foodId.image }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Text>🍱</Text>
              )}
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{order.restaurantId?.name || 'Nhà hàng'}</Text>
              <Text style={styles.itemMeta} numberOfLines={1}>{itemsCount} món • {itemsText}</Text>
            </View>
            <Text style={styles.itemPrice}>{order.totalPrice?.toLocaleString()}đ</Text>
          </View>
          <View style={styles.addrRow}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.addrText}>{order.restaurantId?.address || 'Địa chỉ cửa hàng'}</Text>
          </View>
        </View>

        {order.status === 'delivering' && (
          <TouchableOpacity 
            style={{ 
              backgroundColor: COLORS.green, 
              paddingVertical: 15, 
              borderRadius: SIZES.radius, 
              alignItems: 'center',
              marginBottom: 50
            }}
            onPress={handleCompleteOrder}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>Đã nhận được hàng</Text>
          </TouchableOpacity>
        )}
        
        {order.status === 'pending' && (
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#E53935', 
              paddingVertical: 15, 
              borderRadius: SIZES.radius, 
              alignItems: 'center',
              marginBottom: 50
            }}
            onPress={handleCancelOrder}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        )}
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
