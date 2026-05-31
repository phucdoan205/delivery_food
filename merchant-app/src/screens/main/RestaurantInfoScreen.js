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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ArrowLeft, Camera, Plus } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import CustomButton from "../../components/CustomButton";
import { request } from "../../api/client";
import * as ImagePicker from "expo-image-picker";

const RestaurantInfoScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [cccd, setCccd] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await request("/restaurants/mine");
        setRestaurant(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setAddress(data.address || "");
        setImage(data.image || "");
        setCategory(data.category || "");
        setCccd(data.ownerId?.cccd || "");
        setEmail(data.ownerId?.email || "");
        setPhone(data.ownerId?.phone || "");
        setOwnerName(data.ownerId?.fullName || "");
        setDob(data.ownerId?.dob || "");
        setNewPassword("");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin cửa hàng");
        console.log("Error fetching restaurant mine:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Quyền truy cập", "Cần cấp quyền truy cập thư viện ảnh!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const mimeType = result.assets[0].mimeType || 'image/jpeg';
      const base64Image = `data:${mimeType};base64,${result.assets[0].base64}`;
      setImage(base64Image);
    }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

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
          category,
          image: image || "https://via.placeholder.com/400",
        },
      });
      
      const profileBody = {
        fullName: ownerName,
        cccd,
        phone,
        dob,
      };
      
      if (newPassword.trim()) {
        profileBody.password = newPassword;
      }
      
      await request(`/auth/profile`, {
        method: "PUT",
        body: profileBody,
      });
      
      Alert.alert("Thành công", "Đã cập nhật thông tin nhà hàng và chủ sở hữu");
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
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerBrand}>{restaurant?.name || 'Đang tải...'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>CÀI ĐẶT HỆ THỐNG</Text>
        <Text style={styles.title}>Thông tin nhà hàng</Text>

        <View style={styles.imageSection}>
          <Image
            source={{ uri: image || "https://via.placeholder.com/400" }}
            style={styles.coverImage}
          />
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: image || "https://via.placeholder.com/400" }}
              style={styles.logoImage}
            />
            <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
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
            <Text style={styles.inputLabel}>Loại hình ẩm thực</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="VD: Ẩm thực truyền thống" />
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

          <Text style={styles.subSectionTitle}>Thông tin chủ sở hữu</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên chủ sở hữu</Text>
            <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email (Không thể thay đổi)</Text>
            <TextInput style={[styles.input, { backgroundColor: '#F5F5F5', color: '#888' }]} value={email} editable={false} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CCCD</Text>
            <TextInput style={styles.input} value={cccd} onChangeText={setCccd} keyboardType="numeric" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ngày thành lập</Text>
            <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="VD: 12/03/2022" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mật khẩu mới (Để trống nếu không đổi)</Text>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Nhập mật khẩu mới" secureTextEntry />
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
    marginBottom: 60,
  },
  coverImage: { width: "100%", height: "100%", opacity: 0.8, borderRadius: 24 },
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
