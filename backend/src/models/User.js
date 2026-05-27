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
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
