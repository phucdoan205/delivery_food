import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { MapPin, Search, Bell, ChevronRight } from 'lucide-react-native';
import { CATEGORIES, RESTAURANTS, FOOD_ITEMS } from '../constants/mockData';
import CategoryChip from '../components/CategoryChip';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('1');

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <MapPin size={20} color={COLORS.primary} />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Giao đến:</Text>
          <Text style={styles.locationValue} numberOfLines={1}>123 Lê Lợi, Quận 1</Text>
        </View>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconBtn}>
          <Search size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDealCard = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Deal hời hôm nay</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity activeOpacity={0.9} style={styles.dealCard}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.dealImage} 
        />
        <View style={styles.dealOverlay}>
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>FLASH SALE - 50%</Text>
          </View>
          <Text style={styles.dealTitle}>Tiệc Nướng Kiểu Mỹ</Text>
          <Text style={styles.dealSubtitle}>Chỉ từ 99.000đ • Free ship 2km</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}

        <View style={styles.categorySection}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryChip
                category={item}
                isSelected={selectedCategory === item.id}
                onPress={() => setSelectedCategory(item.id)}
              />
            )}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {renderDealCard()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Món ngon đang hot</Text>
            <TouchableOpacity>
              <ChevronRight size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={FOOD_ITEMS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.hotItemCard}>
                <Image source={{ uri: item.image }} style={styles.hotItemImage} />
                <View style={styles.hotItemInfo}>
                  <Text style={styles.hotItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.hotItemPrice}>{item.price.toLocaleString()}đ</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.hotList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dành cho bạn</Text>
            <Text style={styles.sectionSubtitle}>Dựa trên thói quen</Text>
          </View>
          {FOOD_ITEMS.slice(0, 2).map((item) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onPress={() => navigation.navigate('FoodDetail', { item })} 
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhà hàng nổi bật</Text>
          </View>
          {RESTAURANTS.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              onPress={() => navigation.navigate('RestaurantDetail', { restaurant })} 
            />
          ))}
        </View>
      </ScrollView>
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
    paddingVertical: SIZES.base,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 15,
  },
  categorySection: {
    marginTop: SIZES.padding,
  },
  categoryList: {
    paddingLeft: SIZES.padding,
  },
  section: {
    marginTop: SIZES.extraLarge,
    paddingHorizontal: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  seeAll: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dealCard: {
    height: 180,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SIZES.padding,
    justifyContent: 'flex-end',
  },
  dealBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  dealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  dealSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  hotList: {
    paddingRight: SIZES.padding,
  },
  hotItemCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    padding: 8,
  },
  hotItemImage: {
    width: '100%',
    height: 100,
    borderRadius: SIZES.radius - 4,
  },
  hotItemInfo: {
    marginTop: 8,
  },
  hotItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  hotItemPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  }
});

export default HomeScreen;
