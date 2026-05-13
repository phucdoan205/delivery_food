import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell, Wallet, PencilLine, ChevronRight, CircleDollarSign } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { PAYMENT_METHODS, PAYOUT_HISTORY } from '../../constants/profileMockData';

const PaymentSettingsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.brand}>Culinary Curator Merchant</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Bell size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>DOANH THU CHỜ THANH TOÁN</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceValue}>42.850.000 VND</Text>
          <Text style={styles.balanceSubtext}>Đã cập nhật theo chu kỳ T2CN, 2h sáng</Text>
          <TouchableOpacity style={styles.balanceAction}>
            <Text style={styles.balanceActionText}>Xem đối soát chi tiết</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Tài khoản thụ hưởng</Text>
              <Text style={styles.panelSubtext}>Nơi nhận doanh thu sau đối soát</Text>
            </View>
            <View style={styles.defaultTag}>
              <Text style={styles.defaultTagText}>Mặc định</Text>
            </View>
          </View>

          <View style={styles.bankCard}>
            <View style={styles.bankIcon}>
              <Wallet size={18} color={Colors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankName}>Ngân hàng TMCP Ngoại thương (VCB)</Text>
              <Text style={styles.bankMeta}>•••••••• 8951</Text>
              <Text style={styles.bankMeta}>NGUYEN VAN MERCHANT</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.textAction}>
            <PencilLine size={15} color={Colors.primary} />
            <Text style={styles.textActionLabel}>Thay đổi thông tin nhận tiền</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Ví xử lý thanh toán</Text>
          {PAYMENT_METHODS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.methodCard}>
              <View style={[styles.methodIcon, { backgroundColor: item.color }]}>
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
              <View style={[styles.statusCircle, item.status === 'success' ? styles.successCircle : styles.pendingCircle]}>
                <View style={[styles.statusDot, item.status === 'success' ? styles.successDot : styles.pendingDot]} />
              </View>
              <Text style={styles.historyPeriod}>Kỳ thanh toán {item.period}</Text>
              <Text style={styles.historyAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Cần hỗ trợ về thanh toán?</Text>
          <Text style={styles.supportText}>
            Nếu bạn gặp lỗi rút tiền, chậm đối soát hoặc cần xác minh giấy tờ, đội ngũ hỗ trợ luôn sẵn sàng.
          </Text>
          <Text style={styles.supportLink}>Chat ngay</Text>
          <Text style={styles.supportLink}>Gửi yêu cầu</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F8' },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 10 },
  balanceCard: { backgroundColor: '#F37038', borderRadius: 26, padding: 22, marginBottom: 18 },
  balanceValue: { fontSize: 30, fontWeight: '900', color: Colors.white },
  balanceSubtext: { fontSize: 12, color: '#FDE7DF', marginTop: 8 },
  balanceAction: { alignSelf: 'flex-start', backgroundColor: '#2D140A', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 18, marginTop: 14 },
  balanceActionText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  panel: { backgroundColor: '#FFF4F1', borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#F4E1DD' },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  panelTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  panelSubtext: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  defaultTag: { backgroundColor: '#B8F5C7', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  defaultTagText: { color: '#0B8A42', fontSize: 11, fontWeight: '700' },
  bankCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center' },
  bankIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFE4E2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bankName: { fontSize: 14, fontWeight: '700', color: Colors.text, lineHeight: 20 },
  bankMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  textAction: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  textActionLabel: { marginLeft: 8, color: Colors.primary, fontSize: 13, fontWeight: '700' },
  methodCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  methodIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  methodName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  methodDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  historyTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  historyLink: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  statusCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  successCircle: { backgroundColor: '#DDF8E5' },
  pendingCircle: { backgroundColor: '#FFF2D8' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  successDot: { backgroundColor: '#23C16B' },
  pendingDot: { backgroundColor: '#D79B00' },
  historyPeriod: { flex: 1, fontSize: 13, color: Colors.text, fontWeight: '600' },
  historyAmount: { fontSize: 13, fontWeight: '800', color: Colors.text },
  supportCard: { backgroundColor: '#FBE4DE', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#EED2CA' },
  supportTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  supportText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginTop: 8, marginBottom: 10 },
  supportLink: { color: Colors.primary, fontWeight: '700', fontSize: 13, marginTop: 4 },
});

export default PaymentSettingsScreen;
