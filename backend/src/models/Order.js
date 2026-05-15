const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
      },
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'momo', 'zalopay']
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'delivering',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)
