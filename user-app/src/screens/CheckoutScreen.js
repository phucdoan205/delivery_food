import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, MapPin, ChevronRight, CreditCard, DollarSign } from 'lucide-react-native';

const CheckoutScreen = ({ navigation }) => {
  const [paymentMethod, setPaymentMethod] = useState('momo');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}><MapPin size={18} color={COLORS.primary} /></View>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <TouchableOpacity><Text style={styles.changeText}>Thay đổi</Text></TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.userName}>Nguyễn Văn A | 090 123 4567</Text>
              <Text style={styles.addressDetail}>123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</Text>
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
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng tiền món</Text>
              <Text style={styles.summaryValue}>130.000đ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Phí giao hàng (2.5km)</Text>
              <Text style={styles.summaryValue}>15.000đ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Giảm giá phí giao hàng</Text>
              <Text style={[styles.summaryValue, { color: COLORS.green }]}>-15.000đ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Khuyến mãi MoMo</Text>
              <Text style={[styles.summaryValue, { color: COLORS.green }]}>-15.000đ</Text>
            </View>
            <View style={[styles.summaryItem, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>115.000đ</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>Tổng cộng</Text>
          <Text style={styles.footerTotalValue}>115.000đ</Text>
        </View>
        <TouchableOpacity 
          style={styles.orderBtn}
          onPress={() => alert('Đặt hàng thành công!')}
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
    borderRadius: SIZES.radiusLarge,
    padding: 15,
    ...SHADOWS.light,
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
    padding: 15,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedPayment: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF8F5',
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
    borderTopColor: COLORS.border,
    paddingBottom: 30,
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
