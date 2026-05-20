import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dolpobdpw/image/upload';
const UPLOAD_PRESET = 'reactnative';

export const pickAndUploadImage = async (aspectRatio = [1, 1]) => {
  try {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      throw new Error('Bạn cần cấp quyền truy cập thư viện ảnh để tải ảnh lên!');
    }

    // Pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    
    const formData = new FormData();
    
    if (asset.base64) {
      const mimeType = asset.mimeType || 'image/jpeg';
      formData.append('file', `data:${mimeType};base64,${asset.base64}`);
    } else {
      formData.append('file', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: `upload_${Date.now()}.jpg`,
      });
    }
    
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
