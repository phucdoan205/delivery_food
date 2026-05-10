import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { MapPin, Search as ChevronRight, Search as RotateCcw } from 'lucide-react-native';
import { ORDER_HISTORY } from '../constants/mockData';

const OrderHistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Hiện tại');

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => item.isCurrent && navigation.navigate('OrderTracking')}
    >
      {item.isCurrent ? (
        <>
          <Image source={{ uri: item.image }} style={styles.currentOrderImage} />
          <View style={styles.currentOrderInfo}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>ĐANG THỰC HIỆN</Text>
            </View>
            <Text style={styles.restaurantName}>{item.restaurant}</Text>
            <Text style={styles.orderTime}>Sắp đến trong {item.time}</Text>
            <View style={styles.itemsRow}>
              <Text style={styles.orderItems} numberOfLines={1}>🍽️ {item.items}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.trackBtn} onPress={() => navigation.navigate('OrderTracking')}>
                <MapPin size={16} color={COLORS.white} />
                <Text style={styles.trackBtnText}>Theo dõi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.pastOrderContainer}>
          <Image source={{ uri: item.image }} style={styles.pastOrderImage} />
          <View style={styles.pastOrderInfo}>
            <View style={styles.pastOrderHeader}>
              <Text style={styles.restaurantNameSmall}>{item.restaurant}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>
            <Text style={styles.orderItemsSmall} numberOfLines={1}>{item.items}</Text>
            <View style={styles.pastOrderFooter}>
              <Text style={styles.priceSmall}>${item.total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.reorderBtn}>
                <RotateCcw size={14} color={COLORS.primary} />
                <Text style={styles.reorderBtnText}>Đặt lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationHeader}>
          <MapPin size={16} color={COLORS.primary} fill={COLORS.primary} />
          <Text style={styles.locationText}>Vị trí hiện tại</Text>
        </View>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }} 
          style={styles.avatar} 
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Lịch sử ăn uống</Text>
        <Text style={styles.subtitle}>
          Xem lại những cuộc phiêu lưu ẩm thực và theo dõi các đơn hàng hiện tại.
        </Text>

        <View style={styles.tabContainer}>
          {['Hiện tại', 'Đã xong'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Hiện tại' && (
          <FlatList
            data={ORDER_HISTORY.filter(o => o.isCurrent)}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <Text style={styles.sectionTitle}>Đang giao</Text>}
          />
        )}

        {activeTab === 'Đã xong' && (
          <FlatList
            data={ORDER_HISTORY.filter(o => !o.isCurrent)}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <Text style={styles.sectionTitle}>Kỷ niệm gần đây</Text>}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 5,
    fontWeight: '500',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: 'rgba(178, 58, 0, 0.1)',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 20,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginBottom: 20,
    ...SHADOWS.light,
    overflow: 'hidden',
  },
  currentOrderImage: {
    width: '100%',
    height: 180,
  },
  currentOrderInfo: {
    padding: 15,
  },
  tagBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemsRow: {
    marginTop: 10,
  },
  orderItems: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pastOrderContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  pastOrderImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  pastOrderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  pastOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantNameSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  orderItemsSmall: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  pastOrderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceSmall: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  }
});

export default OrderHistoryScreen;
