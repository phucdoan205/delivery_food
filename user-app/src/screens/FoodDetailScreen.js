import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Share2, Heart, Minus, Plus } from 'lucide-react-native';

const FoodDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <SafeAreaView style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconBtn}><Share2 size={20} color={COLORS.text} /></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}><Heart size={20} color={COLORS.text} /></TouchableOpacity>
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
                <Text style={styles.restaurantName}>Bún Chả Sinh Từ - Hàng Than</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
              <Text style={styles.oldPrice}>75.000đ</Text>
            </View>
          </View>

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ 4.8 (1,200+ đánh giá)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả món ăn</Text>
            <Text style={styles.description}>
              {item.description || "Hương vị truyền thống từ những miếng chả nướng than hoa thơm lừng. Suất đặc biệt bao gồm: bún sợi nhỏ, chả miếng, chả viên, nem rán vàng rụm và nước chấm chua ngọt đậm đà kèm dưa góp giòn sần sật."}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Thêm Topping</Text>
              <View style={styles.optionalBadge}><Text style={styles.optionalText}>TÙY CHỌN</Text></View>
            </View>
            
            {[
              { id: 1, name: 'Thêm Nem Rán (1 chiếc)', price: 15000 },
              { id: 2, name: 'Thêm Chả Viên (2 viên)', price: 20000 },
            ].map((topping) => (
              <View key={topping.id} style={styles.toppingRow}>
                <Text style={styles.toppingName}>{topping.name}</Text>
                <View style={styles.toppingRight}>
                  <Text style={styles.toppingPrice}>+{topping.price.toLocaleString()}đ</Text>
                  <View style={styles.checkbox} />
                </View>
              </View>
            ))}
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
          onPress={() => navigation.navigate('Cart')}
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
