import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, TextInput, Switch, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import { ChevronLeft, Camera, Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { request } from '../../api/client';
import * as ImagePicker from 'expo-image-picker';

const AddEditDishScreen = ({ navigation, route }) => {
  const { dish, restaurantId } = route.params || {};
  const isEdit = dish !== undefined;

  const [name, setName] = useState(dish?.name || '');
  const [price, setPrice] = useState(dish?.price?.toString() || '');
  const [description, setDescription] = useState(dish?.description || '');
  const [isAvailable, setIsAvailable] = useState(dish?.isAvailable !== false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(dish?.categoryId?._id || dish?.categoryId || null);
  const [imageUri, setImageUri] = useState(dish?.image || '');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await request('/foods/categories');
        setCategories(cats);
        if (!selectedCategory && cats.length > 0) {
          setSelectedCategory(cats[0]._id);
        }
      } catch (error) {
        console.log('Error loading categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!name || !price || !description) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin món ăn');
      return;
    }

    setLoading(true);
    try {
      const foodData = {
        name,
        price: parseFloat(price),
        description,
        isAvailable,
        categoryId: selectedCategory,
        restaurantId: restaurantId || dish?.restaurantId,
        image: imageUri || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400"
      };

      if (isEdit) {
        await request(`/foods/${dish._id}`, {
          method: 'PUT',
          body: foodData
        });
        Alert.alert('Thành công', 'Cập nhật món ăn thành công');
      } else {
        await request('/foods', {
          method: 'POST',
          body: foodData
        });
        Alert.alert('Thành công', 'Thêm món ăn mới thành công');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu món ăn, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa món ăn này ra khỏi thực đơn không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await request(`/foods/${dish._id}`, {
                method: 'DELETE'
              });
              Alert.alert('Thành công', 'Đã xóa món ăn');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Lỗi', error.message || 'Không thể xóa món ăn');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getCategoryName = () => {
    const found = categories.find(c => c._id === selectedCategory);
    return found ? found.name : 'Chọn danh mục';
  };

  const handlePickImage = async () => {
    try {
      setUploadingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const mimeType = result.assets[0].mimeType || 'image/jpeg';
        setImageUri(`data:${mimeType};base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }
    setIsCreatingCategory(true);
    try {
      const newCat = await request('/foods/categories', {
        method: 'POST',
        body: { name: newCategoryName.trim() }
      });
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat._id || newCat.id);
      setNewCategoryName('');
      setShowCategoryModal(false);
      Alert.alert('Thành công', 'Đã thêm danh mục mới');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo danh mục mới');
    } finally {
      setIsCreatingCategory(false);
    }
  };

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
        <TouchableOpacity style={styles.imageUpload} onPress={handlePickImage} disabled={uploadingImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.dishImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              {uploadingImage ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <>
                  <Camera size={32} color={Colors.textSecondary} />
                  <Text style={styles.uploadText}>Thêm hình ảnh món ăn</Text>
                </>
              )}
            </View>
          )}
          <View style={styles.editIcon}>
            {uploadingImage ? <ActivityIndicator size="small" color={Colors.white} /> : <Camera size={16} color={Colors.white} />}
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
              <TouchableOpacity 
                style={styles.categoryPicker}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.categoryText}>{getCategoryName()}</Text>
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

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <>
              <CustomButton
                title={isEdit ? "Cập nhật món ăn" : "Thêm vào thực đơn"}
                onPress={handleSave}
              />
              {isEdit && (
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <Trash2 size={20} color={Colors.error} />
                  <Text style={styles.deleteBtnText}>Xóa món ăn</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.modalClose}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryList}>
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat._id || cat.id} 
                  style={[styles.categoryOption, selectedCategory === (cat._id || cat.id) && styles.categoryOptionSelected]}
                  onPress={() => {
                    setSelectedCategory(cat._id || cat.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[styles.categoryOptionText, selectedCategory === (cat._id || cat.id) && styles.categoryOptionTextSelected]}>
                    {cat.name}
                  </Text>
                  {selectedCategory === (cat._id || cat.id) && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.newCategorySection}>
              <Text style={styles.newCategoryLabel}>Hoặc thêm danh mục mới</Text>
              <View style={styles.newCategoryInputRow}>
                <TextInput
                  style={styles.newCategoryInput}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Tên danh mục..."
                  placeholderTextColor={Colors.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.newCategoryBtn} 
                  onPress={handleCreateCategory}
                  disabled={isCreatingCategory}
                >
                  {isCreatingCategory ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.newCategoryBtnText}>Thêm</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  categoryList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryOptionSelected: {
    backgroundColor: '#FDEBE7',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  categoryOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  categoryOptionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  checkIcon: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  newCategorySection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
  },
  newCategoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  newCategoryInputRow: {
    flexDirection: 'row',
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newCategoryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  newCategoryBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default AddEditDishScreen;
