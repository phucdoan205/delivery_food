import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell, ShoppingBag, CreditCard, Settings, Star, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { request } from '../../api/client';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit, setLimit] = useState(5);

  const fetchNotifications = async (currentLimit) => {
    try {
      const data = await request(`/notifications?limit=${currentLimit}`);
      setNotifications(data || []);
      // Mark as read
      await request('/notifications/read-all', { method: 'PUT' });
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(limit);
  }, [limit]);

  const loadMore = () => {
    setLoadingMore(true);
    setLimit(prev => prev + 3);
  };
  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} color={Colors.primary} />;
      case 'payment': return <CreditCard size={20} color="#2ECC71" />;
      case 'system': return <Settings size={20} color="#3498DB" />;
      case 'review': return <Star size={20} color="#F1C40F" />;
      default: return <Bell size={20} color={Colors.text} />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'order': return '#FBE9E7';
      case 'payment': return '#E8F5E9';
      case 'system': return '#E3F2FD';
      case 'review': return '#FFFDE7';
      default: return Colors.secondary;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.message}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity style={styles.markReadBtn}>
          <CheckCircle2 size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={64} color={Colors.border} />
              <Text style={styles.emptyText}>Bạn chưa có thông báo nào</Text>
            </View>
          }
          ListFooterComponent={
            notifications.length >= limit ? (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} disabled={loadingMore}>
                {loadingMore ? <ActivityIndicator size="small" color={Colors.primary} /> : <Text style={styles.loadMoreText}>Đọc tiếp</Text>}
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  markReadBtn: {
    padding: 5,
  },
  listContent: {
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: '#FFF9F8',
    borderColor: '#FBE9E7',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  unreadTitle: {
    color: Colors.primary,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  loadMoreBtn: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  loadMoreText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  }
});

export default NotificationScreen;
