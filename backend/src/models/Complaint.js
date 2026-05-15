const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Complaint', complaintSchema)
