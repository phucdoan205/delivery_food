import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Eye, Heart, Edit2 } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const FoodItemCard = ({ item, onPress }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#2ECC7120' : '#E5393520' }]}>
            <Text style={[styles.statusText, { color: item.status === 'active' ? '#2ECC71' : '#E53935' }]}>
              {item.status === 'active' ? 'CÒN MÓN' : 'HẾT MÓN'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit2 size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Eye size={14} color={Colors.textSecondary} />
            <Text style={styles.statsText}>{item.views} lượt xem</Text>
          </View>
          <View style={styles.stats}>
            <Heart size={14} color={Colors.textSecondary} />
            <Text style={styles.statsText}>{item.likes} thích</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  editButton: {
    padding: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  }
});

export default FoodItemCard;
