import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import CustomButton from './CustomButton';

const OrderCard = ({ order, onPress, onAccept, onReject, showActions = true }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Image source={{ uri: order.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.restaurantName} numberOfLines={1}>{order.restaurant}</Text>
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={14} color={COLORS.success} />
            <Text style={styles.subInfo}>{order.distance} • {order.duration}</Text>
          </View>
        </View>
        {order.bonus > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>+{order.bonus.toLocaleString()}đ Tips</Text>
          </View>
        )}
      </View>

      <View style={styles.addressContainer}>
        <Ionicons name="location" size={16} color={COLORS.primary} />
        <Text style={styles.address} numberOfLines={1}>{order.address}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <CustomButton 
            title="Chấp nhận" 
            onPress={onAccept} 
            style={styles.acceptButton}
          />
          <CustomButton 
            title="Từ chối" 
            onPress={onReject} 
            type="outline"
            style={styles.rejectButton}
            textStyle={styles.rejectText}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding / 1.5,
    marginBottom: SIZES.padding / 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
  },
  info: {
    flex: 1,
  },
  restaurantName: {
    ...FONTS.h3,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subInfo: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  bonusBadge: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bonusText: {
    ...FONTS.h4,
    color: COLORS.secondary,
    fontSize: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  address: {
    ...FONTS.body4,
    marginLeft: SIZES.base,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 1.5,
    height: 48,
    marginVertical: 0,
    marginRight: SIZES.base,
  },
  rejectButton: {
    flex: 1,
    height: 48,
    marginVertical: 0,
    borderColor: 'rgba(231, 76, 60, 0.2)',
  },
  rejectText: {
    color: COLORS.error,
  }
});

export default OrderCard;
