const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  refreshToken: {
    type: String,
    default: null
  }
}, { timestamps: true });

// ====================== HASH PASSWORD ======================
userSchema.pre('save', async function () {
  // Chỉ hash nếu password bị thay đổi hoặc mới tạo
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Method so sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);