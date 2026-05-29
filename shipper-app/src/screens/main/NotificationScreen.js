import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { request } from '../../api/client';
import Header from '../../components/Header';

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

  const renderItem = ({ item }) => (
    <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Thông báo" />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
          }
          ListFooterComponent={
            notifications.length >= limit ? (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} disabled={loadingMore}>
                {loadingMore ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.loadMoreText}>Đọc tiếp</Text>}
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#FFF5F2',
    borderColor: '#FFE0D6',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEBE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  time: {
    ...FONTS.body5,
    color: COLORS.primary,
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 50,
  },
  loadMoreBtn: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  loadMoreText: {
    color: COLORS.primary,
    ...FONTS.h4,
  }
});

export default NotificationScreen;
