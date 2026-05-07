import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, ChevronRight, Minus, Plus, Tag } from 'lucide-react-native';

const CartScreen = ({ navigation }) => {
  const cartItems = [
    {
      id: '1',
      name: 'Steak Bò Wagyu Cao Cấp',
      description: 'Chín vừa, sốt tiêu đen, khoai tây nghiền',
      price: 450000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: '2',
      name: 'Salad Cá Hồi Na Uy',
      description: 'Rau mầm hữu cơ, sốt mè rang',
      price: 185000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=200&auto=format&fit=crop',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        <TouchableOpacity><Text style={styles.clearAll}>Xoá tất cả</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.restaurantSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=100&auto=format&fit=crop' }} 
            style={styles.restaurantThumb} 
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>The Gourmet Bistro - Quận 1</Text>
            <Text style={styles.restaurantAddr}>123 Lê Lợi, Phường Bến Thành</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </View>

        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()}đ</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.qBtn}><Minus size={14} color={COLORS.text} /></TouchableOpacity>
                  <Text style={styles.qText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qBtn}><Plus size={14} color={COLORS.text} /></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.voucherSection}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Mã giảm giá (Voucher)</Text>
            <TouchableOpacity><Text style={styles.chooseVoucher}>Chọn hoặc nhập mã</Text></TouchableOpacity>
          </View>
          <View style={styles.voucherInputRow}>
            <TextInput 
              style={styles.voucherInput} 
              placeholder="Nhập mã ưu đãi tại đây..." 
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity style={styles.applyBtn}><Text style={styles.applyText}>Áp dụng</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>CHI TIẾT ĐƠN HÀNG</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính (3 món)</Text>
            <Text style={styles.summaryValue}>820.000đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng (2.4 km)</Text>
            <Text style={styles.summaryValue}>15.000đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.discountRow}>
              <Text style={styles.summaryLabel}>Giảm giá phí giao hàng </Text>
              <View style={styles.freeBadge}><Text style={styles.freeText}>FREE</Text></View>
            </View>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>-15.000đ</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>820.000đ</Text>
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
          <Text style={styles.totalFooterValue}>820.000đ</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => navigation.navigate('Checkout')}
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
