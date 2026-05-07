import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Star, Clock, MapPin, Search, Bell } from 'lucide-react-native';
import { FOOD_ITEMS } from '../constants/mockData';
import FoodCard from '../components/FoodCard';

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;

  const renderHeader = () => (
    <View style={styles.header}>
      <Image source={{ uri: restaurant.image }} style={styles.bannerImage} />
      <SafeAreaView style={styles.headerContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionBtn}><Search size={20} color={COLORS.text} /></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><Bell size={20} color={COLORS.text} /></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.restaurantInfoCard}>
        <View style={styles.infoTop}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerText}>ĐỐI TÁC</Text>
          </View>
        </View>
        <Text style={styles.address}>{restaurant.address} • Ẩm thực truyền thống</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Star size={16} color={COLORS.secondary} fill={COLORS.secondary} />
            <Text style={styles.statText}>{restaurant.rating} (500+)</Text>
          </View>
          <View style={styles.stat}>
            <Clock size={16} color={COLORS.primary} />
            <Text style={styles.statText}>{restaurant.time}</Text>
          </View>
          <View style={styles.stat}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.statText}>{restaurant.distance}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {['Món chính', 'Đồ uống', 'Khai vị', 'Combo'].map((cat, index) => (
            <TouchableOpacity key={cat} style={[styles.tab, index === 0 && styles.activeTab]}>
              <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuTitle}>Món chính</Text>
        {FOOD_ITEMS.filter(f => f.restaurantId === restaurant.id || !f.restaurantId).map((item) => (
          <FoodCard 
            key={item.id} 
            item={item} 
            onPress={() => navigation.navigate('FoodDetail', { item })} 
          />
        ))}
      </ScrollView>

      <View style={styles.cartBar}>
        <View style={styles.cartInfo}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
          <View>
            <Text style={styles.cartLabel}>Giỏ hàng của bạn</Text>
            <Text style={styles.cartPrice}>130.000đ</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.checkoutText}>Thanh toán</Text>
          <ChevronRight size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChevronRight = ({ size, color }) => (
  <View style={{ marginLeft: 8 }}><ArrowLeft size={size} color={color} style={{ transform: [{ rotate: '180deg' }] }} /></View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 300,
  },
  bannerImage: {
    width: '100%',
    height: 220,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  restaurantInfoCard: {
    position: 'absolute',
    bottom: 0,
    left: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  partnerBadge: {
    backgroundColor: '#69F0AE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  partnerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  address: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
  categoryTabs: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsScroll: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 10,
  },
  tab: {
    marginRight: 25,
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  menuContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  cartBar: {
    position: 'absolute',
    bottom: 20,
    left: SIZES.padding,
    right: SIZES.padding,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: SIZES.radiusLarge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  cartPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default RestaurantDetailScreen;
