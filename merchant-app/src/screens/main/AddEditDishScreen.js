import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { ChevronLeft, Camera, Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const AddEditDishScreen = ({ navigation, route }) => {
  const isEdit = route.params?.dish !== undefined;
  const dish = route.params?.dish;

  const [name, setName] = useState(dish?.name || '');
  const [price, setPrice] = useState(dish?.price?.toString() || '');
  const [description, setDescription] = useState(dish?.description || '');
  const [category, setCategory] = useState(dish?.category || 'Món chính');
  const [isAvailable, setIsAvailable] = useState(dish?.status === 'active' || true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Upload Area */}
        <TouchableOpacity style={styles.imageUpload}>
          {dish?.image ? (
            <Image source={{ uri: dish.image }} style={styles.dishImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Camera size={32} color={Colors.textSecondary} />
              <Text style={styles.uploadText}>Thêm hình ảnh món ăn</Text>
            </View>
          )}
          <View style={styles.editIcon}>
            <Camera size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Tên món ăn</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ví dụ: Phở Bò Wagyu"
            placeholderTextColor={Colors.textSecondary}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Giá bán (VND)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="120.000"
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>Danh mục</Text>
              <TouchableOpacity style={styles.categoryPicker}>
                <Text style={styles.categoryText}>{category}</Text>
                <ChevronRight size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Mô tả món ăn</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Mô tả ngắn về nguyên liệu, hương vị..."
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Availability Toggle */}
        <View style={styles.toggleSection}>
          <View>
            <Text style={styles.toggleTitle}>Đang phục vụ</Text>
            <Text style={styles.toggleSubTitle}>Bật để khách hàng có thể đặt món này</Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Options/Toppings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tùy chọn & Topping</Text>
            <TouchableOpacity style={styles.addOptionBtn}>
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addOptionText}>Thêm</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyOptions}>
            <Text style={styles.emptyOptionsText}>Chưa có tùy chọn nào cho món này</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isEdit ? "Cập nhật món ăn" : "Thêm vào thực đơn"}
            onPress={() => navigation.goBack()}
          />
          {isEdit && (
            <TouchableOpacity style={styles.deleteBtn}>
              <Trash2 size={20} color={Colors.error} />
              <Text style={styles.deleteBtnText}>Xóa món ăn</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  editIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 25,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  toggleSubTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
  emptyOptions: {
    backgroundColor: Colors.white,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyOptionsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
    marginLeft: 8,
  }
});

export default AddEditDishScreen;
