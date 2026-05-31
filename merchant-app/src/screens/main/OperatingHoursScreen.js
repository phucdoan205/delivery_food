import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Clock3, ChevronDown, Plus, X } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { request } from "../../api/client";

const ALL_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const OperatingHoursScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { restaurant } = route?.params || {};
  const [temporaryClosed, setTemporaryClosed] = useState(restaurant?.isTemporarilyClosed || false);
  const [operatingHours, setOperatingHours] = useState(restaurant?.operatingHours || []);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);

  const availableDays = ALL_DAYS.filter(d => !operatingHours.find(h => h.day === d));

  const addDay = (day) => {
    setOperatingHours([...operatingHours, { day, open: '08:00', close: '22:00', enabled: true }]);
    setShowAddModal(false);
  };

  const removeDay = (day) => {
    setOperatingHours(operatingHours.filter(h => h.day !== day));
  };

  const updateTime = (day, field, value) => {
    setOperatingHours(operatingHours.map(h => {
      if (h.day === day) return { ...h, [field]: value };
      return h;
    }));
  };

  const toggleDayEnabled = (day) => {
    setOperatingHours(operatingHours.map(h => {
      if (h.day === day) return { ...h, enabled: !h.enabled };
      return h;
    }));
  };

  const handleSave = async () => {
    try {
      await request(`/restaurants/${restaurant._id || restaurant.id}/operating-hours`, {
        method: 'PUT',
        body: {
          operatingHours,
          isTemporarilyClosed: temporaryClosed
        }
      });
      Alert.alert('Thành công', 'Đã lưu cài đặt giờ hoạt động');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu cài đặt');
    }
  };

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
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>CÀI ĐẶT HỆ THỐNG</Text>
        <Text style={styles.title}>Giờ hoạt động</Text>
        <Text style={styles.subtitle}>
          Thiết lập thời gian mở cửa của nhà hàng để khách hàng có thể đặt món
          đúng thời điểm.
        </Text>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Clock3 size={18} color={Colors.primary} />
          </View>
          <View style={styles.noticeBody}>
            <Text style={styles.noticeTitle}>Tạm thời đóng cửa</Text>
            <Text style={styles.noticeText}>
              Ngưng nhận đơn trong 24 giờ tới
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setTemporaryClosed((prev) => !prev)}
            style={[
              styles.switchTrack,
              temporaryClosed && styles.switchTrackActive,
            ]}
          >
            <View
              style={[
                styles.switchThumb,
                temporaryClosed && styles.switchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {operatingHours.map((item) => (
          <View key={item.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>{item.day}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => toggleDayEnabled(item.day)}>
                  <Text style={{ color: item.enabled ? Colors.primary : Colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>
                    {item.enabled ? 'Đang bật' : 'Đã tắt'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeDay(item.day)}>
                  <X size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            {item.enabled ? (
              <>
                <View style={styles.timeRow}>
                  <View style={styles.timeBox}>
                    <TextInput 
                      style={styles.timeText} 
                      value={item.open} 
                      onChangeText={(val) => updateTime(item.day, 'open', val)}
                      placeholder="08:00"
                    />
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={styles.timeBox}>
                    <TextInput 
                      style={styles.timeText} 
                      value={item.close} 
                      onChangeText={(val) => updateTime(item.day, 'close', val)}
                      placeholder="22:00"
                    />
                  </View>
                </View>
                <View style={styles.openBadge}>
                  <Text style={styles.openBadgeText}>Mở cửa</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.closedText}>Không hoạt động</Text>
                <View style={styles.closedBadge}>
                  <Text style={styles.closedBadgeText}>Đóng cửa</Text>
                </View>
              </>
            )}
          </View>
        ))}

        {availableDays.length > 0 && (
          <TouchableOpacity style={styles.addDayBtn} onPress={() => setShowAddModal(true)}>
            <Plus size={20} color={Colors.primary} />
            <Text style={styles.addDayText}>Thêm ngày hoạt động</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Hủy thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Lưu cài đặt</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngày thêm</Text>
            {availableDays.map(d => (
              <TouchableOpacity key={d} style={styles.modalOption} onPress={() => addDay(d)}>
                <Text style={styles.modalOptionText}>{d}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
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
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  title: { fontSize: 30, fontWeight: "800", color: Colors.text, marginTop: 6 },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginTop: 10,
    marginBottom: 22,
  },
  noticeCard: {
    backgroundColor: "#FDEBE7",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFD8CF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  noticeBody: { flex: 1 },
  noticeTitle: { fontSize: 15, fontWeight: "700", color: Colors.text },
  noticeText: { fontSize: 11, color: Colors.textSecondary, marginTop: 3 },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E7D5D1",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  switchTrackActive: { backgroundColor: "#F5BEB2" },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
  },
  switchThumbActive: { alignSelf: "flex-end" },
  dayCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F3E7E4",
    marginBottom: 14,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  timeRow: { flexDirection: "row", alignItems: "center" },
  timeBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF5F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  timeText: { fontSize: 13, fontWeight: "700", color: Colors.text },
  arrow: {
    marginHorizontal: 10,
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
  },
  openBadge: {
    alignSelf: "flex-end",
    marginTop: 12,
    backgroundColor: "#DDF8E5",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  openBadgeText: { fontSize: 11, fontWeight: "700", color: "#18A957" },
  closedText: { fontSize: 12, color: Colors.textSecondary },
  closedBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "#FFE4D8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closedBadgeText: { fontSize: 11, fontWeight: "700", color: Colors.primary },
  footerRow: { flexDirection: "row", marginTop: 20 },
  cancelBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F9DEDA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cancelText: { color: Colors.primary, fontSize: 15, fontWeight: "700" },
  saveBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
  addDayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#FDEBE7',
    borderStyle: 'dashed',
    borderRadius: 20,
    marginBottom: 10,
  },
  addDayText: {
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  modalCancelBtn: {
    marginTop: 15,
    paddingVertical: 12,
  },
  modalCancelText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OperatingHoursScreen;
