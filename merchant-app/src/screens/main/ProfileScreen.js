import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CreditCard,
  Users,
  User,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronRight,
  Store,
  Ticket,
  Clock,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { request, setToken } from "../../api/client";

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [restaurant, setRestaurant] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const user = await request('/auth/profile');
        setCurrentUser(user);
        const rest = await request('/restaurants/mine');
        setRestaurant(rest);
      } catch (error) {
        console.log('Error fetching restaurant for profile:', error);
      }
    };
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRestaurant();
    });
    return unsubscribe;
  }, [navigation]);
  const handleLogout = () => {
    setToken('');
    navigation.replace('Login');
  };
  const menuItems = [
    {
      icon: Store,
      label: "Thông tin nhà hàng",
      sub: "Địa chỉ, SĐT, danh mục",
      screen: "RestaurantInfo",
    },
    {
      icon: Clock,
      label: "Giờ hoạt động",
      sub: "Hàng ngày, hàng tuần",
      screen: "OperatingHours",
    },
    {
      icon: CreditCard,
      label: "Cài đặt thanh toán",
      sub: "Ví, ngân hàng, doanh thu",
      screen: "PaymentSettings",
    },
    {
      icon: Users,
      label: "Quản lý nhân viên",
      sub: "Quản lý nhân sự của nhà hàng",
      screen: "StaffManagement",
    },
    {
      icon: Ticket,
      label: "Chương trình khuyến mãi",
      sub: "Tạo voucher, mã giảm giá",
      screen: "Promotions",
    },
    {
      icon: MessageSquare,
      label: "Phản hồi khách hàng",
      sub: "Những phản hồi của khách hàng",
      screen: "CustomerFeedback",
    },
    {
      icon: HelpCircle,
      label: "Hỗ trợ & Trợ giúp",
      sub: "Trung tâm hỗ trợ đối tác",
      screen: "SupportHelp",
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (currentUser?.role === 'staff') {
      const hiddenForStaff = ['OperatingHours', 'PaymentSettings', 'StaffManagement', 'Promotions'];
      return !hiddenForStaff.includes(item.screen);
    }
    return true;
  });

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brand}>{restaurant?.name || 'Đang tải...'}</Text>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image
              source={{
                uri: restaurant?.image || "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.restLogoContainer}>
            <Image
              source={{ uri: restaurant?.image || "https://via.placeholder.com/200" }}
              style={styles.restLogo}
            />
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.restName}>{restaurant?.name || 'Cửa hàng của tôi'}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.restStatus}>
              <Text style={styles.restStatusText}>{restaurant?.status === 'approved' ? 'MỞ CỬA' : 'CHỜ DUYỆT'}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>★ {restaurant?.rating || '0.0'}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Người theo dõi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Tham gia</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Quản trị nhà hàng</Text>
        {filteredMenuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen, { restaurant })}
          >
            <View style={styles.menuIconContainer}>
              <item.icon size={20} color={Colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            {item.badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            ) : null}
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={Colors.primary} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F8" },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  brand: { fontSize: 16, fontWeight: "800", color: Colors.primary },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  restLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
  },
  restLogo: { width: "100%", height: "100%", borderRadius: 35 },
  statusDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2ECC71",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  restName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  restStatus: {
    backgroundColor: "#2ECC7115",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  restStatusText: { fontSize: 10, fontWeight: "800", color: "#2ECC71" },
  ratingBox: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 14, fontWeight: "700", color: "#F1C40F" },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: Colors.border,
    alignSelf: "center",
  },
  menuContainer: { paddingHorizontal: 20, marginTop: 30 },
  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#FBE9E7",
  },
  menuTextContainer: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "700", color: Colors.text },
  menuSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  badge: {
    backgroundColor: Colors.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: "800" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginLeft: 10,
  },
  bottomSpacer: { height: 100 },
});

export default ProfileScreen;
