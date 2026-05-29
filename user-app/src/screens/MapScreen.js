import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Search, MapPin } from 'lucide-react-native';
import MapTilerView from '../components/MapTilerView';
import { request } from '../api/client';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRest, setSelectedRest] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mapCenter, setMapCenter] = useState([106.660172, 10.762622]);
  const [routeData, setRouteData] = useState(null);

  // Deterministic pseudo-random based on string to match Shipper App perfectly
  const getOffset = (seedStr, index) => {
    let hash = 0;
    const str = seedStr ? seedStr.toString() : index.toString();
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const offsetBase = (hash % 100) / 10000;
    return offsetBase * (index % 2 === 0 ? 1 : -1);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [restData, profileData] = await Promise.all([
            request('/restaurants'),
            request('/auth/profile')
          ]);
          setRestaurants(restData);
          setProfile(profileData);
        } catch (error) {
          console.log('Error fetching data in MapScreen', error);
        }
      };
      fetchData();
    }, [])
  );

  const userMarker = {
    id: 'user',
    lat: 10.762622,
    lng: 106.660172,
    title: 'Vị trí của bạn',
    color: '#3B82F6', // Blue for user
    label: 'U'
  };

  const markers = [
    userMarker,
    ...restaurants.map((r, index) => ({
      id: r._id,
      lat: r.coordinates?.lat || 10.762622 + getOffset(r._id, index),
      lng: r.coordinates?.lng || 106.660172 + getOffset(r._id + 'lng', index),
      title: r.name,
      color: COLORS.primary, // Orange for restaurants
      label: (index + 1).toString()
    }))
  ];

  return (
    <View style={styles.container}>
      <MapTilerView 
        markers={markers} 
        center={mapCenter} 
        zoom={13} 
        route={routeData}
        onMarkerPress={async (id) => {
          if (id === 'user') return;
          const rest = restaurants.find(r => r._id === id);
          if (rest) {
            setSelectedRest(rest);
            // Fetch route from user to restaurant
            try {
              const userLng = 106.660172;
              const userLat = 10.762622;
              const index = restaurants.indexOf(rest);
              const restLng = rest.coordinates?.lng || 106.660172 + getOffset(rest._id + 'lng', index);
              const restLat = rest.coordinates?.lat || 10.762622 + getOffset(rest._id, index);
              
              const coordinates = `${userLng},${userLat};${restLng},${restLat}`;
              const json = await request(`/orders/route?coordinates=${coordinates}`);
              if (json.routes && json.routes[0]) {
                setRouteData(json.routes[0].geometry);
              }
            } catch (e) {
              console.log('Route error', e);
              const index = restaurants.indexOf(rest);
              setRouteData({
                type: 'LineString',
                coordinates: [
                  [106.660172, 10.762622],
                  [
                    rest.coordinates?.lng || 106.660172 + getOffset(rest._id + 'lng', index), 
                    rest.coordinates?.lat || 10.762622 + getOffset(rest._id, index)
                  ]
                ]
              });
            }
          }
        }}
      />

      <SafeAreaView edges={['top']} style={styles.overlay}>
        {/* Header Search */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={18} color={COLORS.primary} fill={COLORS.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>VỊ TRÍ CỦA BẠN</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>{profile?.address || 'Vị trí hiện tại'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search')}>
            <Search size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Cá nhân')}
          >
            <Image 
              source={{ uri: profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.fullName || 'U'}&background=E63946&color=fff` }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>

        {/* Floating Map Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlBtn}
            onPress={() => setMapCenter([106.660172 + Math.random()*0.0000000001, 10.762622])}
          >
            <MapPin size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Selected Restaurant Card */}
        {selectedRest && (
          <View style={styles.cardContainer}>
            <View style={styles.restaurantCard}>
              <Image source={{ uri: selectedRest.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{selectedRest.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {selectedRest.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{selectedRest.category || 'Món ngon'}</Text>
                </View>
                
                <Text style={styles.cardAddress} numberOfLines={1}>{selectedRest.address}</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MapPin size={14} color={COLORS.textLight} />
                    <Text style={styles.statText}>{((selectedRest.rating || 4.5) * 0.3).toFixed(1)} km</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statText}>🕒 15-25 phút</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.arrowBtn}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant: selectedRest })}
              >
                <MapPin size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
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
