import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { bankAccounts } from '../../constants/mockData';

const BankAccountsScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Liên kết ngân hàng" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
          <View key={account.id} style={[styles.accountCard, account.isDefault && styles.defaultCard]}>
            <View style={styles.cardHeader}>
               <View>
                  <Text style={styles.accountType}>{account.isDefault ? 'TÀI KHOẢN MẶC ĐỊNH' : ''}</Text>
                  <Text style={styles.bankName}>{account.bank}</Text>
               </View>
               <Image source={{ uri: account.logo }} style={styles.bankLogo} resizeMode="contain" />
            </View>

            <View style={styles.accountDetails}>
               <Text style={styles.accountNumber}>{account.accountNumber}</Text>
               <Text style={styles.accountHolder}>{account.accountName}</Text>
            </View>

            <View style={styles.cardFooter}>
               {account.isDefault ? (
                 <View style={styles.activeBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                 </View>
               ) : (
                 <TouchableOpacity style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.textSecondary} />
                 </TouchableOpacity>
               )}
               {!account.isDefault && (
                 <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
                 </TouchableOpacity>
               )}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
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
});

export default BankAccountsScreen;
