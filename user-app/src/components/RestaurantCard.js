import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Star, Clock, MapPin } from 'lucide-react-native';

const RestaurantCard = ({ restaurant, onPress, horizontal = false }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : styles.verticalContainer
      ]}
    >
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      
      {restaurant.tags?.includes('Tinh tuyển') && (
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Tinh tuyển</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
        
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Star size={14} color={COLORS.secondary} fill={COLORS.secondary} />
            <Text style={styles.ratingText}>{restaurant.rating} ({restaurant.reviews}+)</Text>
          </View>
          
          <View style={styles.metaContainer}>
            <Clock size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{restaurant.time}</Text>
            <View style={styles.dot} />
            <MapPin size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{restaurant.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    ...SHADOWS.light,
    marginBottom: SIZES.padding,
  },
  verticalContainer: {
    width: '100%',
  },
  horizontalContainer: {
    width: 280,
    marginRight: SIZES.padding,
  },
  image: {
    width: '100%',
    height: 160,
  },
  tagContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: SIZES.padding,
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  address: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
    marginHorizontal: 6,
  }
});

export default RestaurantCard;
