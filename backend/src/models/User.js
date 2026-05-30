const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  avatar: {
    type: String
  },
  address: {
    type: String
  },
  addresses: [{
    type: { type: String, default: 'Nhà riêng' },
    address: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  bankAccounts: [{
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  cccd: {
    type: String
  },
  dob: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'merchant', 'shipper', 'admin', 'staff'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'banned'],
    default: 'active'
  },
  favoriteRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  likedFoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }],
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  savedPromotions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion'
  }],
  resetOtp: {
    type: String
  },
  resetOtpExpiry: {
    type: Date
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
