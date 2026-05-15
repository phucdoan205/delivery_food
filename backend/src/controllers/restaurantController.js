const Restaurant = require('../models/Restaurant')

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({ status: 'approved' })
  res.json(restaurants)
}

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (restaurant) {
    res.json(restaurant)
  } else {
    res.status(404).json({ message: 'Restaurant not found' })
  }
}

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Merchant
const createRestaurant = async (req, res) => {
  const { name, description, address, image } = req.body

  const restaurant = new Restaurant({
    ownerId: req.user._id,
    name,
    description,
    address,
    image,
    status: 'pending' // Needs admin approval
  })

  const createdRestaurant = await restaurant.save()
  res.status(201).json(createdRestaurant)
}

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Merchant
const updateRestaurant = async (req, res) => {
  const { name, description, address, image, status } = req.body

  const restaurant = await Restaurant.findById(req.params.id)

  if (restaurant) {
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' })
    }

    restaurant.name = name || restaurant.name
    restaurant.description = description || restaurant.description
    restaurant.address = address || restaurant.address
    restaurant.image = image || restaurant.image
    
    if (req.user.role === 'admin' && status) {
      restaurant.status = status
    }

    const updatedRestaurant = await restaurant.save()
    res.json(updatedRestaurant)
  } else {
    res.status(404).json({ message: 'Restaurant not found' })
  }
}

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)

  if (restaurant) {
    await restaurant.deleteOne()
    res.json({ message: 'Restaurant removed' })
  } else {
    res.status(404).json({ message: 'Restaurant not found' })
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}
