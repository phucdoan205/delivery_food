const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  platformFee: Number,           // Chiết khấu cho app
  shopAmount: Number,            // Tiền shop nhận
  deliveryAddress: String,
  phone: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['cash', 'online'], default: 'cash' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);