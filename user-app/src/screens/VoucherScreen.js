import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, FlatList, TextInput, Image, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Search, Search as Ticket, Search as Info, Search as Truck, Search as Utensils, Search as Zap } from 'lucide-react-native';
import { request } from '../api/client';

const VoucherScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [promoCode, setPromoCode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await request('/promotions/user/saved');
      setVouchers(data || []);
    } catch (e) {
      console.log('Error fetching vouchers:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderVoucherItem = ({ item }) => {
    let Icon = Ticket;
    let bgColor = '#FFF1E8';

    return (
      <View style={styles.voucherCard}>
        <View style={[styles.voucherLeft, { backgroundColor: bgColor }]}>
          <Icon size={24} color={COLORS.primary} />
          <Text style={styles.voucherValue}>{item.code}</Text>
        </View>
        <View style={styles.voucherRight}>
          <Text style={styles.voucherName}>{item.title}</Text>
          <Text style={styles.voucherDesc} numberOfLines={2}>
            Giảm {item.discountType === 'percentage' ? `${item.discountValue}%` : `${item.discountValue.toLocaleString()}đ`} tại {item.restaurantId?.name || 'nhà hàng'}
          </Text>
          <View style={styles.voucherFooter}>
            <View style={styles.expiryRow}>
              <Text style={{ fontSize: 10 }}>🕒</Text>
              <Text style={styles.expiryText}>Hết hạn: {new Date(item.endDate).toLocaleDateString('vi-VN')}</Text>
            </View>
            <TouchableOpacity style={styles.useBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.useBtnText}>DÙNG NGAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ưu đãi của tôi</Text>
        <TouchableOpacity>
          <Info size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập mã giảm giá..."
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <FlatList
            data={['Tất cả', 'Đồ ăn', 'Giao hàng', 'Thanh toán']}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.tab, activeTab === item && styles.activeTab]}
                onPress={() => setActiveTab(item)}
              >
                <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.tabsList}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={vouchers}
            renderItem={renderVoucherItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: COLORS.textLight }}>Bạn chưa nhận mã giảm giá nào.</Text>
              </View>
            )}
        />
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 5,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  applyBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  tabContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tabsList: {
    paddingRight: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFF1E8',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  activeTabText: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  featuredCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    ...SHADOWS.medium,
  },
  featuredIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  featuredLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  featuredTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  featuredBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  featuredBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  voucherLeft: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  voucherValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 5,
  },
  voucherRight: {
    flex: 1,
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.gray,
    borderStyle: 'dashed',
  },
  voucherName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  voucherDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 3,
  },
  voucherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginLeft: 5,
  },
  useBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  useBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
  },
  listContent: {
    paddingBottom: 30,
  },
  referralCard: {
    height: 150,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
  },
  referralImage: {
    width: '100%',
    height: '100%',
  },
  referralOverlay: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  referralTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  referralSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 2,
  },
  referralBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  referralBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default VoucherScreen;
