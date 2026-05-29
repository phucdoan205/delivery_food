import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { request } from '../../api/client';
import MapTilerView from '../../components/MapTilerView';

const { width, height } = Dimensions.get('window');

const DeliveryScreen = ({ navigation }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const insets = useSafeAreaInsets();

  // Deterministic pseudo-random based on string
  const getOffset = (str, index) => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const val = Math.sin(hash++) * 10000;
    return (val - Math.floor(val)) * 0.05 - 0.025;
  };

  const fetchActiveDeliveries = async () => {
    try {
      const data = await request('/orders/shipper');
      // Filter for currently active orders (delivering status)
      const delivering = data.filter(o => o.status === 'delivering');
      setActiveOrders(delivering);
      
      if (delivering.length > 0) {
        const order = delivering[0];
        const restId = order.restaurantId?._id || order._id;
        const custId = order.userId?._id || order.deliveryAddress || 'customer';
        
        const shipperLng = 106.660172;
        const shipperLat = 10.762622;
        const restLng = 106.660172 + getOffset(restId + 'lng', 0);
        const restLat = 10.762622 + getOffset(restId, 0);
        const custLng = 106.660172 + getOffset(custId + 'lng', 1);
        const custLat = 10.762622 + getOffset(custId, 1);
        
        // Initial route (Full route Shipper -> Rest -> Cust)
        try {
          const coordinates = `${shipperLng},${shipperLat};${restLng},${restLat};${custLng},${custLat}`;
          const json = await request(`/orders/route?coordinates=${coordinates}`);
          if (json.routes && json.routes[0]) {
            setRouteData(json.routes[0].geometry);
          }
        } catch (e) {
          console.log('OSRM routing failed, using fallback straight line', e);
          setRouteData({
            type: 'LineString',
            coordinates: [
              [shipperLng, shipperLat],
              [restLng, restLat],
              [custLng, custLat]
            ]
          });
        }
      }
    } catch (error) {
      console.log('Error fetching active shipper deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = async (id, order) => {
    if (!order || id === 'user') return;
    
    const restId = order.restaurantId?._id || order._id;
    const custId = order.userId?._id || order.deliveryAddress || 'customer';
    const shipperLng = 106.660172;
    const shipperLat = 10.762622;
    
    let targetLng, targetLat;
    if (id === 'rest' || id === order.restaurantId?._id) {
      targetLng = 106.660172 + getOffset(restId + 'lng', 0);
      targetLat = 10.762622 + getOffset(restId, 0);
    } else {
      targetLng = 106.660172 + getOffset(custId + 'lng', 1);
      targetLat = 10.762622 + getOffset(custId, 1);
    }

    try {
      const coordinates = `${shipperLng},${shipperLat};${targetLng},${targetLat}`;
      const json = await request(`/orders/route?coordinates=${coordinates}`);
      if (json.routes && json.routes[0]) {
        setRouteData(json.routes[0].geometry);
      }
    } catch (e) {
      console.log('OSRM dynamic routing failed, using fallback straight line', e);
      setRouteData({
        type: 'LineString',
        coordinates: [
          [shipperLng, shipperLat],
          [targetLng, targetLat]
        ]
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchActiveDeliveries();
    });
    return unsubscribe;
  }, [navigation]);

  const handleCompleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status: 'completed' }
      });
      Alert.alert('Thành công', 'Đơn hàng đã được giao thành công!');
      fetchActiveDeliveries();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật trạng thái đơn hàng');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const order = activeOrders[0]; // Take the first active order

  const markers = [{ id: 'user', lat: 10.762622, lng: 106.660172, title: 'Bạn', color: '#3B82F6', label: 'U' }];
  if (order) {
    const restId = order.restaurantId?._id || order._id;
    const custId = order.userId?._id || order.deliveryAddress || 'customer';
    
    // Restaurant marker
    markers.push({
      id: order.restaurantId?._id || 'rest',
      lat: 10.762622 + getOffset(restId, 0),
      lng: 106.660172 + getOffset(restId + 'lng', 0),
      title: order.restaurantId?.name || 'Nhà hàng',
      color: COLORS.primary, // Orange for restaurant
      label: 'N'
    });
    
    // Customer marker
    markers.push({
      id: 'cust',
      lat: 10.762622 + getOffset(custId, 1),
      lng: 106.660172 + getOffset(custId + 'lng', 1),
      title: 'Khách hàng',
      color: '#10B981', // Green for customer destination
      label: 'K'
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapTilerView 
          center={[106.660172, 10.762622]} 
          zoom={13} 
          markers={markers} 
          route={routeData}
          onMarkerPress={(id) => handleMarkerPress(id, order)}
        />
      </View>

      <Header 
        showBack={false}
        title="Đang giao hàng"
        style={[styles.header, { marginTop: Math.max(insets.top, 40) }]}
        rightComponent={
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeText}>GIAO</Text>
          </View>
        }
      />

      <View style={styles.bottomContainer}>
        {!order ? (
          <View style={[styles.orderCard, { alignItems: 'center', paddingVertical: 40 }]}>
            <Ionicons name="bicycle" size={48} color={COLORS.textSecondary} />
            <Text style={[styles.resName, { marginTop: 10, fontSize: 18 }]}>Bạn không có đơn nào đang giao</Text>
            <Text style={{ color: COLORS.textSecondary, marginTop: 5, textAlign: 'center' }}>
              Hãy sang tab "Sẵn sàng" để nhận đơn mới!
            </Text>
          </View>
        ) : (
          <View style={styles.orderCard}>
            <TouchableOpacity 
              style={styles.dragHandle}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              <View style={styles.dragBar} />
              <Ionicons name={isCollapsed ? "chevron-up" : "chevron-down"} size={16} color={COLORS.textLight} />
            </TouchableOpacity>

            <View style={styles.orderHeader}>
               <View style={styles.tag}>
                  <Ionicons name="bicycle" size={14} color={COLORS.white} />
                  <Text style={styles.tagText}>ĐANG VẬN CHUYỂN</Text>
               </View>
               <View style={styles.timer}>
                  <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.timerText}>Vừa xong</Text>
               </View>
            </View>

            {!isCollapsed && (
              <>
                <View style={styles.restaurantRow}>
                   <Image source={{ uri: order.restaurantId?.image || 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=200' }} style={styles.resImage} />
               <View style={styles.resInfo}>
                  <Text style={styles.resName}>{order.restaurantId?.name || 'Cửa hàng'}</Text>
                  <View style={styles.resStats}>
                     <Ionicons name="navigate-outline" size={14} color={COLORS.textSecondary} />
                     <Text style={styles.resStatsText}>{order.deliveryAddress || 'Địa chỉ giao hàng'}</Text>
                  </View>
               </View>
            </View>

            <View style={styles.incomeSection}>
               <Text style={styles.incomeLabel}>TỔNG CỘNG TIỀN THU KHÁCH</Text>
               <View style={styles.incomeRow}>
                  <Text style={styles.incomeValue}>{order.totalPrice?.toLocaleString()}đ</Text>
                  <View style={[styles.bonusTag, { backgroundColor: order.paymentMethod === 'cash' ? COLORS.primary : COLORS.success }]}>
                     <Text style={styles.bonusTagText}>
                       {order.paymentMethod === 'cash' ? 'Thu Tiền Mặt' : 'Đã Thanh Toán Online'}
                     </Text>
                  </View>
               </View>
            </View>
              </>
            )}

            <View style={styles.actions}>
               <CustomButton 
                  title="Chi tiết đơn" 
                  type="outline" 
                  style={styles.rejectButton} 
                  textStyle={{ color: COLORS.primary }}
                  onPress={() => navigation.navigate('DeliveryDetail', { orderId: order._id })}
               />
               <CustomButton 
                  title="Hoàn thành giao" 
                  style={styles.acceptButton}
                  icon={<Ionicons name="checkmark" size={20} color={COLORS.white} style={{marginRight: 8}} />}
                  onPress={() => handleCompleteOrder(order._id)}
               />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    backgroundColor: 'rgba(253, 245, 242, 0.9)',
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius * 2,
  },
  incomeBadge: {
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  incomeText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: SIZES.padding,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: SIZES.padding,
    paddingTop: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
    marginBottom: SIZES.base,
  },
  dragBar: {
    width: 40, 
    height: 4, 
    backgroundColor: COLORS.border, 
    borderRadius: 2, 
    marginBottom: 4 
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  tag: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    ...FONTS.h4,
    fontSize: 10,
    color: COLORS.white,
    marginLeft: 4,
  },
  timer: {
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  resImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginRight: SIZES.base,
  },
  resInfo: {
    flex: 1,
  },
  resName: {
    ...FONTS.h2,
    fontSize: 22,
  },
  resStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resStatsText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  incomeSection: {
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  incomeLabel: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeValue: {
    ...FONTS.h1,
    fontSize: 32,
    color: COLORS.text,
  },
  bonusTag: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: SIZES.base,
  },
  bonusTagText: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.white,
  },
  actions: {
    flexDirection: 'row',
  },
  rejectButton: {
    flex: 1,
    marginRight: SIZES.base,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 0,
  },
  acceptButton: {
    flex: 1.5,
  },
});

export default DeliveryScreen;
