import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { MapPin, Search as SearchIcon, Bell, ChevronRight, ShoppingCart } from 'lucide-react-native';
import CategoryChip from '../components/CategoryChip';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import { request, API_URL } from '../api/client';
import io from 'socket.io-client/dist/socket.io.js';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchHomeData = async () => {
    try {
      const [cats, foods, rests, profileData, cartData] = await Promise.all([
        request('/foods/categories'),
        request('/foods'),
        request('/restaurants'),
        request('/auth/profile').catch(() => null),
        request('/cart').catch(() => null)
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setFoodItems(Array.isArray(foods) ? foods : []);
      setRestaurants(Array.isArray(rests) ? rests : []);
      if (profileData) {
        setProfile(profileData);
      }
      if (cartData && cartData.items) {
        setCartCount(cartData.items.reduce((sum, item) => sum + item.quantity, 0));
      }
      
      if (profileData && profileData._id) {
        try {
          const unreadData = await request('/notifications/unread');
          if (unreadData && unreadData.count !== undefined) {
            setUnreadCount(unreadData.count);
          }
        } catch (e) {
          console.log('Error fetching unread count', e);
        }
      }

      if (cats.length) setSelectedCategory(cats[0]._id || cats[0].id);
    } catch (error) {
      console.log('Error fetching home data, falling back to mocks:', error);
      setCategories([]);
      setFoodItems([]);
      setRestaurants([]);
      setSelectedCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHomeData();
    });

    let socket;
    if (profile && profile._id) {
      const socketUrl = API_URL.replace('/api', '');
      socket = io(socketUrl);
      socket.emit('join', profile._id);
      socket.on('new_notification', () => {
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      unsubscribe();
      if (socket) socket.disconnect();
    };
  }, [navigation, profile?._id]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <MapPin size={20} color={COLORS.primary} />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Giao đến:</Text>
          <Text style={styles.locationValue} numberOfLines={1}>{profile?.address || 'Vui lòng chọn địa chỉ'}</Text>
        </View>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Tìm kiếm')}>
          <SearchIcon size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notification')}>
          <Bell size={20} color={COLORS.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
          <ShoppingCart size={20} color={COLORS.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          )}
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

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  // Map MongoDB fields to the keys expected by children components
  const normalizedRestaurants = restaurants.map(res => ({
    id: res._id || res.id,
    name: res.name,
    address: res.address,
    image: res.image,
    rating: res.rating || 4.8,
    reviews: res.reviews || 250,
    time: res.time || '20-30 phút',
    distance: res.distance || '1.5km',
    tags: res.tags || ['Đối tác'],
    isTemporarilyClosed: res.isTemporarilyClosed || false
  }));

  const normalizedFoods = foodItems.map(food => ({
    id: food._id || food.id,
    name: food.name,
    description: food.description,
    price: food.price,
    image: food.image,
    restaurantId: food.restaurantId?._id || food.restaurantId || '',
    isPopular: food.isPopular || true
  }));

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {renderHeader()}

        <View style={styles.categorySection}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id || item.id}
            renderItem={({ item }) => (
              <CategoryChip
                category={{ id: item._id || item.id, name: item.name, icon: item.icon || 'utensils' }}
                isSelected={selectedCategory === (item._id || item.id)}
                onPress={() => setSelectedCategory(item._id || item.id)}
              />
            )}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {renderDealCard()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Món ngon đang hot</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tìm kiếm')}>
              <ChevronRight size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={normalizedFoods}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.hotItemCard}
                onPress={() => navigation.navigate('FoodDetail', { item })}
              >
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
          {normalizedFoods.slice(0, 2).map((item) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onPress={() => navigation.navigate('FoodDetail', { item })} 
              onAddPress={() => navigation.navigate('FoodDetail', { item })}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhà hàng nổi bật</Text>
          </View>
          {normalizedRestaurants.map((restaurant) => (
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
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
