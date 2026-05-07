import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, Plus, Star, Clock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { ORDERS, RESTAURANT_INFO } from '../../constants/mockData';
import OrderCard from '../../components/OrderCard';

const OrderManagementScreen = () => {
  const [activeTab, setActiveTab] = useState('new');
  
  const tabs = [
    { id: 'new', label: 'MỚI (4)', count: 4 },
    { id: 'preparing', label: 'ĐANG CHUẨN BỊ (2)', count: 2 },
    { id: 'ready', label: 'SẴN SÀNG', count: 0 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.restInfo}>
            <Image source={{ uri: RESTAURANT_INFO.logo }} style={styles.restLogo} />
            <Text style={styles.restName}>{RESTAURANT_INFO.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Mở cửa</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.title}>Quản lý đơn hàng</Text>
        <Text style={styles.subtitle}>Theo dõi và cập nhật trạng thái đơn hàng của bạn.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Order List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {ORDERS.filter(o => activeTab === 'new' ? o.status === 'new' : o.status === activeTab).map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}

        {/* Stats Summary at bottom */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hiệu suất hôm nay</Text>
          <Text style={styles.summarySub}>Bạn đã hoàn thành 42 đơn hàng tuyệt vời.</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>98%</Text>
              <Text style={styles.mainStatTrend}>+5.2%</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.subStats}>
              <View style={styles.subStatItem}>
                <Clock size={16} color="#2ECC71" />
                <Text style={styles.subStatValue}>18 phút</Text>
                <Text style={styles.subStatLabel}>CHUẨN BỊ TB</Text>
              </View>
              <View style={styles.subStatItem}>
                <Star size={16} color="#F1C40F" />
                <Text style={styles.subStatValue}>4.9/5.0</Text>
                <Text style={styles.subStatLabel}>ĐÁNH GIÁ KHÁCH</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus size={30} color={Colors.white} />
      </TouchableOpacity>
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
    paddingBottom: 10,
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
  restLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  restName: {
    fontSize: 14,
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
    fontSize: 9,
    fontWeight: '800',
    color: '#2ECC71',
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTab: {
    backgroundColor: '#FFEBE6',
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.primary,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF1F0',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  summarySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainStat: {
    flex: 1,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
  },
  mainStatTrend: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2ECC71',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
  },
  subStats: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subStatItem: {
    alignItems: 'flex-start',
  },
  subStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  subStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
});

export default OrderManagementScreen;
