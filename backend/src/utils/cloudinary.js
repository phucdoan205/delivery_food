const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a base64 image string to Cloudinary.
 * If the input is not a base64 string, it returns the input as is.
 * @param {string} imageBase64 - The image string (base64 or URL).
 * @returns {Promise<string>} - The secure URL of the uploaded image or the original string.
 */
const uploadImageBase64 = async (imageBase64) => {
  if (!imageBase64) return imageBase64;
  
  // Check if it's a base64 string
  if (imageBase64.startsWith('data:image')) {
    try {
      const result = await cloudinary.uploader.upload(imageBase64, {
        folder: 'food_delivery'
      });
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Image upload failed');
    }
  }
  
  // If it's already a URL or just a normal string, return as is
  return imageBase64;
};

module.exports = { uploadImageBase64 };
