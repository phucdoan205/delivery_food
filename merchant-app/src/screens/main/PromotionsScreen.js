import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ChevronLeft, Plus, Ticket, Users, Calendar, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { PROMOTIONS } from '../../constants/mockData';

const PromotionsScreen = ({ navigation }) => {
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
      <Text style={styles.promoDiscount}>Giảm {item.discount}</Text>
      
      <View style={styles.promoFooter}>
        <View style={styles.footerItem}>
          <Users size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>{item.usage} lượt dùng</Text>
        </View>
        <View style={styles.footerItem}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>Hết hạn: {item.expiry}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editBtnText}>Chi tiết</Text>
        <ChevronRight size={16} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

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
            <Text style={styles.statValue}>02</Text>
            <Text style={styles.statLabel}>Đang chạy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1.035</Text>
            <Text style={styles.statLabel}>Lượt dùng</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>+15%</Text>
            <Text style={styles.statLabel}>Tăng trưởng</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createBtn}>
          <Plus size={20} color={Colors.white} />
          <Text style={styles.createBtnText}>Tạo khuyến mãi mới</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Danh sách khuyến mãi</Text>
        
        <FlatList
          data={PROMOTIONS}
          renderItem={renderPromoCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />
      </View>
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
    marginRight: 5,
  },
  listPadding: {
    paddingBottom: 40,
  }
});

export default PromotionsScreen;
