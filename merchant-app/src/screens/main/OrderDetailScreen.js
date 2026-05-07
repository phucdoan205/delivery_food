import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ChevronLeft, MessageSquare, Phone, MapPin, Clock, CreditCard, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const OrderDetailScreen = ({ navigation, route }) => {
  // Using fixed mock data for now, would normally come from route.params
  const order = {
    id: 'JTL-8629',
    status: 'new',
    customer: {
      name: 'Lê Minh Hoàng',
      phone: '+84 901 234 567',
      address: '245/10 Bùi Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200'
    },
    items: [
      { name: 'Bún Chả Hà Nội Đặc Biệt', quantity: 1, price: 85000, note: 'Ghi chú: Nhiều rau khoai, ít bún', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
      { name: 'Nem Cua Bể Hải Phòng', quantity: 2, price: 45000, image: 'https://images.unsplash.com/photo-1621852003470-320a162a4b0c?w=200' },
      { name: 'Trà Đá Chanh Sả', quantity: 2, price: 30000, note: 'Ghi chú: Không đường', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200' }
    ],
    time: '18:45',
    eta: '19:15 (30p)',
    payment: 'Chuyển khoản',
    note: '"Vui lòng giao trước 19:15 vì khách có cuộc họp. Shipper để đồ ở quầy lễ tân nếu không gọi được. Cảm ơn!"',
    summary: {
      subtotal: 235000,
      fee: 25000,
      discount: -15000,
      total: 245000
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng #{order.id}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>MỚI</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Info */}
        <View style={styles.customerCard}>
          <View style={styles.customerTop}>
            <Image source={{ uri: order.customer.avatar }} style={styles.avatar} />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.customer.name}</Text>
              <Text style={styles.customerPhone}>{order.customer.phone}</Text>
              <Text style={styles.customerType}>Khách hàng thân thiết</Text>
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
              <Text style={styles.addressText}>{order.customer.address}</Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>THỜI GIAN ĐẶT</Text>
            <Text style={styles.detailValue}>{order.time}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>DỰ KIẾN GIAO</Text>
            <Text style={[styles.detailValue, { color: '#2ECC71' }]}>{order.eta}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>THANH TOÁN</Text>
            <Text style={[styles.detailValue, { color: '#F1C40F' }]}>{order.payment}</Text>
          </View>
        </View>

        {/* Map Preview Placeholder */}
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600' }} 
            style={styles.mapImage} 
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>MAP PREVIEW</Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
          </View>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString()}đ</Text>
                </View>
                <Text style={styles.itemQty}>Số lượng: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}</Text>
                {item.note && (
                  <View style={styles.itemNoteBadge}>
                    <Text style={styles.itemNoteText}>{item.note}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Order Note */}
        <View style={styles.noteBox}>
          <View style={styles.noteIcon}>
            <Text>📝</Text>
          </View>
          <View style={styles.noteContent}>
            <Text style={styles.noteLabel}>GHI CHÚ CHUNG CỦA ĐƠN HÀNG</Text>
            <Text style={styles.noteText}>{order.note}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính (3 món)</Text>
            <Text style={styles.summaryValue}>{order.summary.subtotal.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí dịch vụ & Vận chuyển</Text>
            <Text style={styles.summaryValue}>{order.summary.fee.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giảm giá voucher</Text>
            <Text style={[styles.summaryValue, { color: '#2ECC71' }]}>-{Math.abs(order.summary.discount).toLocaleString()}đ</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.totalValue}>{order.summary.total.toLocaleString()}đ</Text>
              <Text style={styles.totalVat}>đã bao gồm thuế và phí</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Từ chối</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Chấp nhận đơn hàng</Text>
        </TouchableOpacity>
      </View>
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
