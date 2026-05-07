import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const StatCard = ({ title, value, subValue, icon: Icon, color, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} />
        </View>
        {subValue && (
          <Text style={[styles.subValue, { color: subValue.startsWith('+') ? '#2ECC71' : Colors.textSecondary }]}>
            {subValue}
          </Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  subValue: {
    fontSize: 12,
    fontWeight: '700',
  }
});

export default StatCard;
