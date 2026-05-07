import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Search, X, MapPin, SlidersHorizontal, Star } from 'lucide-react-native';
import { RESTAURANTS } from '../constants/mockData';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const recentSearches = ['Pizza Nấm Truffle', 'Hộp Sushi', 'Salad hữu cơ'];
  const popularTags = ['#FreeShip', '#ComboHời', '#MónÝThủCông', '#CàPhêLạnh'];

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantItem}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.ratingBadge}>
          <Star size={10} color={COLORS.secondary} fill={COLORS.secondary} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.promoBadge}>
          <Text style={styles.promoText}>NGON NHẤT PHỐ</Text>
        </View>
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.priceLevel}>$$$</Text>
        </View>
        <Text style={styles.itemDesc} numberOfLines={2}>
          Mỳ Ý thủ công chính gốc và bánh focaccia nướng củi chuẩn vị.
        </Text>
        <View style={styles.itemFooter}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>25-35 phút</Text>
            <View style={styles.dot} />
            <Text style={styles.footerText}>1.2 km</Text>
          </View>
          <View style={styles.freeShipBadge}>
            <Text style={styles.freeShipText}>MIỄN PHÍ GIAO HÀNG</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationHeader}>
          <MapPin size={16} color={COLORS.primary} />
          <Text style={styles.locationText}>Vị trí hiện tại</Text>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }} 
              style={styles.avatar} 
            />
          </View>
        </View>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Mỳ Ý thủ công"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          {['Bộ lọc', 'Đánh giá 4.5+', 'Dưới 30 phút', 'Giá rẻ'].map((chip, idx) => (
            <TouchableOpacity key={chip} style={[styles.filterChip, idx === 0 && styles.activeFilterChip]}>
              <Text style={[styles.filterChipText, idx === 0 && styles.activeFilterChipText]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gần đây</Text>
            <TouchableOpacity><Text style={styles.clearText}>XOÁ</Text></TouchableOpacity>
          </View>
          {recentSearches.map((item) => (
            <TouchableOpacity key={item} style={styles.recentItem}>
              <Search size={14} color={COLORS.textLight} />
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phổ biến hiện nay</Text>
          <View style={styles.popularTagsContainer}>
            {popularTags.map((tag, idx) => (
              <TouchableOpacity 
                key={tag} 
                style={[
                  styles.popularTag, 
                  { backgroundColor: idx % 2 === 0 ? '#FFE082' : '#80CBC4' }
                ]}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Kết quả tinh tuyển</Text>
            <Text style={styles.resultsCount}>Tìm thấy 12 nhà hàng</Text>
          </View>
          <FlatList
            data={RESTAURANTS}
            renderItem={renderRestaurantItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
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
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChips: {
    marginTop: 15,
    paddingBottom: 5,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  activeFilterChipText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  content: {
    padding: SIZES.padding,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 10,
  },
  popularTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularTag: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  resultsSection: {
    marginTop: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resultsCount: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  restaurantItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    marginBottom: 20,
    ...SHADOWS.light,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  promoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#69F0AE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  promoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  itemInfo: {
    padding: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
    marginHorizontal: 8,
  },
  freeShipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  freeShipText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.green,
  }
});

export default SearchScreen;
