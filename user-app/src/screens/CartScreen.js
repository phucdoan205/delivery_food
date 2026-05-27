import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, ChevronRight, Minus, Plus, Tag } from 'lucide-react-native';
import { request } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState(null);

  const fetchCart = async () => {
    try {
      const data = await request('/cart');
      setCart(data);
    } catch (error) {
      console.log('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    const loadPromo = async () => {
      const savedPromo = await AsyncStorage.getItem('appliedPromo');
      if (savedPromo) {
        setPromo(JSON.parse(savedPromo));
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadPromo();
    });
    loadPromo();
    
    return unsubscribe;
  }, [navigation]);

  const handleUpdateQuantity = async (foodId, change) => {
    const item = cart?.items?.find(i => (i.foodId?._id || i.foodId) === foodId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(foodId);
      return;
    }

    try {
      await request('/cart', {
        method: 'POST',
        body: { foodId, quantity: change }
      });
      fetchCart();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (foodId) => {
    try {
      await request(`/cart/${foodId}`, {
        method: 'DELETE'
      });
      fetchCart();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xoá món ăn');
    }
  };

  const handleClearCart = async () => {
    try {
      await request('/cart', { method: 'DELETE' });
      setCart({ items: [] });
      await AsyncStorage.removeItem('appliedPromo');
      setPromo(null);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xoá giỏ hàng');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.foodId?.price || 0) * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 15000 : 0;
  const shippingDiscount = shippingFee; // Free ship for demo
  
  // Find a representative restaurant name if items exist
  const firstItem = items[0];
  const restaurantId = firstItem?.foodId?.restaurantId?._id || firstItem?.foodId?.restaurantId?.id;
  const restaurantName = firstItem?.foodId?.restaurantId?.name || "Cửa hàng đối tác";
  const restaurantAddress = firstItem?.foodId?.restaurantId?.address || "Hà Nội, Việt Nam";
  const restaurantImage = firstItem?.foodId?.restaurantId?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=100&auto=format&fit=crop';

  let promoDiscount = 0;
  if (promo && promo.restaurantId === restaurantId) {
    if (promo.discountType === 'percentage') {
      promoDiscount = (subtotal * promo.discountValue) / 100;
    } else {
      promoDiscount = promo.discountValue;
    }
    // Cap discount to not exceed subtotal
    if (promoDiscount > subtotal) promoDiscount = subtotal;
  }

  const total = subtotal + shippingFee - shippingDiscount - promoDiscount;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }} 
            style={{ width: 120, height: 120, opacity: 0.5, marginBottom: 20 }} 
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Giỏ hàng của bạn đang trống</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 }}>Hãy quay lại trang chủ và khám phá các món ăn ngon nhé.</Text>
          <TouchableOpacity 
            style={{ backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }}
            onPress={() => navigation.navigate('Trang chủ')}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        <TouchableOpacity onPress={handleClearCart}><Text style={styles.clearAll}>Xoá tất cả</Text></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.restaurantSection}>
          <Image 
            source={{ uri: restaurantImage }} 
            style={styles.restaurantThumb} 
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            <Text style={styles.restaurantAddr}>{restaurantAddress}</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </View>

        {items.map((item) => {
          const food = item.foodId;
          if (!food) return null;
          return (
            <View key={food._id} style={styles.cartItem}>
              <Image source={{ uri: food.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{food.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>{food.description}</Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>{food.price.toLocaleString()}đ</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.qBtn}
                      onPress={() => handleUpdateQuantity(food._id, -1)}
                    >
                      <Minus size={14} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qBtn}
                      onPress={() => handleUpdateQuantity(food._id, 1)}
                    >
                      <Plus size={14} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.voucherSection}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Mã giảm giá (Voucher)</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.chooseVoucher}>Chọn ưu đãi</Text></TouchableOpacity>
          </View>
          <View style={styles.voucherInputRow}>
            {promo && promo.restaurantId === restaurantId ? (
              <View style={[styles.voucherInput, { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
                <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>{promo.code}</Text>
                <Text style={{ color: '#2E7D32', marginLeft: 10 }}>
                  (Giảm {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${promo.discountValue.toLocaleString()}đ`})
                </Text>
              </View>
            ) : (
              <TextInput 
                style={styles.voucherInput} 
                placeholder="Nhập mã ưu đãi tại đây..." 
                placeholderTextColor={COLORS.textLight}
              />
            )}
            {promo && promo.restaurantId === restaurantId ? (
              <TouchableOpacity style={[styles.applyBtn, { backgroundColor: '#F44336' }]} onPress={async () => {
                await AsyncStorage.removeItem('appliedPromo');
                setPromo(null);
              }}>
                <Text style={styles.applyText}>Gỡ</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.applyBtn}><Text style={styles.applyText}>Áp dụng</Text></TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>CHI TIẾT ĐƠN HÀNG</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính ({items.length} món)</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng (2.4 km)</Text>
            <Text style={styles.summaryValue}>{shippingFee.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.discountRow}>
              <Text style={styles.summaryLabel}>Giảm giá phí giao hàng </Text>
              <View style={styles.freeBadge}><Text style={styles.freeText}>FREE</Text></View>
            </View>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>-{shippingDiscount.toLocaleString()}đ</Text>
          </View>
          {promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mã giảm giá ({promo.code})</Text>
              <Text style={[styles.summaryValue, { color: COLORS.green }]}>-{promoDiscount.toLocaleString()}đ</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addressBar}>
          <MapPin size={16} color={COLORS.textLight} />
          <Text style={styles.addressText} numberOfLines={1}>Gửi đến: 123 Lê Lợi, Phường Bến Thành, Quận 1</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalFooterLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalFooterValue}>{total.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => navigation.navigate('Checkout', { cart, promoDiscount, promoCode: promo?.code, total })}
        >
          <Text style={styles.payText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MapPin = ({ size, color }) => (
  <View style={{ marginRight: 8 }}><ArrowLeft size={size} color={color} style={{ transform: [{ rotate: '-90deg' }] }} /></View>
);

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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearAll: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  content: {
    padding: SIZES.padding,
  },
  restaurantSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E8',
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.extraLarge,
  },
  restaurantThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  restaurantAddr: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 15,
    ...SHADOWS.light,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemDesc: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 4,
  },
  qBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  voucherSection: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 15,
    ...SHADOWS.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  chooseVoucher: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  voucherInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  voucherInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  summarySection: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: 20,
    ...SHADOWS.light,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 15,
    letterSpacing: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  freeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 100,
    paddingHorizontal: 10,
  },
  addressText: {
    fontSize: 11,
    color: COLORS.textLight,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 30,
  },
  totalFooterLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  totalFooterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    paddingHorizontal: 30,
    borderRadius: 28,
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  payText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default CartScreen;
