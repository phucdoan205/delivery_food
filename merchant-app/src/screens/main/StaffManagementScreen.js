import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Bell, Plus, BriefcaseBusiness, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { STAFF } from '../../constants/mockData';
import { STAFF_FILTERS } from '../../constants/profileMockData';

const StaffManagementScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState(STAFF_FILTERS[0]);

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
        <Text style={styles.title}>Quản lý nhân viên</Text>
        <Text style={styles.subtitle}>Điều hành đội ngũ Culinary Curator của bạn</Text>

        <TouchableOpacity style={styles.addBtn}>
          <Plus size={18} color={Colors.white} />
          <Text style={styles.addBtnText}>Thêm nhân viên mới</Text>
        </TouchableOpacity>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <BriefcaseBusiness size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryValue}>24</Text>
              <Text style={styles.summaryText}>Tổng số nhân sự</Text>
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Đang làm việc</Text>
              <Text style={styles.progressMeta}>18 người</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '78%', backgroundColor: '#27C36A' }]} />
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Đang nghỉ</Text>
              <Text style={styles.progressMeta}>06 người</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '28%', backgroundColor: '#E6A52D' }]} />
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {STAFF_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {STAFF.map((item) => (
          <TouchableOpacity key={item.id} style={styles.staffCard}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.staffName}>{item.name}</Text>
              <Text style={styles.staffRole}>{item.role}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.dot, { backgroundColor: item.status === 'online' ? '#27C36A' : '#BFC3CE' }]} />
                <Text style={styles.metaText}>{item.status === 'online' ? 'Đang trực' : 'Nghỉ ca'}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}
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
  title: { fontSize: 30, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 8, marginBottom: 18 },
  addBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 18 },
  addBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700', marginLeft: 8 },
  summaryCard: { backgroundColor: '#FCEAE6', borderRadius: 24, padding: 18, marginBottom: 18 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  summaryIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFD8CF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  summaryValue: { fontSize: 28, fontWeight: '900', color: Colors.text },
  summaryText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  progressBlock: { marginTop: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  progressMeta: { fontSize: 12, color: Colors.textSecondary },
  progressTrack: { height: 8, borderRadius: 8, backgroundColor: Colors.white, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  filterChip: { backgroundColor: '#F7E6E1', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  staffCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  avatar: { width: 52, height: 52, borderRadius: 14, marginRight: 12 },
  staffName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  staffRole: { fontSize: 12, color: Colors.primary, marginTop: 3, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  separator: { fontSize: 12, color: Colors.textSecondary, marginHorizontal: 6 },
});

export default StaffManagementScreen;
