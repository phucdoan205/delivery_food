import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Bell, ArrowLeft, Camera, Plus } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { RESTAURANT_INFO } from '../../constants/mockData';
import CustomButton from '../../components/CustomButton';

const RestaurantInfoScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
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
          <Image source={{ uri: RESTAURANT_INFO.image }} style={styles.coverImage} />
          <View style={styles.logoContainer}>
            <Image source={{ uri: RESTAURANT_INFO.logo }} style={styles.logoImage} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Camera size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên nhà hàng</Text>
            <TextInput style={styles.input} value={RESTAURANT_INFO.name} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mô tả ngắn (Editorial Style)</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={RESTAURANT_INFO.description}
              multiline
              numberOfLines={4}
            />
          </View>

          <Text style={styles.subSectionTitle}>Liên hệ & Địa điểm</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput style={styles.input} value={RESTAURANT_INFO.phone} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput style={styles.input} value={RESTAURANT_INFO.address} />
          </View>

          <Text style={styles.subSectionTitle}>Danh mục ẩm thực</Text>
          <View style={styles.tagRow}>
            {RESTAURANT_INFO.categories.map((cat, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{cat}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addTagBtn}>
              <Text style={styles.addTagText}>+ THÊM</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
            </TouchableOpacity>
            <CustomButton title="Lưu thay đổi" style={styles.saveBtn} onPress={() => navigation.goBack()} />
          </View>
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F8' },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  headerBrand: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  content: { paddingHorizontal: 20, marginTop: 30 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginTop: 5, marginBottom: 20 },
  imageSection: { height: 200, borderRadius: 24, overflow: 'hidden', marginBottom: 60 },
  coverImage: { width: '100%', height: '100%', opacity: 0.8 },
  logoContainer: { position: 'absolute', bottom: -40, alignSelf: 'center', width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.white, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logoImage: { width: '100%', height: '100%', borderRadius: 45 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.white },
  formSection: { marginTop: 10 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 10 },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: Colors.border, fontSize: 14, color: Colors.text },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  subSectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginTop: 10, marginBottom: 15 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30 },
  tag: { backgroundColor: Colors.white, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, marginRight: 10, marginBottom: 10 },
  tagText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  addTagBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed', marginBottom: 10 },
  addTagText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  cancelBtn: { flex: 1, height: 56, borderRadius: 28, backgroundColor: '#FFEBE6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cancelBtnText: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  saveBtn: { flex: 2 }
});

export default RestaurantInfoScreen;
