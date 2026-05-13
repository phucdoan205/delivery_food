import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  Search,
  MessageCircleMore,
  PhoneCall,
  Mail,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { SUPPORT_FAQS, SUPPORT_TOPICS } from "../../constants/profileMockData";

const ICONS = {
  "Chat Trực Tiếp": MessageCircleMore,
  "Gọi Yêu Cầu": PhoneCall,
  "Gửi Email Đối Tác": Mail,
};

const SupportHelpScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.brand}>Culinary Curator Merchant</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Bell size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Chào bạn, chúng tôi có thể giúp cho gian hàng của bạn?
          </Text>
          <View style={styles.searchBox}>
            <Search size={16} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm câu hỏi, chủ đề..."
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        {SUPPORT_TOPICS.map((item) => {
          const Icon = ICONS[item.title];
          return (
            <View key={item.id} style={styles.topicCard}>
              <View
                style={[styles.topicIcon, { backgroundColor: item.iconBg }]}
              >
                <Icon size={18} color={Colors.white} />
              </View>
              <Text style={styles.topicTitle}>{item.title}</Text>
              <Text style={styles.topicSubtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.topicBtn}>
                <Text style={styles.topicBtnText}>{item.action}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.faqHeader}>
          <Text style={styles.faqTitle}>Câu hỏi thường gặp</Text>
          <Text style={styles.faqLink}>Xem tất cả</Text>
        </View>

        {SUPPORT_FAQS.map((item) => (
          <View key={item.id} style={styles.faqCard}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            Kết nối trực tiếp với chuyên viên quản lý tài khoản
          </Text>
          <Text style={styles.bannerText}>
            Nếu gian hàng cần hỗ trợ ưu tiên, đội ngũ partner success luôn sẵn
            sàng đồng hành.
          </Text>
          <View style={styles.bannerActions}>
            <TouchableOpacity style={styles.bannerSecondary}>
              <Text style={styles.bannerSecondaryText}>Gọi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bannerPrimary}>
              <Text style={styles.bannerPrimaryText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  heroCard: {
    backgroundColor: "#FADFD8",
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 13, color: Colors.text },
  topicCard: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  topicTitle: { fontSize: 16, fontWeight: "800", color: Colors.text },
  topicSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  topicBtn: {
    backgroundColor: "#2E1408",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  topicBtnText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  faqTitle: { fontSize: 22, fontWeight: "900", color: Colors.text },
  faqLink: { fontSize: 13, color: Colors.primary, fontWeight: "700" },
  faqCard: {
    backgroundColor: "#FFF7F4",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F2E0DB",
    marginBottom: 12,
  },
  question: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  answer: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  banner: {
    backgroundColor: "#B6541D",
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  bannerTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    color: Colors.white,
  },
  bannerText: {
    fontSize: 12,
    color: "#F8DDD0",
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 18,
  },
  bannerActions: { flexDirection: "row" },
  bannerSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFDACE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bannerSecondaryText: { color: "#8C3C12", fontWeight: "700" },
  bannerPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerPrimaryText: { color: "#8C3C12", fontWeight: "700" },
});

export default SupportHelpScreen;
