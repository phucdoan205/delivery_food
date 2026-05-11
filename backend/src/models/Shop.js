const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  phone: String,
  image: String,
  banner: String,
  isApproved: { type: Boolean, default: false },
  commissionRate: { type: Number, default: () => Number(process.env.DEFAULT_PLATFORM_COMMISSION) || 15 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);