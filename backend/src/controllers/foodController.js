const Food = require('../models/Food')
const Category = require('../models/Category')
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
  res.status(201).json(createdFood)
}

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Merchant
const updateFood = async (req, res) => {
  const { name, description, image, price, isAvailable } = req.body

  const food = await Food.findById(req.params.id)

  if (food) {
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

module.exports = {
  getFoods,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  createCategory
}
