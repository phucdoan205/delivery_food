import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, PanResponder, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import MapTilerView from '../../components/MapTilerView';

const { width } = Dimensions.get('window');

import { request, API_URL } from '../../api/client';
import io from 'socket.io-client/dist/socket.io.js';

const DeliveryDetailScreen = ({ navigation, route }) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  
  const insets = useSafeAreaInsets();
  
  // Slider Animation
  const sliderAnimation = useRef(new Animated.Value(0)).current;
  const maxSlideDistance = width - SIZES.padding * 2 - 20 - 64; // width minus padding, border, thumb size
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > maxSlideDistance) newX = maxSlideDistance;
        sliderAnimation.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > maxSlideDistance * 0.8) {
          Animated.timing(sliderAnimation, {
            toValue: maxSlideDistance + 10,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            handleUpdateStatus('completed');
          });
        } else {
          Animated.spring(sliderAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Offset logic for mock coordinates
  const getOffset = (seedStr, index) => {
    let hash = 0;
    const str = seedStr ? seedStr.toString() : index.toString();
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const offsetBase = (hash % 100) / 10000;
    return offsetBase * (index % 2 === 0 ? 1 : -1);
  };

  const fetchOrderDetail = async () => {
    try {
      const data = await request(`/orders/${orderId}`);
      setOrder(data);
      if (data) fetchRouteData(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin chi tiết đơn hàng');
      console.log('Error fetching order detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteData = async (orderData) => {
    try {
      const shipperLng = 106.660172;
      const shipperLat = 10.762622;
      const restId = orderData.restaurantId?._id || orderData._id;
      const targetLng = 106.660172 + getOffset(restId + 'lng', 0);
      const targetLat = 10.762622 + getOffset(restId, 0);

      const coordinates = `${shipperLng},${shipperLat};${targetLng},${targetLat}`;
      const json = await request(`/orders/route?coordinates=${coordinates}`);
      if (json.routes && json.routes[0]) {
        setRouteData(json.routes[0].geometry);
      }
    } catch (e) {
      console.log('Routing failed', e);
    }
  };

  useEffect(() => {
    let socket;
    if (orderId) {
      fetchOrderDetail();
      const socketUrl = API_URL.replace('/api', '');
      socket = io(socketUrl);
      socket.on('order_status_updated', (data) => {
        if (data._id === orderId) {
          fetchOrderDetail();
        }
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [orderId]);

  const handleUpdateStatus = async (nextStatus) => {
    try {
      setLoading(true);
      await request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status: nextStatus }
      });
      Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng');
      // Reset slider if it wasn't a completed status (though usually we don't go backwards)
      if (nextStatus !== 'completed') {
        sliderAnimation.setValue(0);
      }
      fetchOrderDetail();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật trạng thái');
      sliderAnimation.setValue(0);
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'ĐANG CHUẨN BỊ MÓN';
      case 'delivering': return 'ĐANG GIAO HÀNG';
      case 'completed': return 'ĐÃ HOÀN THÀNH GIAO';
      default: return status.toUpperCase();
    }
  };

  const getDynamicMarkers = () => {
    const defaultShipper = { id: 'shipper', lat: 10.762622, lng: 106.660172, title: 'Bạn (Shipper)', color: '#3B82F6', label: 'S' };
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
        title: order.userId?.fullName || 'Khách hàng',
        color: '#10B981',
        label: 'K'
      }
    ];
  };

  return (
    <View style={styles.container}>
      {/* Map Preview */}
      <View style={styles.map}>
        <MapTilerView 
          center={[106.660172, 10.762622]} 
          zoom={13} 
          markers={getDynamicMarkers()} 
          route={routeData}
        />
      </View>

      <Header 
        title="Giao hàng"
        style={[styles.header, { marginTop: Math.max(insets.top + 10, 40) }]}
        navigation={navigation}
        rightComponent={
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeBadgeText}>CHI TIẾT</Text>
          </View>
        }
      />

      <View style={styles.topBanner}>
         <Ionicons name="arrow-undo" size={24} color={COLORS.success} />
         <View style={styles.bannerInfo}>
            <Text style={styles.bannerDistance}>#{order._id.substring(order._id.length - 6).toUpperCase()}</Text>
            <Text style={styles.bannerText}>Nhà hàng: {order.restaurantId?.name || 'Cửa hàng'}</Text>
         </View>
      </View>

      <View style={styles.bottomContainer}>
         <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
               <View style={styles.statusRow}>
                  <View style={styles.dot} />
                  <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
               </View>
               <View style={styles.timeBox}>
                  <Text style={styles.timeValue}>{order.totalPrice?.toLocaleString()}</Text>
                  <Text style={styles.timeLabel}>đ</Text>
                  <Text style={styles.timeEstimate}>{order.paymentMethod === 'cash' ? 'TIỀN MẶT' : 'ONLINE'}</Text>
               </View>
            </View>

            <View style={styles.customerRow}>
               <Image source={{ uri: order.userId?.avatar || `https://ui-avatars.com/api/?name=${order.userId?.fullName || 'Khach'}&background=random` }} style={styles.customerAvatar} />
               <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{order.userId?.fullName || 'Khách hàng'}</Text>
                  <Text style={styles.customerAddress} numberOfLines={1}>{order.deliveryAddress || 'Địa chỉ giao hàng'}</Text>
               </View>
               <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                     <Ionicons name="call" size={20} color={COLORS.success} />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.steps}>
               <View style={styles.stepItem}>
                  <View style={[styles.stepDot, { backgroundColor: ['preparing', 'delivering', 'completed'].includes(order.status) ? COLORS.success : COLORS.border }]}>
                     <Ionicons name="checkmark" size={12} color={COLORS.white} />
                  </View>
                  <View style={styles.stepLine} />
                  <View style={styles.stepContent}>
                     <Text style={styles.stepTitle}>Đã lấy hàng</Text>
                     <Text style={styles.stepTime}>{order.restaurantId?.name || 'Nhà hàng'}</Text>
                  </View>
               </View>
               <View style={styles.stepItem}>
                  <View style={[styles.stepDot, { backgroundColor: ['delivering', 'completed'].includes(order.status) ? COLORS.success : COLORS.border }]}>
                     <Ionicons name="bicycle" size={12} color={COLORS.white} />
                  </View>
                  <View style={[styles.stepLine, { backgroundColor: COLORS.border }]} />
                  <View style={styles.stepContent}>
                     <Text style={styles.stepTitle}>Đang giao</Text>
                     <Text style={styles.stepTime}>{order.deliveryAddress || 'Địa chỉ khách hàng'}</Text>
                  </View>
               </View>
               <View style={styles.stepItem}>
                  <View style={[styles.stepDot, { backgroundColor: order.status === 'completed' ? COLORS.success : COLORS.border }]}>
                     <View style={styles.innerDot} />
                  </View>
                  <View style={styles.stepContent}>
                     <Text style={[styles.stepTitle, order.status !== 'completed' && { color: COLORS.textLight }]}>Đã giao thành công</Text>
                     <Text style={styles.stepTime}>{order.status === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}</Text>
                  </View>
               </View>
            </View>

            {order.status === 'preparing' && (
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => handleUpdateStatus('delivering')}
              >
                 <View style={styles.sliderThumb}>
                    <Ionicons name="chevron-forward-outline" size={24} color={COLORS.white} />
                 </View>
                 <Text style={styles.completeText}>NHẬN HÀNG & BẮT ĐẦU GIAO</Text>
              </TouchableOpacity>
            )}

            {order.status === 'delivering' && (
              <View style={[styles.completeButton, { backgroundColor: '#E8F8F5', borderColor: COLORS.success, overflow: 'hidden' }]}>
                 <Animated.View 
                    style={[
                      styles.sliderThumb, 
                      { backgroundColor: COLORS.success },
                      { transform: [{ translateX: sliderAnimation }] }
                    ]}
                    {...panResponder.panHandlers}
                 >
                    <Ionicons name="chevron-forward-outline" size={24} color={COLORS.white} />
                 </Animated.View>
                 <Text style={[styles.completeText, { color: COLORS.success, zIndex: -1 }]}>TRƯỢT ĐỂ HOÀN THÀNH GIAO</Text>
              </View>
            )}

            {order.status === 'completed' && (
              <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.success, fontWeight: '700' }}>ĐƠN HÀNG ĐÃ HOÀN THÀNH</Text>
              </View>
            )}
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  header: {
    backgroundColor: 'rgba(253, 245, 242, 0.8)',
    marginHorizontal: SIZES.padding,
    borderRadius: 20,
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
  topBanner: {
    position: 'absolute',
    top: 120,
    left: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: '#1B1B1B',
    borderRadius: 25,
    padding: SIZES.padding / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  bannerInfo: {
    marginLeft: SIZES.padding / 2,
  },
  bannerDistance: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 24,
  },
  bannerText: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: SIZES.padding,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    ...FONTS.h4,
    color: COLORS.success,
    fontSize: 10,
  },
  timeBox: {
    alignItems: 'flex-end',
  },
  timeValue: {
    ...FONTS.h1,
    color: COLORS.secondary,
    fontSize: 32,
    lineHeight: 32,
  },
  timeLabel: {
    ...FONTS.h2,
    color: COLORS.secondary,
    fontSize: 18,
    marginTop: -5,
  },
  timeEstimate: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
    padding: SIZES.base,
    borderRadius: 20,
    marginBottom: SIZES.padding,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...FONTS.h3,
    fontSize: 16,
  },
  customerAddress: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  steps: {
    marginBottom: SIZES.padding,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  stepLine: {
    position: 'absolute',
    left: 11.5,
    top: 24,
    width: 1,
    height: 35,
    backgroundColor: COLORS.secondary,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 15,
  },
  stepTitle: {
    ...FONTS.h4,
    fontSize: 14,
  },
  stepTime: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  completeButton: {
    height: 64,
    backgroundColor: '#FDEDEC',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(211, 84, 0, 0.1)',
  },
  sliderThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  completeText: {
    ...FONTS.h4,
    color: 'rgba(211, 84, 0, 0.3)',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 2,
  },
  sparkle: {
    marginRight: 10,
  },
});

export default DeliveryDetailScreen;
