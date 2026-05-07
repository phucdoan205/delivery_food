import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FileText, Download, TrendingUp, Users, ShoppingCart } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { DASHBOARD_STATS } from '../../constants/mockData';

const AnalyticsScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }} style={styles.avatar} />
          <Text style={styles.headerTitle}>Trình quản lý Cửa hàng</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Text>🔔</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dateText}>Thứ Ba, 24 Tháng 10</Text>
        <Text style={styles.title}>Báo cáo kinh doanh</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <FileText size={18} color={Colors.text} />
            <Text style={styles.actionBtnText}>Xuất PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary }]}>
            <Download size={18} color={Colors.white} />
            <Text style={[styles.actionBtnText, { color: Colors.white }]}>Xuất Excel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.reportCard}>
          <Text style={styles.reportLabel}>DOANH THU HÔM NAY</Text>
          <Text style={styles.reportValue}>8.420.000đ</Text>
          <View style={styles.trendRow}>
            <TrendingUp size={14} color="#2ECC71" />
            <Text style={styles.trendText}>+12.5% so với hôm qua</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tổng đơn hàng</Text>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>142</Text>
                <View style={styles.statIcon}>
                  <ShoppingCart size={16} color="#2ECC71" />
                </View>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Giá trị TB đơn hàng</Text>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>59.000đ</Text>
                <View style={styles.statIcon}>
                  <TrendingUp size={16} color="#F1C40F" />
                </View>
              </View>
            </View>
          </View>

          {/* Chart Placeholder */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Biểu đồ doanh thu tuần</Text>
              <View style={styles.chartTabs}>
                <View style={styles.chartTabActive}><Text style={styles.chartTabTextActive}>Tuần này</Text></View>
                <View style={styles.chartTab}><Text style={styles.chartTabText}>Tuần trước</Text></View>
              </View>
            </View>
            <View style={styles.bars}>
              {DASHBOARD_STATS.performanceData.map((d, i) => (
                <View key={i} style={[styles.bar, { height: d.value, backgroundColor: i === 5 ? Colors.primary : '#F1E6E4' }]} />
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top món bán chạy</Text>
        {[
          { name: 'Phở Bò Tái Lăn', count: 452, value: '25.4M' },
          { name: 'Bánh Mì Đặc Biệt', count: 325, value: '12.6M' },
          { name: 'Cơm Tấm Sườn Bì', count: 284, value: '17.8M' },
        ].map((item, index) => (
          <View key={index} style={styles.topItem}>
            <Image source={{ uri: `https://picsum.photos/200?random=${index}` }} style={styles.topImage} />
            <View style={styles.topInfo}>
              <Text style={styles.topName}>{item.name}</Text>
              <Text style={styles.topCount}>{item.count} lượt bán</Text>
            </View>
            <View style={styles.topMeta}>
              <Text style={styles.topValue}>{item.value}</Text>
              <Text style={styles.topTrend}>Tăng 4%</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F8' },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  headerTitle: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  dateText: { fontSize: 14, color: Colors.textSecondary },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginTop: 5 },
  actionRow: { flexDirection: 'row', marginTop: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBE6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, marginRight: 10 },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: Colors.text, marginLeft: 8 },
  content: { paddingHorizontal: 20, marginTop: 30 },
  reportCard: { backgroundColor: Colors.white, borderRadius: 30, padding: 25, borderWidth: 1, borderColor: Colors.border, marginBottom: 30 },
  reportLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1 },
  reportValue: { fontSize: 32, fontWeight: '900', color: Colors.text, marginTop: 10 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  trendText: { fontSize: 12, color: Colors.textSecondary, marginLeft: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  statBox: { width: '48%', backgroundColor: '#F9F9F9', borderRadius: 20, padding: 15 },
  statLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  statContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statIcon: { width: 28, height: 28, borderRadius: 10, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  chartContainer: { marginTop: 30 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  chartTabs: { flexDirection: 'row', backgroundColor: '#F1E6E4', borderRadius: 10, padding: 3 },
  chartTabActive: { backgroundColor: Colors.white, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  chartTabTextActive: { fontSize: 10, fontWeight: '700', color: Colors.text },
  chartTab: { paddingHorizontal: 10, paddingVertical: 5 },
  chartTabText: { fontSize: 10, color: Colors.textSecondary },
  bars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, marginTop: 20 },
  bar: { width: 20, borderRadius: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 20 },
  topItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 20, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  topImage: { width: 50, height: 50, borderRadius: 15 },
  topInfo: { flex: 1, marginLeft: 15 },
  topName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  topCount: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  topMeta: { alignItems: 'flex-end' },
  topValue: { fontSize: 15, fontWeight: '800', color: Colors.text },
  topTrend: { fontSize: 10, color: '#2ECC71', fontWeight: '700', marginTop: 2 }
});

export default AnalyticsScreen;
