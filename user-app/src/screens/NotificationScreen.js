import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { request } from '../api/client';

const NotificationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
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
        <Bell size={24} color={COLORS.primary} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 40 }} />
      </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#FFF5F2',
    borderWidth: 1,
    borderColor: '#FFE0D6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEBE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  loadMoreText: {
    color: COLORS.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  }
});

export default NotificationScreen;
