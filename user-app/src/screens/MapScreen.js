import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Search, MapPin } from 'lucide-react-native';
import { RESTAURANTS } from '../constants/mockData';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const selectedRestaurant = RESTAURANTS[1]; // Artisan Crust Bistro (matches design vibe)

  return (
    <View style={styles.container}>
      {/* Mock Map Image Background */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.mapMock}
      />

      <SafeAreaView style={styles.overlay}>
        {/* Header Search */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={18} color={COLORS.primary} fill={COLORS.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>VỊ TRÍ CỦA BẠN</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>Vị trí hiện tại</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>

        {/* Floating Map Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn}>
            <MapPin size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Selected Restaurant Card */}
        <View style={styles.cardContainer}>
          <View style={styles.restaurantCard}>
            <Image source={{ uri: selectedRestaurant.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{selectedRestaurant.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {selectedRestaurant.rating}</Text>
                </View>
              </View>
              
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>Tinh tuyển</Text>
              </View>
              
              <Text style={styles.cardAddress} numberOfLines={1}>Pháp hiện đại • $$$$</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MapPin size={14} color={COLORS.textLight} />
                  <Text style={styles.statText}>0.4 miles</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statText}>🕒 15-25 phút</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.arrowBtn}>
              <MapPin size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Map Markers Overlay (Visual Simulation) */}
      <View style={[styles.marker, { top: '40%', left: '50%' }]}>
        <View style={styles.markerContainer}>
          <View style={styles.markerIcon}>
            <Text style={{ color: COLORS.white }}>🍽️</Text>
          </View>
          <Text style={styles.markerText}>{selectedRestaurant.name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mapMock: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.base,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 30,
    ...SHADOWS.light,
  },
  locationTextContainer: {
    marginLeft: 8,
  },
  locationTitle: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  locationAddress: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  searchBtn: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    ...SHADOWS.light,
  },
  profileBtn: {
    marginLeft: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  controls: {
    position: 'absolute',
    right: 20,
    bottom: 220,
  },
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding,
  },
  restaurantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFB300',
  },
  tagBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardAddress: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  marker: {
    position: 'absolute',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  markerText: {
    marginTop: 5,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
    ...SHADOWS.light,
  }
});

export default MapScreen;
