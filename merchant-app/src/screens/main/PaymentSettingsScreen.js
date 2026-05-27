import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { request } from "../../api/client";
import {
  ArrowLeft,
  Bell,
  Wallet,
  PencilLine,
  ChevronRight,
  CircleDollarSign,
  Trash2,
  Plus
} from "lucide-react-native";
import { Colors } from "../../constants/colors";

const PAYMENT_METHODS = [];
const PAYOUT_HISTORY = [];

const PaymentSettingsScreen = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = useState(route?.params?.restaurant || null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const fetchRestaurant = async () => {
    try {
      const data = await request('/restaurants/mine');
      setRestaurant(data);
      setBankAccounts(data.bankAccounts || []);
    } catch (e) {
      console.log('Error fetching restaurant', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurant();
    }, [])
  );

  const openAddModal = () => {
    setEditingId(null);
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
    setIsDefault(false);
    setModalVisible(true);
  };

  const openEditModal = (acc) => {
    setEditingId(acc._id);
    setBankName(acc.bankName);
    setAccountNumber(acc.accountNumber);
    setAccountHolder(acc.accountHolder);
    setIsDefault(acc.isDefault);
    setModalVisible(true);
  };

  const saveBankAccount = async () => {
    if (!bankName || !accountNumber || !accountHolder) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setIsSaving(true);
    try {
      const body = { bankName, accountNumber, accountHolder, isDefault };
      if (editingId) {
        await request(`/restaurants/${restaurant._id}/bank-accounts/${editingId}`, { method: 'PUT', body });
      } else {
        await request(`/restaurants/${restaurant._id}/bank-accounts`, { method: 'POST', body });
      }
      setModalVisible(false);
      fetchRestaurant();
    } catch (e) {
      Alert.alert("Lỗi", "Không thể lưu tài khoản ngân hàng");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBankAccount = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa tài khoản này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => {
        try {
          await request(`/restaurants/${restaurant._id}/bank-accounts/${id}`, { method: 'DELETE' });
          fetchRestaurant();
        } catch (e) {
          Alert.alert("Lỗi", "Không thể xóa tài khoản");
        }
      }}
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
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
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Tài khoản thụ hưởng</Text>
              <Text style={styles.panelSubtext}>
                Nơi nhận doanh thu sau đối soát
              </Text>
            </View>
            <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addBtnText}>Thêm mới</Text>
            </TouchableOpacity>
          </View>

          {bankAccounts.length === 0 ? (
            <Text style={{ textAlign: 'center', color: Colors.textSecondary, marginVertical: 20 }}>Chưa có tài khoản nào</Text>
          ) : (
            bankAccounts.map(acc => (
              <View key={acc._id} style={styles.bankCard}>
                <View style={styles.bankIcon}>
                  <Wallet size={18} color={Colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.bankName}>{acc.bankName}</Text>
                    {acc.isDefault && (
                      <View style={styles.defaultTagSmall}>
                        <Text style={styles.defaultTagTextSmall}>Mặc định</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.bankMeta}>•••••••• {acc.accountNumber.slice(-4)}</Text>
                  <Text style={styles.bankMeta}>{acc.accountHolder}</Text>
                </View>
                <View style={styles.bankActions}>
                  <TouchableOpacity onPress={() => openEditModal(acc)} style={styles.actionBtn}>
                    <PencilLine size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteBankAccount(acc._id)} style={styles.actionBtn}>
                    <Trash2 size={16} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Ví xử lý thanh toán</Text>
          {PAYMENT_METHODS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.methodCard}>
              <View
                style={[styles.methodIcon, { backgroundColor: item.color }]}
              >
                <CircleDollarSign size={18} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>{item.name}</Text>
                <Text style={styles.methodDetail}>{item.detail}</Text>
              </View>
              <ChevronRight size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.historyTitleRow}>
            <Text style={styles.panelTitle}>Lịch sử đối soát</Text>
            <Text style={styles.historyLink}>Xem tất cả →</Text>
          </View>
          {PAYOUT_HISTORY.map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View
                style={[
                  styles.statusCircle,
                  item.status === "success"
                    ? styles.successCircle
                    : styles.pendingCircle,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    item.status === "success"
                      ? styles.successDot
                      : styles.pendingDot,
                  ]}
                />
              </View>
              <Text style={styles.historyPeriod}>
                Kỳ thanh toán {item.period}
              </Text>
              <Text style={styles.historyAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Cần hỗ trợ về thanh toán?</Text>
          <Text style={styles.supportText}>
            Nếu bạn gặp lỗi rút tiền, chậm đối soát hoặc cần xác minh giấy tờ,
            đội ngũ hỗ trợ luôn sẵn sàng.
          </Text>
          <Text style={styles.supportLink}>Chat ngay</Text>
          <Text style={styles.supportLink}>Gửi yêu cầu</Text>
        </View>
      </View>
    </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingId ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản mới'}</Text>

            <Text style={styles.inputLabel}>Tên ngân hàng</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Vietcombank, Techcombank..."
              value={bankName}
              onChangeText={setBankName}
            />

            <Text style={styles.inputLabel}>Số tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tài khoản"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />

            <Text style={styles.inputLabel}>Tên chủ tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="VIET HOA KHONG DAU"
              autoCapitalize="characters"
              value={accountHolder}
              onChangeText={setAccountHolder}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Đặt làm tài khoản mặc định</Text>
              <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ true: Colors.primary }} />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveBankAccount} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Lưu</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  balanceCard: {
    backgroundColor: "#F37038",
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
  },
  balanceValue: { fontSize: 30, fontWeight: "900", color: Colors.white },
  balanceSubtext: { fontSize: 12, color: "#FDE7DF", marginTop: 8 },
  balanceAction: {
    alignSelf: "flex-start",
    backgroundColor: "#2D140A",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    marginTop: 14,
  },
  balanceActionText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  panel: {
    backgroundColor: "#FFF4F1",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F4E1DD",
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  panelTitle: { fontSize: 16, fontWeight: "800", color: Colors.text },
  panelSubtext: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  panelSubtext: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: { color: Colors.primary, fontSize: 12, fontWeight: "700", marginLeft: 4 },
  defaultTagSmall: {
    backgroundColor: "#B8F5C7",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  defaultTagTextSmall: { color: "#0B8A42", fontSize: 9, fontWeight: "700" },
  bankCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFE4E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 20,
  },
  bankMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  bankMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  bankActions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    marginLeft: 6,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  methodDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  historyTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  historyLink: { fontSize: 12, color: Colors.primary, fontWeight: "700" },
  historyRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  statusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  successCircle: { backgroundColor: "#DDF8E5" },
  pendingCircle: { backgroundColor: "#FFF2D8" },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  successDot: { backgroundColor: "#23C16B" },
  pendingDot: { backgroundColor: "#D79B00" },
  historyPeriod: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    fontWeight: "600",
  },
  historyAmount: { fontSize: 13, fontWeight: "800", color: Colors.text },
  supportCard: {
    backgroundColor: "#FBE4DE",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EED2CA",
  },
  supportTitle: { fontSize: 15, fontWeight: "800", color: Colors.text },
  supportText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 10,
  },
  supportLink: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 13,
    marginTop: 4,
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
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
});

export default PaymentSettingsScreen;
