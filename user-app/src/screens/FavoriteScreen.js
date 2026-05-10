import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Heart, MapPin, Search as Star } from 'lucide-react-native';
import { RESTAURANTS } from '../constants/mockData';

const FavoriteScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
        <TouchableOpacity style={styles.heartBtn}>
          <Heart size={18} color={COLORS.white} fill={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>MỞ CỬA</Text>
        </View>
      </View>
      
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Star size={14} color="#FFB300" fill="#FFB300" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.restaurantDesc} numberOfLines={1}>
          Món Âu, Bít tết, Rượu vang thượng hạng
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🕒</Text>
            <Text style={styles.statText}>{item.time}</Text>
          </View>
          <View style={styles.statItem}>
            <MapPin size={14} color={COLORS.textLight} />
            <Text style={styles.statText}>{item.distance}</Text>
          </View>
          <Text style={styles.priceRange}>$$$</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Quán ăn yêu thích</Text>
        <Text style={styles.subtitle}>
          Nơi lưu giữ những hương vị bạn yêu thích nhất
        </Text>

        <View style={styles.tabContainer}>
          <FlatList
            data={['Tất cả', 'Gần tôi', 'Đánh giá cao', 'Ưu đãi']}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
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
          data={RESTAURANTS}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
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
  listContent: {
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: COLORS.green,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 4,
  },
  restaurantDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 5,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 'auto',
  }
});

export default FavoriteScreen;
