const Food = require('../models/Food')
const Category = require('../models/Category')
const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const { uploadImageBase64 } = require('../utils/cloudinary')


// --- FOOD CONTROLLERS ---

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  const query = {};
  if (req.query.restaurantId) {
    query.restaurantId = req.query.restaurantId;
  }
  if (req.query.categoryId) {
    query.categoryId = req.query.categoryId;
  }
  const foods = await Food.find(query).populate('restaurantId').populate('categoryId')
  res.json(foods)
}

// @desc    Get all foods for a restaurant
// @route   GET /api/foods/restaurant/:restaurantId
// @access  Public
const getFoodsByRestaurant = async (req, res) => {
  const foods = await Food.find({ restaurantId: req.params.restaurantId }).populate('categoryId')
  res.json(foods)
}

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Merchant
const createFood = async (req, res) => {
  const { restaurantId, categoryId, name, description, image, price } = req.body

  if (req.user.role !== 'admin') {
    if (req.user.role === 'merchant') {
      const restaurant = await Restaurant.findById(restaurantId)
      if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' })
      }
    } else if (req.user.role === 'staff') {
      if (req.user.restaurantId.toString() !== restaurantId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' })
      }
    }
  }

  let imageUrl = image;
  if (image) {
    try {
      imageUrl = await uploadImageBase64(image);
    } catch (error) {
      return res.status(400).json({ message: 'Lỗi khi upload ảnh' });
    }
  }

  const food = new Food({
    restaurantId,
    categoryId,
    name,
    description,
    image: imageUrl,
    price
  })

  const createdFood = await food.save()
  
  const io = req.app.get('io');
  if (io) {
    io.emit('food_status_updated', {
      restaurantId,
      food: createdFood
    });
  }

  res.status(201).json(createdFood)
}

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Merchant
const updateFood = async (req, res) => {
  const { name, description, image, price, isAvailable } = req.body

  const food = await Food.findById(req.params.id)

  if (food) {
    if (req.user.role !== 'admin') {
      if (req.user.role === 'merchant') {
        const restaurant = await Restaurant.findById(food.restaurantId)
        if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Unauthorized' })
        }
      } else if (req.user.role === 'staff') {
        if (req.user.restaurantId.toString() !== food.restaurantId.toString()) {
          return res.status(403).json({ message: 'Unauthorized' })
        }
      }
    }

    food.name = name || food.name
    food.description = description || food.description
    food.price = price || food.price
    food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable
    
    if (image) {
      try {
        food.image = await uploadImageBase64(image)
      } catch (error) {
        return res.status(400).json({ message: 'Lỗi khi upload ảnh' })
      }
    }

    const updatedFood = await food.save()

    const io = req.app.get('io');
    if (io) {
      io.emit('food_status_updated', {
        restaurantId: updatedFood.restaurantId,
        food: updatedFood
      });
    }

    res.json(updatedFood)
  } else {
    res.status(404).json({ message: 'Food not found' })
  }
}

// --- CATEGORY CONTROLLERS ---

// @desc    Get all categories
// @route   GET /api/foods/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({})
  res.json(categories)
}

// @desc    Create a category
// @route   POST /api/foods/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, image } = req.body

  let imageUrl = image;
  if (image) {
    try {
      imageUrl = await uploadImageBase64(image);
    } catch (error) {
      return res.status(400).json({ message: 'Lỗi khi upload ảnh' });
    }
  }

  const category = new Category({
    name,
    image: imageUrl
  })

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
}

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Merchant/Admin
const deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.id)

  if (food) {
    await food.deleteOne()
    res.json({ message: 'Food item removed' })
  } else {
    res.status(404).json({ message: 'Food not found' })
  }
}

// @desc    Increment food view
// @route   PUT /api/foods/:id/view
// @access  Public
const incrementViewCount = async (req, res) => {
  const food = await Food.findById(req.params.id)
  if (food) {
    food.views += 1
    await food.save()
    
    const io = req.app.get('io');
    if (io) {
      io.emit('food_status_updated', {
        restaurantId: food.restaurantId,
        food: food
      });
    }
    
    res.json({ views: food.views })
  } else {
    res.status(404).json({ message: 'Food not found' })
  }
}

// @desc    Toggle like for food
// @route   POST /api/foods/:id/like
// @access  Private
const toggleLikeFood = async (req, res) => {
  const food = await Food.findById(req.params.id)
  const user = await User.findById(req.user._id)

  if (food && user) {
    const isLiked = user.likedFoods.includes(food._id)
    if (isLiked) {
      user.likedFoods = user.likedFoods.filter(id => id.toString() !== food._id.toString())
      food.likes = Math.max(0, food.likes - 1)
    } else {
      user.likedFoods.push(food._id)
      food.likes += 1
      if (food.restaurantId && !user.favoriteRestaurants.includes(food.restaurantId)) {
        user.favoriteRestaurants.push(food.restaurantId)
      }
    }
    await user.save()
    await food.save()
    
    const io = req.app.get('io');
    if (io) {
      io.emit('food_status_updated', {
        restaurantId: food.restaurantId,
        food: food
      });
    }
    
    res.json({ likes: food.likes, isLiked: !isLiked })
  } else {
    res.status(404).json({ message: 'Food or User not found' })
  }
}

module.exports = {
  getFoods,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  createCategory,
  incrementViewCount,
  toggleLikeFood
}
