import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Search, Search as Ticket, Search as Info, Search as Truck, Search as Utensils, Search as Zap } from 'lucide-react-native';
import { VOUCHERS } from '../constants/mockData';

const VoucherScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [promoCode, setPromoCode] = useState('');

  const renderVoucherItem = ({ item }) => {
    let Icon = Utensils;
    let bgColor = '#FFF1E8';
    if (item.type === 'FREE_SHIP') {
      Icon = Truck;
      bgColor = '#E8F5E9';
    } else if (item.type === 'CASH') {
      Icon = Zap;
      bgColor = '#FFFDE7';
    }

    return (
      <View style={styles.voucherCard}>
        <View style={[styles.voucherLeft, { backgroundColor: bgColor }]}>
          <Icon size={24} color={item.type === 'FREE_SHIP' ? COLORS.green : COLORS.primary} />
          <Text style={styles.voucherValue}>{item.value}</Text>
        </View>
        <View style={styles.voucherRight}>
          <Text style={styles.voucherName}>{item.name}</Text>
          <Text style={styles.voucherDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.voucherFooter}>
            <View style={styles.expiryRow}>
              <Text style={{ fontSize: 10 }}>🕒</Text>
              <Text style={styles.expiryText}>Hết hạn trong 2 ngày</Text>
            </View>
            <TouchableOpacity style={styles.useBtn}>
              <Text style={styles.useBtnText}>DÙNG NGAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <FlatList
          data={VOUCHERS}
          renderItem={renderVoucherItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View>
              <Text style={styles.sectionTitle}>Đặc quyền cho bạn</Text>
              <View style={styles.featuredCard}>
                <View style={styles.featuredIconContainer}>
                  <Utensils size={30} color={COLORS.primary} />
                </View>
                <Text style={styles.featuredLabel}>MÃ ĐỘC QUYỀN</Text>
                <Text style={styles.featuredTitle}>Giảm 50% Toàn menu</Text>
                <Text style={styles.featuredSubtitle}>Áp dụng cho mọi nhà hàng đối tác 12:14:00 - 16:00</Text>
                <TouchableOpacity style={styles.featuredBtn}>
                  <Text style={styles.featuredBtnText}>Dùng ngay</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionTitle}>Mã giảm giá khả dụng</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.referralCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop' }} 
                style={styles.referralImage} 
              />
              <View style={styles.referralOverlay}>
                <Text style={styles.referralTitle}>Mời bạn mới</Text>
                <Text style={styles.referralSubtitle}>Nhận ngay voucher 50.000đ</Text>
                <TouchableOpacity style={styles.referralBtn}>
                  <Text style={styles.referralBtnText}>Chia sẻ ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
