import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { ChevronLeft, Plus, Ticket, Users, Calendar, ChevronRight, Edit2, Trash2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { request } from '../../api/client';

const PromotionsScreen = ({ route, navigation }) => {
  const { restaurant } = route?.params || {};
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // percentage or amount
  const [discountValue, setDiscountValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const fetchPromotions = async () => {
    try {
      const data = await request(`/promotions/restaurant/${restaurant._id}`);
      setPromotions(data);
    } catch (e) {
      console.log('Error fetching promos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?._id) {
      fetchPromotions();
    }
  }, [restaurant]);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEndDate(nextWeek.toISOString().split('T')[0]);
    setUsageLimit('');
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setCode(item.code);
    setDiscountType(item.discountType || 'percentage');
    setDiscountValue(item.discountValue?.toString() || '');
    setStartDate(new Date(item.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(item.endDate).toISOString().split('T')[0]);
    setUsageLimit(item.usageLimit ? item.usageLimit.toString() : '');
    setModalVisible(true);
  };

  const deletePromo = (id) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Bạn có chắc muốn xóa khuyến mãi này?");
      if (confirm) {
        request(`/promotions/${id}`, { method: 'DELETE' })
          .then(() => fetchPromotions())
          .catch(() => window.alert("Không thể xóa"));
      }
    } else {
      Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khuyến mãi này?", [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: async () => {
          try {
            await request(`/promotions/${id}`, { method: 'DELETE' });
            fetchPromotions();
          } catch(e) {
            Alert.alert("Lỗi", "Không thể xóa");
          }
        }}
      ]);
    }
  };

  const savePromo = async () => {
    if (!title || !code || !discountValue || !startDate || !endDate) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsSaving(true);
    const body = {
      restaurantId: restaurant._id,
      title,
      code,
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      usageLimit: usageLimit ? Number(usageLimit) : 0
    };

    try {
      if (editingId) {
        await request(`/promotions/${editingId}`, { method: 'PUT', body });
      } else {
        await request('/promotions', { method: 'POST', body });
      }
      setModalVisible(false);
      fetchPromotions();
    } catch(e) {
      Alert.alert('Lỗi', e.message || 'Không thể lưu khuyến mãi');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPromoCard = ({ item }) => (
    <View style={styles.promoCard}>
      <View style={styles.promoHeader}>
        <View style={styles.codeBadge}>
          <Ticket size={16} color={Colors.primary} />
          <Text style={styles.codeText}>{item.code}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#E8F5E9' : '#FFEBEE' }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? '#2ECC71' : '#E53935' }]}>
            {item.status === 'active' ? 'Đang chạy' : 'Hết hạn'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.promoTitle}>{item.title}</Text>
      <Text style={styles.promoDiscount}>
        Giảm {item.discountType === 'percentage' ? `${item.discountValue}%` : `${item.discountValue.toLocaleString()}đ`}
      </Text>
      
      <View style={styles.promoFooter}>
        <View style={styles.footerItem}>
          <Users size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>{item.usageCount || 0}{item.usageLimit ? `/${item.usageLimit}` : ''} lượt dùng</Text>
        </View>
        <View style={styles.footerItem}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>Hết hạn: {new Date(item.endDate).toLocaleDateString('vi-VN')}</Text>
        </View>
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
          <Edit2 size={16} color={Colors.primary} />
          <Text style={styles.editBtnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePromo(item._id)}>
          <Trash2 size={16} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const activePromos = promotions.filter(p => p.status === 'active').length;
  const totalUsage = promotions.reduce((sum, p) => sum + (p.usageCount || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chương trình khuyến mãi</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{activePromos < 10 ? `0${activePromos}` : activePromos}</Text>
            <Text style={styles.statLabel}>Đang chạy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalUsage}</Text>
            <Text style={styles.statLabel}>Lượt dùng</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>+15%</Text>
            <Text style={styles.statLabel}>Tăng trưởng</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={openAddModal}>
          <Plus size={20} color={Colors.white} />
          <Text style={styles.createBtnText}>Tạo khuyến mãi mới</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Danh sách khuyến mãi</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={promotions}
            renderItem={renderPromoCard}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
            ListEmptyComponent={<Text style={{textAlign: 'center', color: Colors.textSecondary, marginTop: 20}}>Chưa có khuyến mãi nào</Text>}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingId ? "Sửa khuyến mãi" : "Thêm khuyến mãi mới"}</Text>

            <Text style={styles.inputLabel}>Tên chương trình</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Giảm giá mùa hè"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Mã giảm giá (Code)</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: SUMMER20"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Loại giảm giá</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity 
                style={[styles.typeBtn, discountType === 'percentage' && styles.typeBtnActive]}
                onPress={() => setDiscountType('percentage')}
              >
                <Text style={[styles.typeBtnText, discountType === 'percentage' && styles.typeBtnTextActive]}>Theo %</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, discountType === 'amount' && styles.typeBtnActive]}
                onPress={() => setDiscountType('amount')}
              >
                <Text style={[styles.typeBtnText, discountType === 'amount' && styles.typeBtnTextActive]}>Số tiền mặt</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Mức giảm (Số)</Text>
            <TextInput
              style={styles.input}
              placeholder={discountType === 'percentage' ? "VD: 15" : "VD: 20000"}
              value={discountValue}
              onChangeText={setDiscountValue}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Ngày bắt đầu (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={styles.inputLabel}>Ngày kết thúc (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />

            <Text style={styles.inputLabel}>Số lượt dùng (Nhập 0 hoặc để trống nếu không giới hạn)</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: 100"
              value={usageLimit}
              onChangeText={setUsageLimit}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={savePromo} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Lưu</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  createBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 15,
  },
  promoCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  promoDiscount: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 15,
  },
  promoFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 15,
    marginBottom: 15,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F8',
    padding: 10,
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 5,
  },
  listPadding: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  typeBtnActive: {
    backgroundColor: '#FBE9E7',
    borderColor: Colors.primary,
  },
  typeBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: Colors.primary,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    marginRight: 10,
  },
  cancelBtnText: { color: Colors.text, fontSize: 15, fontWeight: "600" },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  saveBtnText: { color: Colors.white, fontSize: 15, fontWeight: "600" },
});

export default PromotionsScreen;
