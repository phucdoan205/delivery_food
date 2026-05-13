import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell, Clock3, ChevronDown } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { OPERATING_HOURS } from '../../constants/profileMockData';

const OperatingHoursScreen = ({ navigation }) => {
  const [temporaryClosed, setTemporaryClosed] = useState(false);

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
        <Text style={styles.sectionLabel}>CÀI ĐẶT HỆ THỐNG</Text>
        <Text style={styles.title}>Giờ hoạt động</Text>
        <Text style={styles.subtitle}>
          Thiết lập thời gian mở cửa của nhà hàng để khách hàng có thể đặt món đúng thời điểm.
        </Text>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Clock3 size={18} color={Colors.primary} />
          </View>
          <View style={styles.noticeBody}>
            <Text style={styles.noticeTitle}>Tạm thời đóng cửa</Text>
            <Text style={styles.noticeText}>Ngưng nhận đơn trong 24 giờ tới</Text>
          </View>
          <TouchableOpacity
            onPress={() => setTemporaryClosed((prev) => !prev)}
            style={[styles.switchTrack, temporaryClosed && styles.switchTrackActive]}
          >
            <View style={[styles.switchThumb, temporaryClosed && styles.switchThumbActive]} />
          </TouchableOpacity>
        </View>

        {OPERATING_HOURS.map((item) => (
          <View key={item.id} style={styles.dayCard}>
            <Text style={styles.dayLabel}>{item.day}</Text>
            {item.enabled ? (
              <>
                <View style={styles.timeRow}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{item.open}</Text>
                    <ChevronDown size={16} color={Colors.textSecondary} />
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{item.close}</Text>
                    <ChevronDown size={16} color={Colors.textSecondary} />
                  </View>
                </View>
                <View style={styles.openBadge}>
                  <Text style={styles.openBadgeText}>Mở cửa</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.closedText}>{item.note}</Text>
                <View style={styles.closedBadge}>
                  <Text style={styles.closedBadgeText}>Đóng cửa</Text>
                </View>
              </>
            )}
          </View>
        ))}

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Hủy thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Lưu cài đặt</Text>
          </TouchableOpacity>
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
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '800', color: Colors.text, marginTop: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary, marginTop: 10, marginBottom: 22 },
  noticeCard: { backgroundColor: '#FDEBE7', borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  noticeIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFD8CF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  noticeBody: { flex: 1 },
  noticeTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  noticeText: { fontSize: 11, color: Colors.textSecondary, marginTop: 3 },
  switchTrack: { width: 48, height: 28, borderRadius: 14, backgroundColor: '#E7D5D1', justifyContent: 'center', paddingHorizontal: 3 },
  switchTrackActive: { backgroundColor: '#F5BEB2' },
  switchThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.white },
  switchThumbActive: { alignSelf: 'flex-end' },
  dayCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F3E7E4', marginBottom: 14 },
  dayLabel: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeBox: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF5F2', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 },
  timeText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  arrow: { marginHorizontal: 10, fontSize: 18, color: Colors.primary, fontWeight: '700' },
  openBadge: { alignSelf: 'flex-end', marginTop: 12, backgroundColor: '#DDF8E5', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  openBadgeText: { fontSize: 11, fontWeight: '700', color: '#18A957' },
  closedText: { fontSize: 12, color: Colors.textSecondary },
  closedBadge: { alignSelf: 'flex-start', marginTop: 12, backgroundColor: '#FFE4D8', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  closedBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  footerRow: { flexDirection: 'row', marginTop: 20 },
  cancelBtn: { flex: 1, height: 54, borderRadius: 27, backgroundColor: '#F9DEDA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cancelText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  saveBtn: { flex: 1, height: 54, borderRadius: 27, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});

export default OperatingHoursScreen;
