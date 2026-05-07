import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const OrderCard = ({ order, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#E67E22';
      case 'preparing': return '#3498DB';
      case 'ready': return '#2ECC71';
      default: return Colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return 'MỚI';
      case 'preparing': return 'ĐANG CHUẨN BỊ';
      case 'ready': return 'SẴN SÀNG';
      default: return status;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusLabel(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Clock size={14} color={Colors.textSecondary} />
        <Text style={styles.timeText}>{order.time} • {order.relativeTime}</Text>
      </View>

      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>{order.total.toLocaleString()}đ</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>
          {order.status === 'new' ? 'Bắt đầu chuẩn bị' : 'Hoàn thành'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  }
});

export default OrderCard;
