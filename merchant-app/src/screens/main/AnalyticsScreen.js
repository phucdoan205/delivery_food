import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  ShoppingCart,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { request } from "../../api/client";

const AnalyticsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState('thisWeek');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const rest = await request('/restaurants/mine');
        setRestaurant(rest);
        if (rest && rest._id) {
          const data = await request(`/orders/merchant/${rest._id}`);
          setOrders(data || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAnalytics();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Calculate Stats
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

  const todayOrders = completedOrders.filter(o => {
    const d = new Date(o.createdAt);
    return d >= todayStart && d <= todayEnd;
  });
  
  const yesterdayOrders = completedOrders.filter(o => {
    const d = new Date(o.createdAt);
    return d >= yesterdayStart && d <= yesterdayEnd;
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  
  let trend = 0;
  if (yesterdayRevenue > 0) {
    trend = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
  } else if (todayRevenue > 0) {
    trend = 100;
  }

  const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  // Chart Data (Last 7 days or Previous 7 days)
  const chartData = [];
  let maxDaily = 0;
  const offset = chartTab === 'thisWeek' ? 0 : 7;
  
  for (let i = 6; i >= 0; i--) {
    const dStart = new Date(todayStart);
    dStart.setDate(dStart.getDate() - i - offset);
    const dEnd = new Date(todayEnd);
    dEnd.setDate(dEnd.getDate() - i - offset);
    
    const dayOrders = completedOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= dStart && d <= dEnd;
    });
    
    const dayRev = dayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    if (dayRev > maxDaily) maxDaily = dayRev;
    chartData.push({ dayRev });
  }
  
  const performanceData = chartData.map(d => ({
    value: maxDaily > 0 ? (d.dayRev / maxDaily) * 100 + 10 : 10 // Base 10 height, max ~110
  }));

  // Top Items
  const itemCounts = {};
  completedOrders.forEach(o => {
    o.items.forEach(i => {
      if (i.foodId && i.foodId._id) {
        const fId = i.foodId._id;
        if (!itemCounts[fId]) {
          itemCounts[fId] = {
            name: i.foodId.name,
            image: i.foodId.image,
            count: 0,
            value: 0
          };
        }
        itemCounts[fId].count += i.quantity;
        itemCounts[fId].value += (i.quantity * i.price);
      }
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const displayDate = todayStart.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={{
              uri: restaurant?.image || "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>{restaurant?.name || "Trình quản lý Cửa hàng"}</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Text>🔔</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dateText}>{displayDate}</Text>
        <Text style={styles.title}>Báo cáo kinh doanh</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <FileText size={18} color={Colors.text} />
            <Text style={styles.actionBtnText}>Xuất PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
          >
            <Download size={18} color={Colors.white} />
            <Text style={[styles.actionBtnText, { color: Colors.white }]}>
              Xuất Excel
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.reportCard}>
          <Text style={styles.reportLabel}>DOANH THU HÔM NAY</Text>
          <Text style={styles.reportValue}>{todayRevenue.toLocaleString('vi-VN')}đ</Text>
          <View style={styles.trendRow}>
            <TrendingUp size={14} color={trend >= 0 ? "#2ECC71" : "#E74C3C"} />
            <Text style={[styles.trendText, { color: trend >= 0 ? "#2ECC71" : "#E74C3C" }]}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% so với hôm qua
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tổng đơn hàng</Text>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{todayOrders.length}</Text>
                <View style={styles.statIcon}>
                  <ShoppingCart size={16} color="#2ECC71" />
                </View>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Giá trị TB đơn hàng</Text>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{avgOrderValue.toLocaleString('vi-VN')}đ</Text>
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
                <TouchableOpacity 
                  style={chartTab === 'thisWeek' ? styles.chartTabActive : styles.chartTab}
                  onPress={() => setChartTab('thisWeek')}
                >
                  <Text style={chartTab === 'thisWeek' ? styles.chartTabTextActive : styles.chartTabText}>Tuần này</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={chartTab === 'lastWeek' ? styles.chartTabActive : styles.chartTab}
                  onPress={() => setChartTab('lastWeek')}
                >
                  <Text style={chartTab === 'lastWeek' ? styles.chartTabTextActive : styles.chartTabText}>Tuần trước</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bars}>
              {performanceData.map((d, i) => (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    {
                      height: d.value,
                      backgroundColor: i === 6 ? Colors.primary : "#F1E6E4",
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top món bán chạy</Text>
        {topItems.length === 0 ? (
          <Text style={{ color: Colors.textSecondary, textAlign: 'center', marginTop: 20 }}>Chưa có dữ liệu</Text>
        ) : (
          topItems.map((item, index) => (
            <View key={index} style={styles.topItem}>
              <Image
                source={{ uri: item.image || `https://via.placeholder.com/200` }}
                style={styles.topImage}
              />
              <View style={styles.topInfo}>
                <Text style={styles.topName}>{item.name}</Text>
                <Text style={styles.topCount}>{item.count} lượt bán</Text>
              </View>
              <View style={styles.topMeta}>
                <Text style={styles.topValue}>{item.value.toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F8" },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  headerTitle: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: { fontSize: 14, color: Colors.textSecondary },
  title: { fontSize: 28, fontWeight: "800", color: Colors.text, marginTop: 5 },
  actionRow: { flexDirection: "row", marginTop: 20 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBE6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginRight: 10,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginLeft: 8,
  },
  content: { paddingHorizontal: 20, marginTop: 30 },
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 30,
  },
  reportLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  reportValue: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.text,
    marginTop: 10,
  },
  trendRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  trendText: { fontSize: 12, color: Colors.textSecondary, marginLeft: 5 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    padding: 15,
  },
  statLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: "600" },
  statContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.text },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: { marginTop: 30 },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitle: { fontSize: 16, fontWeight: "800", color: Colors.text },
  chartTabs: {
    flexDirection: "row",
    backgroundColor: "#F1E6E4",
    borderRadius: 10,
    padding: 3,
  },
  chartTabActive: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  chartTabTextActive: { fontSize: 10, fontWeight: "700", color: Colors.text },
  chartTab: { paddingHorizontal: 10, paddingVertical: 5 },
  chartTabText: { fontSize: 10, color: Colors.textSecondary },
  bars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    marginTop: 20,
  },
  bar: { width: 20, borderRadius: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
  },
  topItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topImage: { width: 50, height: 50, borderRadius: 15 },
  topInfo: { flex: 1, marginLeft: 15 },
  topName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  topCount: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  topMeta: { alignItems: "flex-end" },
  topValue: { fontSize: 15, fontWeight: "800", color: Colors.text },
  topTrend: { fontSize: 10, color: "#2ECC71", fontWeight: "700", marginTop: 2 },
});

export default AnalyticsScreen;
