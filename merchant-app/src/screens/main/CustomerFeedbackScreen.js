import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Star,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import {
  CUSTOMER_REVIEWS,
  REVIEW_SUMMARY,
} from "../../constants/profileMockData";

const FILTERS = ["Tất cả", "Đánh giá 5★", "Điểm 1-3★", "Chưa phản hồi"];

const CustomerFeedbackScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);

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
        <Text style={styles.title}>Phản hồi khách hàng</Text>
        <Text style={styles.subtitle}>
          Lắng nghe và tương tác để nâng cao chất lượng dịch vụ.
        </Text>

        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Trung bình</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingValue}>{REVIEW_SUMMARY.average}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Star key={item} size={14} color="#F5A623" fill="#F5A623" />
              ))}
            </View>
          </View>
          <Text style={styles.summaryHint}>Từ 468 đánh giá gần đây</Text>
        </View>

        <View style={[styles.metricCard, styles.positiveCard]}>
          <View>
            <Text style={styles.metricTitle}>Đánh giá tốt</Text>
            <Text style={styles.metricValue}>
              {REVIEW_SUMMARY.positiveCount}
            </Text>
            <Text style={styles.metricHint}>Khách hàng hài lòng</Text>
          </View>
          <ThumbsUp size={20} color="#12A150" />
        </View>

        <View style={[styles.metricCard, styles.negativeCard]}>
          <View>
            <Text style={styles.metricTitle}>Cần cải thiện</Text>
            <Text style={styles.metricValue}>
              {REVIEW_SUMMARY.negativeCount}
            </Text>
            <Text style={styles.metricHint}>Đánh giá có vấn đề mới</Text>
          </View>
          <ThumbsDown size={20} color="#D4494E" />
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {CUSTOMER_REVIEWS.map((item) => (
          <View
            key={item.id}
            style={[
              styles.reviewCard,
              item.needsAttention && styles.reviewCardAlert,
            ]}
          >
            <View style={styles.reviewHeader}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewerName}>{item.name}</Text>
                <View style={styles.reviewerMeta}>
                  <Text style={styles.reviewerTime}>{item.time}</Text>
                  <Text style={styles.reviewerDivider}>•</Text>
                  <View style={styles.inlineStars}>
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star
                        key={index}
                        size={12}
                        color="#F5A623"
                        fill="#F5A623"
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.commentText}>{item.comment}</Text>

            {item.reply ? (
              <View style={styles.replyBox}>
                <Text style={styles.replyLabel}>Phản hồi của quán</Text>
                <Text style={styles.replyText}>{item.reply}</Text>
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>Phản hồi ngay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  title: { fontSize: 30, fontWeight: "800", color: Colors.text },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 18,
  },
  summaryBlock: { marginBottom: 18 },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingValue: {
    fontSize: 42,
    fontWeight: "900",
    color: Colors.primary,
    marginRight: 10,
  },
  starsRow: { flexDirection: "row" },
  summaryHint: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  metricCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  positiveCard: { backgroundColor: "#DDF6E4" },
  negativeCard: { backgroundColor: "#FFE0E0" },
  metricTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  metricValue: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    marginTop: 4,
  },
  metricHint: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  filterChip: {
    backgroundColor: "#F7E6E1",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  reviewCardAlert: { borderLeftWidth: 4, borderLeftColor: "#F26B4F" },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  reviewerName: { fontSize: 15, fontWeight: "800", color: Colors.text },
  reviewerMeta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  reviewerTime: { fontSize: 12, color: Colors.textSecondary },
  reviewerDivider: { marginHorizontal: 6, color: Colors.textSecondary },
  inlineStars: { flexDirection: "row" },
  commentText: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  replyBox: {
    backgroundColor: "#FFF1EC",
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 6,
  },
  replyText: { fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
  actionRow: { flexDirection: "row", marginTop: 14 },
  primaryAction: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
  },
  primaryActionText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  secondaryAction: {
    backgroundColor: "#FFE8E2",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryActionText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
});

export default CustomerFeedbackScreen;
