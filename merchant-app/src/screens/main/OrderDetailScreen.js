import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Phone, MapPin, Clock, CreditCard, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { request, API_URL } from '../../api/client';
import io from 'socket.io-client/dist/socket.io.js';

const { width } = Dimensions.get('window');

const OrderDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = async () => {
    try {
      const data = await request(`/orders/${orderId}`);
      setOrder(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
      console.log('Error loading order detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
    let socket;
    
    if (!socket) {
      const socketUrl = API_URL.replace('/api', '');
      socket = io(socketUrl);
      
      socket.on('order_status_updated', (data) => {
        if (data._id === orderId || data.id === orderId) {
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
      fetchOrderDetail();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật trạng thái đơn hàng');
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'CHỜ DUYỆT';
      case 'confirmed': return 'ĐÃ XÁC NHẬN';
      case 'preparing': return 'ĐANG CHUẨN BỊ';
      case 'delivering': return 'ĐANG GIAO';
      case 'completed': return 'ĐÃ HOÀN THÀNH';
      case 'cancelled': return 'ĐÃ HỦY';
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed': return '#E67E22';
      case 'preparing': return '#3498DB';
      case 'delivering':
      case 'completed': return '#2ECC71';
      default: return '#E53935';
    }
  };

  // Build items array
  const items = order.items || [];
  const orderTime = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>Chi tiết đơn #{order._id.substring(order._id.length - 6).toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Info */}
        <View style={styles.customerCard}>
          <View style={styles.customerTop}>
            <Image 
              source={{ uri: order.userId?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} 
              style={styles.avatar} 
            />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.userId?.fullName || 'Khách hàng'}</Text>
              <Text style={styles.customerPhone}>{order.userId?.phone || 'Chưa cung cấp SĐT'}</Text>
              <Text style={styles.customerType}>Khách hàng trên hệ thống</Text>
            </View>
            <TouchableOpacity style={styles.messageBtn}>
              <MessageSquare size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressRow}>
            <View style={styles.iconCircle}>
              <MapPin size={16} color={Colors.primary} />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>ĐỊA CHỈ GIAO HÀNG</Text>
              <Text style={styles.addressText}>{order.deliveryAddress || 'Chưa cung cấp địa chỉ'}</Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>THỜI GIAN ĐẶT</Text>
            <Text style={styles.detailValue}>{orderTime}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>LOẠI THANH TOÁN</Text>
            <Text style={[styles.detailValue, { color: '#F1C40F' }]}>{order.paymentMethod === 'cash' ? 'Tiền mặt' : 'Online'}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>TRẠNG THÁI</Text>
            <Text style={[styles.detailValue, { color: getStatusColor(order.status) }]}>{getStatusLabel(order.status)}</Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image 
                source={{ uri: item.foodId?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' }} 
                style={styles.itemImage} 
              />
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.foodId?.name || 'Món ăn'}</Text>
                  <Text style={styles.itemPrice}>{item.price?.toLocaleString()}đ</Text>
                </View>
                <Text style={styles.itemQty}>Số lượng: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính ({items.length} món)</Text>
            <Text style={styles.summaryValue}>
              {items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toLocaleString()}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng & Dịch vụ</Text>
            <Text style={styles.summaryValue}>0đ</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mã giảm giá ({order.promoCode})</Text>
              <Text style={[styles.summaryValue, { color: Colors.primary }]}>-{order.discountAmount.toLocaleString()}đ</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.totalValue}>{order.totalPrice?.toLocaleString()}đ</Text>
              <Text style={styles.totalVat}>đã bao gồm thuế và phí</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Footer */}
      {order.status === 'pending' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleUpdateStatus('cancelled')}>
            <Text style={styles.secondaryBtnText}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => handleUpdateStatus('confirmed')}>
            <Text style={styles.primaryBtnText}>Chấp nhận</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'confirmed' && (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={() => handleUpdateStatus('preparing')}>
            <Text style={styles.primaryBtnText}>Bắt đầu làm món</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'preparing' && (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={() => handleUpdateStatus('delivering')}>
            <Text style={styles.primaryBtnText}>Chuẩn bị xong - Giao Shipper</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  customerCard: {
    backgroundColor: '#FFF1F0',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  customerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  customerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  customerType: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
  },
  messageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBox: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
  },
  mapContainer: {
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(193, 70, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: Colors.white,
    fontWeight: '900',
    letterSpacing: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  itemQty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  itemNoteBadge: {
    backgroundColor: '#2ECC7115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  itemNoteText: {
    fontSize: 10,
    color: '#2ECC71',
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: '#FFF1F0',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFEBE6',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteContent: {
    flex: 1,
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },
  summaryBox: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  totalValueContainer: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  totalVat: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  secondaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1E6E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  primaryBtn: {
    flex: 2,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  }
});

export default OrderDetailScreen;
