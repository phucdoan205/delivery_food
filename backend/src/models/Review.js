const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String
  },
  foodReviews: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    },
    isLiked: {
      type: Boolean // true for like/good, false for dislike/bad
    }
  }],
  reply: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema)
