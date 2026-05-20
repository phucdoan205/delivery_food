import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Bell, ArrowLeft, Camera, Plus } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import { request } from "../../api/client";

const RestaurantInfoScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await request("/restaurants/mine");
        setRestaurant(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setAddress(data.address || "");
        setImage(data.image || "");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin cửa hàng");
        console.log("Error fetching restaurant mine:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const handleSave = async () => {
    if (!name || !description || !address) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin cửa hàng");
      return;
    }

    setSaving(true);
    try {
      await request(`/restaurants/${restaurant._id}`, {
        method: "PUT",
        body: {
          name,
          description,
          address,
          image: image || "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400",
        },
      });
      Alert.alert("Thành công", "Đã cập nhật thông tin cửa hàng");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể lưu thay đổi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerBrand}>Culinary Curator Merchant</Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Bell size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>CÀI ĐẶT HỆ THỐNG</Text>
        <Text style={styles.title}>Thông tin nhà hàng</Text>

        <View style={styles.imageSection}>
          <Image
            source={{ uri: image || "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400" }}
            style={styles.coverImage}
          />
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: image || "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400" }}
              style={styles.logoImage}
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Camera size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên nhà hàng</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mô tả ngắn (Editorial Style)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <Text style={styles.subSectionTitle}>Liên hệ & Địa điểm</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
          </View>

          {saving ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
              </TouchableOpacity>
              <CustomButton
                title="Lưu thay đổi"
                style={styles.saveBtn}
                onPress={handleSave}
              />
            </View>
          )}
        </View>
      </View>
      <View style={{ height: 100 }} />
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerBrand: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: { paddingHorizontal: 20, marginTop: 30 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 5,
    marginBottom: 20,
  },
  imageSection: {
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 60,
  },
  coverImage: { width: "100%", height: "100%", opacity: 0.8 },
  logoContainer: {
    position: "absolute",
    bottom: -40,
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoImage: { width: "100%", height: "100%", borderRadius: 45 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  formSection: { marginTop: 10 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    color: Colors.text,
  },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: "top" },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 10,
    marginBottom: 15,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 30 },
  tag: {
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary },
  addTagBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    marginBottom: 10,
  },
  addTagText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFEBE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cancelBtnText: { color: Colors.primary, fontSize: 16, fontWeight: "700" },
  saveBtn: { flex: 2 },
});

export default RestaurantInfoScreen;
