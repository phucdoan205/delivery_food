import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Share2, Heart, Minus, Plus, ShoppingCart, Eye } from 'lucide-react-native';
import { request } from '../api/client';

const FoodDetailScreen = ({ route, navigation }) => {
  const { item, restaurant } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [views, setViews] = useState(item.views || 0);
  const [likes, setLikes] = useState(item.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  React.useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const data = await request('/cart');
        if (data && data.items) {
          setCartCount(data.items.reduce((sum, item) => sum + item.quantity, 0));
        }
      } catch (e) {}
    };
    fetchCartCount();

    let isMounted = true;
    const initData = async () => {
      try {
        const profile = await request('/auth/profile').catch(() => null);
        if (profile && profile.likedFoods && isMounted) {
          setIsLiked(profile.likedFoods.includes(item._id || item.id));
        }
        
        const res = await request(`/foods/${item._id || item.id}/view`, { method: 'PUT' }).catch(() => null);
        if (res && res.views !== undefined && isMounted) {
          setViews(res.views);
        }
      } catch (e) {}
    };
    initData();

    return () => { isMounted = false; };
  }, []);

  const handleToggleLike = async () => {
    try {
      const res = await request(`/foods/${item._id || item.id}/like`, { method: 'POST' });
      if (res) {
        setLikes(res.likes);
        setIsLiked(res.isLiked);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để sử dụng tính năng này.');
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await request('/cart', {
        method: 'POST',
        body: {
          foodId: item.id,
          quantity
        }
      });
      setCartCount(prev => prev + quantity);
      Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!', [
        { text: 'Đi đến giỏ hàng', onPress: () => navigation.navigate('Cart') },
        { text: 'Tiếp tục mua sắm', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <SafeAreaView style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleToggleLike}>
                  <Heart size={20} color={isLiked ? COLORS.primary : COLORS.text} fill={isLiked ? COLORS.primary : 'transparent'} />
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
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.restaurantRow}>
                <View style={styles.dot} />
                <Text style={styles.restaurantName}>{restaurant ? restaurant.name : "Quán ăn đối tác"}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ 4.8 (1,200+ đánh giá)</Text>
            </View>
            <View style={styles.viewLikeStats}>
              <Eye size={16} color={COLORS.textLight} />
              <Text style={styles.statLabel}>{views} lượt xem</Text>
              <Heart size={16} color={COLORS.textLight} style={{ marginLeft: 15 }} />
              <Text style={styles.statLabel}>{likes} thích</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả món ăn</Text>
            <Text style={styles.description}>
              {item.description || "Hương vị truyền thống từ những miếng chả nướng than hoa thơm lừng. Suất đặc biệt bao gồm: bún sợi nhỏ, chả miếng, chả viên, nem rán vàng rụm và nước chấm chua ngọt đậm đà kèm dưa góp giòn sần sật."}
            </Text>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú cho quán</Text>
            <View style={styles.noteInputContainer}>
              <TextInput
                style={styles.noteInput}
                placeholder="Ví dụ: Không hành, ít cay..."
                placeholderTextColor={COLORS.textLight}
                multiline
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Minus size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Plus size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          disabled={loading}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          <Text style={styles.footerPrice}>{(item.price * quantity).toLocaleString()}đ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
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
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
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
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    padding: SIZES.padding * 1.5,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    width: '70%',
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.green,
    marginRight: 6,
  },
  restaurantName: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  oldPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  ratingBadge: {
    backgroundColor: '#FFF1E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: SIZES.extraLarge,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8D4D2E',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  viewLikeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 4,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  optionalBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  toppingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  toppingName: {
    fontSize: 14,
    color: COLORS.text,
  },
  toppingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toppingPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 4,
  },
  noteInputContainer: {
    backgroundColor: '#FFF1E8',
    borderRadius: SIZES.radius,
    padding: 15,
    minHeight: 100,
  },
  noteInput: {
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    gap: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    borderRadius: 25,
    padding: 4,
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    ...SHADOWS.medium,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default FoodDetailScreen;
