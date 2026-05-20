import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dolpobdpw/image/upload';
const UPLOAD_PRESET = 'reactnative';

export const pickAndUploadImage = async () => {
  try {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      throw new Error('Bạn cần cấp quyền truy cập thư viện ảnh để tải ảnh lên!');
    }

    // Pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected line
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const imageUri = result.assets[0].uri;

    // Create form data for upload
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Lỗi tải ảnh lên Cloudinary');
    }
  } catch (error) {
    console.error('Error in pickAndUploadImage:', error);
    throw error;
  }
};
