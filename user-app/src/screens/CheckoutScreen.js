import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, MapPin, ChevronRight, CreditCard, DollarSign } from 'lucide-react-native';
import { request } from '../api/client';

const CheckoutScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { cart, appliedPromos = {}, total: cartTotal = 0, totalPromoDiscount = 0 } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await request('/auth/profile');
        setUserProfile(profile);
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.foodId?.price || 0) * item.quantity, 0);
  
  const groupedItems = items.reduce((acc, item) => {
    const rId = item.foodId?.restaurantId?._id || item.foodId?.restaurantId?.id || item.foodId?.restaurantId;
    if (rId) acc[rId] = true;
    return acc;
  }, {});
  const numberOfRestaurants = Object.keys(groupedItems).length;
  
  const shippingFee = subtotal > 0 ? (15000 * numberOfRestaurants) : 0;
  const paymentDiscount = (paymentMethod === 'momo' ? 15000 : 0);
  
  // Recalculate total with payment discount
  const total = Math.max(0, cartTotal - paymentDiscount);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Lỗi', 'Không có sản phẩm trong giỏ hàng');
      return;
    }

    setLoading(true);
    try {
      const itemsByRest = items.reduce((acc, item) => {
        const rId = item.foodId?.restaurantId?._id || item.foodId?.restaurantId?.id || item.foodId?.restaurantId;
        if (rId) {
          if (!acc[rId]) acc[rId] = [];
          acc[rId].push(item);
        }
        return acc;
      }, {});

      const numOfRest = Object.keys(itemsByRest).length;

      await Promise.all(Object.keys(itemsByRest).map(async (rId) => {
        const groupItems = itemsByRest[rId];
        const groupOrderItems = groupItems.map(item => ({
          foodId: item.foodId?._id || item.foodId,
          quantity: item.quantity,
          price: item.foodId?.price || 0
        }));

        const groupSubtotal = groupItems.reduce((sum, item) => sum + (item.foodId?.price || 0) * item.quantity, 0);
        const groupShippingFee = 15000;
        
        let promoCode = '';
        let discountAmount = 0;
        const promo = appliedPromos[rId];
        if (promo) {
          promoCode = promo.code;
          discountAmount = promo.discountType === 'percentage' 
            ? (groupSubtotal * promo.discountValue) / 100 
            : promo.discountValue;
          if (discountAmount > groupSubtotal) discountAmount = groupSubtotal;
        }

        const momoDiscount = paymentMethod === 'momo' ? (15000 / numOfRest) : 0;
        const groupTotal = Math.max(0, groupSubtotal + groupShippingFee - discountAmount - momoDiscount);

        return request('/orders', {
          method: 'POST',
          body: {
            restaurantId: rId,
            items: groupOrderItems,
            totalPrice: groupTotal,
            deliveryAddress: userProfile?.address || "Chưa cập nhật địa chỉ",
            paymentMethod,
            promoCode,
            discountAmount,
            shippingFee: groupShippingFee
          }
        });
      }));

      navigation.reset({
        index: 1,
        routes: [
          { name: 'Main', params: { screen: 'Đơn hàng' } }
        ]
      });
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể đặt hàng, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: 130 + insets.bottom }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}><MapPin size={18} color={COLORS.primary} /></View>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <TouchableOpacity><Text style={styles.changeText}>Thay đổi</Text></TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.userName}>{userProfile?.fullName || 'Khách hàng'} | {userProfile?.phone || 'Chưa có SĐT'}</Text>
              <Text style={styles.addressDetail}>{userProfile?.address || 'Chưa cập nhật địa chỉ'}</Text>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=100&auto=format&fit=crop' }} 
              style={styles.mapThumb} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}><CreditCard size={18} color={COLORS.primary} /></View>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'momo' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('momo')}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.paymentIcon, { backgroundColor: '#A50064' }]}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' }} style={styles.momoLogo} />
              </View>
              <View>
                <Text style={styles.paymentName}>Ví MoMo</Text>
                <Text style={styles.paymentDesc}>Ưu đãi giảm 15k cho đơn từ 100k</Text>
              </View>
            </View>
            <View style={[styles.radio, paymentMethod === 'momo' && styles.radioActive]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'cash' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.paymentIcon, { backgroundColor: '#4CAF50' }]}>
                <DollarSign size={20} color={COLORS.white} />
              </View>
              <Text style={styles.paymentName}>Tiền mặt</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'cash' && styles.radioActive]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.paymentIcon, { backgroundColor: '#FF9800' }]}>
                <CreditCard size={20} color={COLORS.white} />
              </View>
              <Text style={styles.paymentName}>Thẻ Tín dụng/Ghi nợ</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'card' && styles.radioActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}><Text style={{ fontWeight: 'bold', color: COLORS.primary }}>📋</Text></View>
            <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          </View>
          <View style={styles.summaryCard}>
            {Object.values(groupedItems).map((_, index, arr) => {
              const rId = Object.keys(groupedItems)[index];
              const isLast = index === arr.length - 1;
              const groupItems = items.filter(i => (i.foodId?.restaurantId?._id || i.foodId?.restaurantId?.id || i.foodId?.restaurantId) === rId);
              const groupSubtotal = groupItems.reduce((sum, i) => sum + (i.foodId?.price || 0) * i.quantity, 0);
              
              const promo = appliedPromos[rId];
              let discount = 0;
              if (promo) {
                discount = promo.discountType === 'percentage' 
                  ? (groupSubtotal * promo.discountValue) / 100 
                  : promo.discountValue;
                if (discount > groupSubtotal) discount = groupSubtotal;
              }

              const restaurantName = groupItems[0]?.foodId?.restaurantId?.name || `Nhà hàng ${index + 1}`;

              return (
                <View key={rId} style={{ marginBottom: isLast ? 0 : 15, paddingBottom: isLast ? 0 : 10, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8, color: COLORS.text }}>{restaurantName}</Text>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Tạm tính ({groupItems.length} món)</Text>
                    <Text style={styles.summaryValue}>{groupSubtotal.toLocaleString()}đ</Text>
                  </View>
                  {promo && (
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Mã giảm giá ({promo.code})</Text>
                      <Text style={[styles.summaryValue, { color: COLORS.green }]}>-{discount.toLocaleString()}đ</Text>
                    </View>
                  )}
                </View>
              );
            })}

            <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 15 }} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Phí giao hàng tổng cộng</Text>
              <Text style={styles.summaryValue}>{shippingFee.toLocaleString()}đ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Giảm giá phí giao hàng</Text>
              <Text style={[styles.summaryValue, { color: COLORS.green }]}>-{shippingFee.toLocaleString()}đ</Text>
            </View>
            {paymentMethod === 'momo' && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Khuyến mãi MoMo</Text>
                <Text style={[styles.summaryValue, { color: COLORS.green }]}>-15.000đ</Text>
              </View>
            )}
            <View style={[styles.summaryItem, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View>
          <Text style={styles.footerTotalLabel}>Tổng cộng</Text>
          <Text style={styles.footerTotalValue}>{total.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity 
          style={styles.orderBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.orderText}>Đặt hàng ngay</Text>
        </TouchableOpacity>
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
    paddingVertical: SIZES.base * 2,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.extraLarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  changeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  addressInfo: {
    flex: 1,
    marginRight: 15,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  mapThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  selectedPayment: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF8F5',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  momoLogo: {
    width: 24,
    height: 24,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paymentDesc: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderWidth: 5,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: 20,
    ...SHADOWS.light,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  footerTotalLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  footerTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    paddingHorizontal: 40,
    borderRadius: 28,
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  orderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default CheckoutScreen;
