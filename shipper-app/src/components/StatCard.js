import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const StatCard = ({ label, value, icon, style, labelStyle, valueStyle }) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minWidth: '45%',
  },
  iconContainer: {
    marginRight: SIZES.base,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  value: {
    ...FONTS.h3,
    color: COLORS.text,
  },
});

export default StatCard;
