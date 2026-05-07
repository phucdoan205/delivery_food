import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MENU_ITEMS, RESTAURANT_INFO } from '../../constants/mockData';
import FoodItemCard from '../../components/FoodItemCard';

const MenuManagementScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.restInfo}>
            <Text style={styles.restName}>{RESTAURANT_INFO.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Mở cửa</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>Quản lý món ăn</Text>
        <Text style={styles.subtitle}>Cửa hàng của bạn có 4 món ăn đang hoạt động.</Text>

        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={Colors.white} />
          <Text style={styles.addButtonText}>Thêm món mới</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput 
            placeholder="Tìm kiếm tên món hoặc mã món..." 
            style={styles.searchInput}
            placeholderTextColor="#A0A0A0"
          />
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={18} color={Colors.textSecondary} />
            <Text style={styles.filterText}>Lọc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <ArrowUpDown size={18} color={Colors.textSecondary} />
            <Text style={styles.filterText}>Sắp xếp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>TỔNG SỐ</Text>
          <Text style={styles.summaryValue}>48</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>ĐANG BÁN</Text>
          <Text style={[styles.summaryValue, { color: '#2ECC71' }]}>42</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>MÓN MỚI</Text>
          <Text style={[styles.summaryValue, { color: '#F1C40F' }]}>24</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>HẾT MÓN</Text>
          <Text style={[styles.summaryValue, { color: '#E53935' }]}>06</Text>
        </View>
      </View>

      {/* Menu List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {MENU_ITEMS.map((item, index) => (
          <FoodItemCard key={index} item={item} />
        ))}
        
        {/* Add New Placeholder */}
        <TouchableOpacity style={styles.addPlaceholder}>
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  summaryItem: {
    width: '45%',
    backgroundColor: Colors.white,
    marginHorizontal: '2.5%',
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
