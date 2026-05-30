import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, ChevronRight, Minus, Plus, Tag, Search, X, Ticket } from 'lucide-react-native';
import { request } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [savedPromos, setSavedPromos] = useState([]);
  const [appliedPromos, setAppliedPromos] = useState({});
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [searchPromo, setSearchPromo] = useState('');

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
    const loadData = async () => {
      fetchCart();
      try {
        const promos = await request('/promotions/user/saved');
        setSavedPromos(promos || []);
      } catch (e) {}
    };
    
    const unsubscribe = navigation.addListener('focus', loadData);
    loadData();
    
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
      setAppliedPromos({});
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xoá giỏ hàng');
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const items = cart?.items || [];
  
  // Group items by restaurant
  const groupedItems = items.reduce((acc, item) => {
    const restaurant = item.foodId?.restaurantId;
    if (!restaurant) return acc;
    const rId = restaurant._id || restaurant.id;
    if (!acc[rId]) {
      acc[rId] = {
        restaurant,
        items: [],
        subtotal: 0
      };
    }
    acc[rId].items.push(item);
    acc[rId].subtotal += (item.foodId?.price || 0) * item.quantity;
    return acc;
  }, {});

  let totalSubtotal = 0;
  let totalShipping = 0;
  let totalShippingDiscount = 0;
  let totalPromoDiscount = 0;

  Object.values(groupedItems).forEach(group => {
    totalSubtotal += group.subtotal;
    totalShipping += 15000; // 15k per restaurant
    totalShippingDiscount += 15000; // Free ship demo

    const rId = group.restaurant._id || group.restaurant.id;
    const promo = appliedPromos[rId];
    if (promo) {
      let discount = promo.discountType === 'percentage' 
        ? (group.subtotal * promo.discountValue) / 100 
        : promo.discountValue;
      if (discount > group.subtotal) discount = group.subtotal;
      totalPromoDiscount += discount;
    }
  });

  const total = totalSubtotal + totalShipping - totalShippingDiscount - totalPromoDiscount;

  const handleSelectPromo = (promo) => {
    const rId = promo.restaurantId?._id || promo.restaurantId;
    if (!groupedItems[rId]) {
      Alert.alert('Lỗi', 'Mã giảm giá này không áp dụng cho các nhà hàng trong giỏ hàng.');
      return;
    }
    setAppliedPromos(prev => ({ ...prev, [rId]: promo }));
    setPromoModalVisible(false);
    setSearchPromo('');
  };

  const handleRemovePromo = (rId) => {
    setAppliedPromos(prev => {
      const copy = { ...prev };
      delete copy[rId];
      return copy;
    });
  };

  // Filter promos for modal
  const applicablePromos = savedPromos.filter(p => {
    const rId = p.restaurantId?._id || p.restaurantId;
    return !!groupedItems[rId];
  });
  
  const displayPromos = applicablePromos.filter(p => 
    p.code.toLowerCase().includes(searchPromo.toLowerCase()) || 
    p.title.toLowerCase().includes(searchPromo.toLowerCase())
  );

  if (items.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
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
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        <TouchableOpacity onPress={handleClearCart}><Text style={styles.clearAll}>Xoá tất cả</Text></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: 130 + insets.bottom }]}>
        
        {Object.values(groupedItems).map(group => {
          const rId = group.restaurant._id || group.restaurant.id;
          return (
            <View key={rId} style={{ marginBottom: 20 }}>
              <View style={styles.restaurantSection}>
                <Image 
                  source={{ uri: group.restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=100&auto=format&fit=crop' }} 
                  style={styles.restaurantThumb} 
                />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{group.restaurant.name}</Text>
                  <Text style={styles.restaurantAddr}>{group.restaurant.address || "Việt Nam"}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textLight} />
              </View>

              {group.items.map((item) => {
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
            </View>
          );
        })}

        <View style={styles.voucherSection}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Mã giảm giá (Voucher)</Text>
            <TouchableOpacity onPress={() => setPromoModalVisible(true)}><Text style={styles.chooseVoucher}>Chọn ưu đãi</Text></TouchableOpacity>
          </View>
          
          {Object.values(appliedPromos).map(promo => {
            const rId = promo.restaurantId?._id || promo.restaurantId;
            return (
              <View key={promo._id} style={[styles.voucherInputRow, { marginBottom: 10 }]}>
                <View style={[styles.voucherInput, { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
                  <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>{promo.code}</Text>
                  <Text style={{ color: '#2E7D32', marginLeft: 10, fontSize: 11, flex: 1 }} numberOfLines={1}>
                    (Giảm {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${promo.discountValue.toLocaleString()}đ`} cho {promo.restaurantId?.name})
                  </Text>
                </View>
                <TouchableOpacity style={[styles.applyBtn, { backgroundColor: '#F44336' }]} onPress={() => handleRemovePromo(rId)}>
                  <Text style={styles.applyText}>Gỡ</Text>
                </TouchableOpacity>
              </View>
            )
          })}
          
          <TouchableOpacity style={styles.voucherInputRow} onPress={() => setPromoModalVisible(true)}>
            <View style={[styles.voucherInput, { justifyContent: 'center' }]}>
              <Text style={{ color: COLORS.textLight }}>Nhập hoặc chọn thêm mã ưu đãi...</Text>
            </View>
            <View style={styles.applyBtn}><Text style={styles.applyText}>Thêm</Text></View>
          </TouchableOpacity>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>CHI TIẾT ĐƠN HÀNG</Text>
          
          {Object.values(groupedItems).map(group => {
            const rId = group.restaurant._id || group.restaurant.id;
            const promo = appliedPromos[rId];
            let discount = 0;
            if (promo) {
              discount = promo.discountType === 'percentage' 
                ? (group.subtotal * promo.discountValue) / 100 
                : promo.discountValue;
              if (discount > group.subtotal) discount = group.subtotal;
            }
            
            return (
              <View key={rId} style={{ marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 8, color: COLORS.text }}>{group.restaurant.name}</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính ({group.items.length} món)</Text>
                  <Text style={styles.summaryValue}>{group.subtotal.toLocaleString()}đ</Text>
                </View>
                {promo && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Mã giảm giá ({promo.code})</Text>
                    <Text style={[styles.summaryValue, { color: COLORS.green }]}>-{discount.toLocaleString()}đ</Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng tổng cộng</Text>
            <Text style={styles.summaryValue}>{totalShipping.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.discountRow}>
              <Text style={styles.summaryLabel}>Giảm giá phí giao hàng </Text>
              <View style={styles.freeBadge}><Text style={styles.freeText}>FREE</Text></View>
            </View>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>-{totalShippingDiscount.toLocaleString()}đ</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View>
          <Text style={styles.totalFooterLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalFooterValue}>{total.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => navigation.navigate('Checkout', { cart, appliedPromos, total, totalPromoDiscount })}
        >
          <Text style={styles.payText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={promoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPromoModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { paddingBottom: insets.bottom }]}>
          <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
              <TouchableOpacity onPress={() => setPromoModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchPromoContainer}>
              <Search size={20} color={COLORS.textLight} />
              <TextInput
                style={styles.searchPromoInput}
                placeholder="Nhập mã ưu đãi..."
                value={searchPromo}
                onChangeText={setSearchPromo}
              />
            </View>

            <FlatList
              data={displayPromos}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: COLORS.textLight, marginTop: 20 }}>
                  Không tìm thấy mã ưu đãi khả dụng.
                </Text>
              }
              renderItem={({ item }) => {
                const rId = item.restaurantId?._id || item.restaurantId;
                const isApplied = appliedPromos[rId]?._id === item._id;
                return (
                  <TouchableOpacity 
                    style={[styles.promoModalItem, isApplied && { borderColor: COLORS.primary, backgroundColor: '#FFF1E8' }]}
                    onPress={() => handleSelectPromo(item)}
                  >
                    <View style={styles.promoModalLeft}>
                      <Ticket size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.promoModalRight}>
                      <Text style={styles.promoModalTitle}>{item.title}</Text>
                      <Text style={styles.promoModalCode}>Mã: {item.code}</Text>
                      <Text style={styles.promoModalDesc} numberOfLines={2}>
                        Giảm {item.discountType === 'percentage' ? `${item.discountValue}%` : `${item.discountValue.toLocaleString()}đ`} tại {item.restaurantId?.name || 'nhà hàng'}
                      </Text>
                      <Text style={styles.promoModalExpiry}>Hết hạn: {new Date(item.endDate).toLocaleDateString('vi-VN')}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        </View>
      </Modal>

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
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  qBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qText: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    color: COLORS.text,
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
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 13,
    backgroundColor: '#FAFAFA',
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
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchPromoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 44,
  },
  searchPromoInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  promoModalItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  promoModalLeft: {
    width: 60,
    backgroundColor: '#FFF1E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoModalRight: {
    flex: 1,
    padding: 12,
  },
  promoModalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  promoModalCode: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  promoModalDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  promoModalExpiry: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 6,
  }
});

export default CartScreen;
