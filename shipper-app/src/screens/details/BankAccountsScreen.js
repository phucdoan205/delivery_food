import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { request } from '../../api/client';

const BankAccountsScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await request('/auth/profile');
      setProfile(data);
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddAccount = () => {
    setModalMode('add');
    setBank('');
    setAccountNumber('');
    setAccountName('');
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleEditAccount = (item) => {
    setModalMode('edit');
    setBank(item.bank);
    setAccountNumber(item.accountNumber);
    setAccountName(item.accountName);
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveAccount = async () => {
    if (!bank.trim() || !accountNumber.trim() || !accountName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    setModalVisible(false);
    setLoading(true);
    try {
      const currentAccounts = profile?.bankAccounts || [];
      let updatedAccounts = [];
      
      if (modalMode === 'add') {
        const newAcc = {
          bank,
          accountNumber,
          accountName,
          isDefault: currentAccounts.length === 0
        };
        updatedAccounts = [...currentAccounts, newAcc];
      } else {
        updatedAccounts = currentAccounts.map(acc => 
          (acc._id === editingItem._id)
            ? { ...acc, bank, accountNumber, accountName }
            : acc
        );
      }
      
      const updated = await request('/auth/profile', {
        method: 'PUT',
        body: { bankAccounts: updatedAccounts }
      });
      setProfile(updated);
      Alert.alert('Thành công', modalMode === 'add' ? 'Đã thêm tài khoản mới' : 'Đã cập nhật thông tin');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (itemToSet) => {
    setLoading(true);
    try {
      const currentAccounts = profile?.bankAccounts || [];
      const updatedAccounts = currentAccounts.map(acc => ({
        ...acc,
        isDefault: acc._id === itemToSet._id
      }));
      const updated = await request('/auth/profile', {
        method: 'PUT',
        body: { bankAccounts: updatedAccounts }
      });
      setProfile(updated);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể thiết lập mặc định');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = (itemToDelete) => {
    Alert.alert('Xác nhận', 'Bạn muốn xóa tài khoản này?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const currentAccounts = profile?.bankAccounts || [];
            const updatedAccounts = currentAccounts.filter(acc => acc._id !== itemToDelete._id);
            if (itemToDelete.isDefault && updatedAccounts.length > 0) {
                updatedAccounts[0].isDefault = true;
            }
            const updated = await request('/auth/profile', {
              method: 'PUT',
              body: { bankAccounts: updatedAccounts }
            });
            setProfile(updated);
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xóa tài khoản');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const bankAccounts = profile?.bankAccounts || [];
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header title="Liên kết ngân hàng" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.securityBanner}>
           <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
           <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle}>Bảo mật thông tin 100%</Text>
              <Text style={styles.bannerText}>Tài khoản của bạn được mã hóa và bảo vệ bởi tiêu chuẩn PCI DSS.</Text>
           </View>
        </View>

        <Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
        <Text style={styles.sectionSubtitle}>Quản lý các tài khoản nhận lương</Text>

        {bankAccounts.map((account) => (
          <View key={account._id || Math.random().toString()} style={[styles.accountCard, account.isDefault && styles.defaultCard]}>
            <View style={styles.cardHeader}>
               <View>
                  <Text style={styles.accountType}>{account.isDefault ? 'TÀI KHOẢN MẶC ĐỊNH' : ''}</Text>
                  <Text style={styles.bankName}>{account.bank}</Text>
               </View>
               <Ionicons name="card-outline" size={30} color={COLORS.primary} />
            </View>

            <View style={styles.accountDetails}>
               <Text style={styles.accountNumber}>{account.accountNumber}</Text>
               <Text style={styles.accountHolder}>{account.accountName}</Text>
            </View>

            <View style={styles.cardFooter}>
               {account.isDefault ? (
                 <View style={styles.activeBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                 </View>
               ) : (
                 <TouchableOpacity style={styles.setDefaultButton} onPress={() => handleSetDefault(account)}>
                    <Text style={styles.setDefaultText}>Đặt mặc định</Text>
                 </TouchableOpacity>
               )}
               
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <TouchableOpacity style={styles.actionBtnIcon} onPress={() => handleEditAccount(account)}>
                    <Ionicons name="create-outline" size={20} color={COLORS.textSecondary} />
                 </TouchableOpacity>
                 {!account.isDefault && (
                   <TouchableOpacity style={styles.actionBtnIcon} onPress={() => handleDeleteAccount(account)}>
                      <Ionicons name="trash-outline" size={20} color={COLORS.red || '#E53935'} />
                   </TouchableOpacity>
                 )}
               </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
           <View style={styles.addIconBox}>
              <Ionicons name="add" size={24} color={COLORS.primary} />
           </View>
           <Text style={styles.addButtonText}>Thêm tài khoản mới</Text>
        </TouchableOpacity>

        <View style={styles.noteBox}>
           <Text style={styles.noteText}>
              Lưu ý: Để đảm bảo an toàn, Culinary Courier chỉ cho phép rút tiền về tài khoản chính chủ. Các yêu cầu thay đổi tài khoản có thể mất tới 24h để phê duyệt.
           </Text>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalMode === 'add' ? 'Thêm tài khoản ngân hàng' : 'Sửa tài khoản'}</Text>
            
            <Text style={styles.inputLabel}>Ngân hàng</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: MB Bank, Vietcombank..."
              value={bank}
              onChangeText={setBank}
            />

            <Text style={styles.inputLabel}>Số tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tài khoản"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
            />

            <Text style={styles.inputLabel}>Tên chủ tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="NGUYEN VAN A"
              value={accountName}
              onChangeText={setAccountName}
              autoCapitalize="characters"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnTextCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveAccount}>
                <Text style={styles.modalBtnTextSave}>Lưu</Text>
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    padding: SIZES.padding,
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: SIZES.padding / 1.5,
    borderRadius: 20,
    marginBottom: SIZES.padding,
  },
  bannerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    ...FONTS.h4,
    color: COLORS.success,
    fontSize: 14,
  },
  bannerText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    ...FONTS.h2,
    fontSize: 22,
  },
  sectionSubtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
  },
  accountCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  defaultCard: {
    borderWidth: 1,
    borderColor: 'rgba(211, 84, 0, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountType: {
    ...FONTS.body4,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  bankName: {
    ...FONTS.h3,
    fontSize: 18,
    marginTop: 2,
  },
  bankLogo: {
    width: 60,
    height: 30,
  },
  accountDetails: {
    marginTop: SIZES.padding,
  },
  accountNumber: {
    ...FONTS.h2,
    fontSize: 20,
    letterSpacing: 2,
  },
  accountHolder: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  activeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 25,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
  },
  addIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  noteBox: {
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  noteText: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  actionBtnIcon: {
    marginLeft: 15,
    padding: 5,
  },
  setDefaultButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    marginRight: 'auto',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalBtnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  modalBtnTextCancel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  modalBtnSave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalBtnTextSave: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  }
});

export default BankAccountsScreen;
