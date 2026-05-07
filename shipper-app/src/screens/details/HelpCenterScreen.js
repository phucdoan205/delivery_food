import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const HelpCenterScreen = () => {
  const FAQItem = ({ question }) => (
    <TouchableOpacity style={styles.faqItem}>
      <Text style={styles.faqText}>{question}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Trung tâm trợ giúp" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchSection}>
           <Text style={styles.searchTitle}>Chúng tôi có thể giúp gì cho bạn?</Text>
           <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
              <TextInput 
                placeholder="Tìm kiếm giải pháp..." 
                placeholderTextColor={COLORS.textLight}
                style={styles.searchInput}
              />
           </View>
        </View>

        <View style={styles.supportCards}>
           <TouchableOpacity style={styles.supportCard}>
              <View style={[styles.cardIconBox, { backgroundColor: 'rgba(52, 152, 219, 0.1)' }]}>
                 <Ionicons name="chatbubbles-outline" size={24} color="#3498DB" />
              </View>
              <Text style={styles.cardLabel}>Chat với chúng tôi</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.supportCard}>
              <View style={[styles.cardIconBox, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
                 <Ionicons name="call-outline" size={24} color="#2ECC71" />
              </View>
              <Text style={styles.cardLabel}>Gọi tổng đài</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.section}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
              <TouchableOpacity>
                 <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
           </View>

           <View style={styles.faqList}>
              <FAQItem question="Làm thế nào để thay đổi số điện thoại?" />
              <FAQItem question="Tôi bị trừ tiền oan thì phải làm sao?" />
              <FAQItem question="Quy trình giao hàng cao cấp là gì?" />
              <FAQItem question="Làm sao để đăng ký thêm phương tiện?" />
              <FAQItem question="Tôi muốn tạm dừng hoạt động vài ngày?" />
           </View>
        </View>

        <View style={styles.communityCard}>
           <View style={styles.communityInfo}>
              <Text style={styles.communityTitle}>Cộng đồng Đối tác</Text>
              <Text style={styles.communityText}>Tham gia cộng đồng hơn 10.000 đối tác để chia sẻ kinh nghiệm.</Text>
              <TouchableOpacity style={styles.joinButton}>
                 <Text style={styles.joinButtonText}>Tham gia ngay</Text>
              </TouchableOpacity>
           </View>
           <View style={styles.communityIconBox}>
              <Ionicons name="people" size={60} color="rgba(255,255,255,0.15)" />
           </View>
        </View>

        <View style={styles.contactFooter}>
           <Text style={styles.footerLabel}>Bạn vẫn cần hỗ trợ?</Text>
           <Text style={styles.footerText}>Đội ngũ của chúng tôi luôn sẵn sàng 24/7</Text>
           <TouchableOpacity style={styles.emailButton}>
              <Ionicons name="mail-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.emailButtonText}>Gửi email cho chúng tôi</Text>
           </TouchableOpacity>
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
  searchSection: {
    marginBottom: SIZES.padding,
  },
  searchTitle: {
    ...FONTS.h2,
    fontSize: 24,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    ...FONTS.body3,
  },
  supportCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding * 1.5,
  },
  supportCard: {
    backgroundColor: COLORS.white,
    width: '48%',
    padding: SIZES.padding / 1.5,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    ...FONTS.h4,
    fontSize: 13,
    color: COLORS.text,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    ...FONTS.h3,
  },
  seeAll: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontSize: 12,
  },
  faqList: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: SIZES.base,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding / 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqText: {
    ...FONTS.body3,
    color: COLORS.text,
    flex: 1,
  },
  communityCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: SIZES.padding,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: SIZES.padding * 1.5,
  },
  communityInfo: {
    flex: 1,
    zIndex: 1,
  },
  communityTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    fontSize: 20,
  },
  communityText: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  joinButtonText: {
    ...FONTS.h4,
    color: COLORS.secondary,
    fontSize: 11,
  },
  communityIconBox: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  contactFooter: {
    alignItems: 'center',
    paddingBottom: SIZES.padding * 2,
  },
  footerLabel: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(211, 84, 0, 0.1)',
  },
  emailButtonText: {
    ...FONTS.h4,
    color: COLORS.secondary,
    marginLeft: 10,
  },
});

export default HelpCenterScreen;
