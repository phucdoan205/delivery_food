import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import FoodItemCard from '../../components/FoodItemCard';
import { request, API_URL } from '../../api/client';
import io from 'socket.io-client/dist/socket.io.js';

const MenuManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMenu = async () => {
    try {
      const rest = await request('/restaurants/mine');
      setRestaurant(rest);
      const foods = await request(`/foods/restaurant/${rest._id}`);
      setMenuItems(foods);
    } catch (error) {
      console.log('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let socket;
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMenu();
      
      if (!socket) {
        const socketUrl = API_URL.replace('/api', '');
        socket = io(socketUrl);
        
        socket.on('food_status_updated', (data) => {
          if (restaurant && (data.restaurantId === restaurant._id || data.restaurantId === restaurant.id)) {
            fetchMenu();
          }
        });
      }
    });
    
    return () => {
      unsubscribe();
      if (socket) socket.disconnect();
    };
  }, [navigation, restaurant]);

  const filteredItems = menuItems.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const activeCount = menuItems.filter(i => i.isAvailable !== false).length;
  const inactiveCount = menuItems.filter(i => i.isAvailable === false).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.restInfo}>
            <Text style={styles.restName}>{restaurant?.name || 'Cửa hàng'}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{restaurant?.status === 'approved' ? 'Hoạt động' : 'Chờ duyệt'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            {restaurant?.image ? (
              <Image source={{ uri: restaurant.image }} style={{ width: 36, height: 36, borderRadius: 18 }} />
            ) : (
              <Text style={styles.profileIcon}>👤</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>Quản lý món ăn</Text>
        <Text style={styles.subtitle}>Cửa hàng của bạn có {menuItems.length} món ăn trong thực đơn.</Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditDish', { restaurantId: restaurant?._id })}
        >
          <Plus size={20} color={Colors.white} />
          <Text style={styles.addButtonText}>Thêm món mới</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search & Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput 
              placeholder="Tìm kiếm tên món..." 
              style={styles.searchInput}
              placeholderTextColor="#A0A0A0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TỔNG SỐ MÓN</Text>
            <Text style={styles.summaryValue}>{menuItems.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ĐANG BÁN</Text>
            <Text style={[styles.summaryValue, { color: '#2ECC71' }]}>{activeCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>HẾT MÓN</Text>
            <Text style={[styles.summaryValue, { color: '#E53935' }]}>{inactiveCount}</Text>
          </View>
        </View>

        {/* Menu List */}
        {filteredItems.map((item, index) => {
          const mappedItem = {
            ...item,
            status: item.isAvailable !== false ? 'active' : 'inactive',
            views: item.views || 0,
            likes: item.likes || 0
          };
          return (
            <FoodItemCard 
              key={index} 
              item={mappedItem} 
              onPress={() => navigation.navigate('AddEditDish', { dish: item, restaurantId: restaurant?._id })} 
            />
          );
        })}
        
        {/* Add New Placeholder */}
        <TouchableOpacity 
          style={styles.addPlaceholder}
          onPress={() => navigation.navigate('AddEditDish', { restaurantId: restaurant?._id })}
        >
          <View style={styles.addIconCircle}>
            <Plus size={24} color={Colors.primary} />
          </View>
          <Text style={styles.addPlaceholderTitle}>Thêm món mới</Text>
          <Text style={styles.addPlaceholderSub}>Làm phong phú menu của bạn</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F8',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  restInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: '#2ECC7115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2ECC71',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1E6E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  summarySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: Colors.white,
    marginBottom: 10,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addPlaceholder: {
    height: 150,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FBE9E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPlaceholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  addPlaceholderSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  }
});

export default MenuManagementScreen;
