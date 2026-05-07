import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import * as LucideIcons from 'lucide-react-native';

const CategoryChip = ({ category, isSelected, onPress }) => {
  // Map icon name to Lucide component
  const IconComponent = LucideIcons[category.icon.charAt(0).toUpperCase() + category.icon.slice(1)] || LucideIcons.LayoutGrid;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
    >
      <View style={[
        styles.iconContainer,
        isSelected && styles.selectedIconContainer
      ]}>
        <IconComponent size={24} color={isSelected ? COLORS.white : COLORS.primary} />
      </View>
      <Text style={[
        styles.text,
        isSelected && styles.selectedText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: SIZES.padding,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.primary,
  }
});

export default CategoryChip;
