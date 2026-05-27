const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  address: {
    type: String
  },
  image: {
    type: String
  },
  category: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isTemporarilyClosed: {
    type: Boolean,
    default: false
  },
  operatingHours: [{
    day: String,
    open: String,
    close: String,
    enabled: { type: Boolean, default: true }
  }],
  bankAccounts: [{
    bankName: String,
    accountNumber: String,
    accountHolder: String,
    isDefault: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
