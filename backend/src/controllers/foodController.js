const Food = require('../models/Food')
const Category = require('../models/Category')

// --- FOOD CONTROLLERS ---

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

  const food = new Food({
    restaurantId,
    categoryId,
    name,
    description,
    image,
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
    food.image = image || food.image
    food.price = price || food.price
    food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable

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

  const category = new Category({
    name,
    image
  })

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
}

module.exports = {
  getFoodsByRestaurant,
  createFood,
  updateFood,
  getCategories,
  createCategory
}
