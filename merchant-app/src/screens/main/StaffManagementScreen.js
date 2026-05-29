import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "@react-navigation/native";
import { request } from "../../api/client";
import {
  ArrowLeft,
  Bell,
  Plus,
  BriefcaseBusiness,
  ChevronRight,
  Lock,
  Unlock,
  PencilLine
} from "lucide-react-native";
import { Colors } from "../../constants/colors";

const STAFF = [];
const STAFF_FILTERS = ["Tất cả"];

const StaffManagementScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const [restaurant, setRestaurant] = useState(route?.params?.restaurant || null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarBase64, setAvatarBase64] = useState(null);

  const [activeFilter, setActiveFilter] = useState(STAFF_FILTERS[0]);

  const fetchStaff = async () => {
    try {
      let currentRes = restaurant;
      if (!currentRes) {
        currentRes = await request('/restaurants/mine');
        setRestaurant(currentRes);
      }
      const data = await request(`/restaurants/${currentRes._id}/staff?t=${Date.now()}`);
      setStaffList(data);
    } catch (e) {
      console.log('Error fetching staff', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStaff();
    }, [restaurant])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setAvatarBase64(null);
    setModalVisible(true);
  };

  const openEditModal = (staff) => {
    setEditingId(staff._id);
    setFullName(staff.fullName);
    setEmail(staff.email);
    setPassword("");
    setPhone(staff.phone || "");
    setAvatarBase64(staff.avatar || null);
    setModalVisible(true);
  };

  const saveStaff = async () => {
    if (!fullName || !email || (!password && !editingId)) {
      Alert.alert("Lỗi", "Vui lòng nhập Tên, Email và Mật khẩu");
      return;
    }
    setIsSaving(true);
    try {
      const body = { fullName, email, phone };
      if (password) body.password = password;
      if (avatarBase64) body.avatar = avatarBase64;

      if (editingId) {
        await request(`/restaurants/${restaurant._id}/staff/${editingId}`, {
          method: 'PUT',
          body
        });
      } else {
        await request(`/restaurants/${restaurant._id}/staff`, {
          method: 'POST',
          body
        });
      }
      
      setModalVisible(false);
      fetchStaff();
    } catch (e) {
      Alert.alert("Lỗi", e.message || "Không thể lưu nhân viên");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStaffStatus = async (staffId, isBanned) => {
    try {
      await request(`/restaurants/${restaurant._id}/staff/${staffId}/status`, { method: 'PUT' });
      fetchStaff();
    } catch (e) {
      if (Platform.OS !== 'web') {
        Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
      }
    }
  };

  const activeCount = staffList.filter(s => s.status !== 'banned').length;
  const bannedCount = staffList.filter(s => s.status === 'banned').length;
  const totalCount = staffList.length;
  const activePercent = totalCount === 0 ? 0 : (activeCount / totalCount) * 100;
  const bannedPercent = totalCount === 0 ? 0 : (bannedCount / totalCount) * 100;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.brand}>{restaurant?.name || 'Cửa hàng của tôi'}</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Bell size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Quản lý nhân viên</Text>
        <Text style={styles.subtitle}>
          Điều hành đội ngũ Culinary Curator của bạn
        </Text>

        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Plus size={18} color={Colors.white} />
          <Text style={styles.addBtnText}>Thêm nhân viên mới</Text>
        </TouchableOpacity>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <BriefcaseBusiness size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryValue}>{totalCount}</Text>
              <Text style={styles.summaryText}>Tổng số nhân sự</Text>
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Đang làm việc</Text>
              <Text style={styles.progressMeta}>{activeCount} người</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${activePercent}%`, backgroundColor: "#27C36A" },
                ]}
              />
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Đang nghỉ / Bị khóa</Text>
              <Text style={styles.progressMeta}>{bannedCount} người</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${bannedPercent}%`, backgroundColor: "#E53935" },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {STAFF_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {staffList.length === 0 ? (
          <Text style={{ textAlign: 'center', color: Colors.textSecondary, marginVertical: 20 }}>Chưa có nhân viên nào</Text>
        ) : (
          staffList.map((item) => (
            <View key={item._id} style={styles.staffCard}>
              <Image 
                source={{ uri: item.avatar || 'https://via.placeholder.com/150' }} 
                style={styles.avatar} 
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.staffName}>{item.fullName}</Text>
                <Text style={styles.staffRole}>{item.email}</Text>
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          item.status !== "banned" ? "#27C36A" : "#E53935",
                      },
                    ]}
                  />
                  <Text style={styles.metaText}>
                    {item.status !== "banned" ? "Đang làm việc" : "Bị khóa"}
                  </Text>
                  {item.phone && (
                    <>
                      <Text style={styles.separator}>•</Text>
                      <Text style={styles.metaText}>{item.phone}</Text>
                    </>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => openEditModal(item)}
                >
                  <PencilLine size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => toggleStaffStatus(item._id, item.status === 'banned')}
                >
                  {item.status === 'banned' ? (
                    <Unlock size={18} color="#27C36A" />
                  ) : (
                    <Lock size={18} color="#E53935" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingId ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}</Text>

            <View style={styles.avatarPickerContainer}>
              <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
                {avatarBase64 ? (
                  <Image source={{ uri: avatarBase64 }} style={styles.avatarPreview} />
                ) : (
                  <Text style={styles.avatarPickerText}>Tải ảnh lên</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Nguyễn Văn A"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.inputLabel}>Email (dùng để đăng nhập)</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: nhanvien1@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputLabel}>{editingId ? "Mật khẩu mới (bỏ trống nếu không đổi)" : "Mật khẩu"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.inputLabel}>Số điện thoại (không bắt buộc)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveStaff} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F8" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  brand: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: "800", color: Colors.text },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 18,
  },
  addBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 18,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: "#FCEAE6",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  summaryTop: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFD8CF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryValue: { fontSize: 28, fontWeight: "900", color: Colors.text },
  summaryText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  progressBlock: { marginTop: 10 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: { fontSize: 13, fontWeight: "700", color: Colors.text },
  progressMeta: { fontSize: 12, color: Colors.textSecondary },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 8 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  filterChip: {
    backgroundColor: "#F7E6E1",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  staffCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  avatar: { width: 52, height: 52, borderRadius: 14, marginRight: 12 },
  staffName: { fontSize: 15, fontWeight: "800", color: Colors.text },
  staffRole: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 3,
    fontWeight: "700",
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  separator: { fontSize: 12, color: Colors.textSecondary, marginHorizontal: 6 },
  actionBtn: {
    padding: 10,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 14,
    color: Colors.text,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  avatarPickerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPicker: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
  },
  avatarPickerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default StaffManagementScreen;
