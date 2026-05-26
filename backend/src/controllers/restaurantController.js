const Restaurant = require('../models/Restaurant')
const { uploadImageBase64 } = require('../utils/cloudinary')

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
  const { name, description, address, image, category } = req.body

  let imageUrl = image;
  if (image) {
    try {
      imageUrl = await uploadImageBase64(image);
    } catch (error) {
      return res.status(400).json({ message: 'Lỗi khi upload ảnh' });
    }
  }

  const restaurant = new Restaurant({
    ownerId: req.user._id,
    name,
    description,
    address,
    image: imageUrl,
    category,
    status: 'pending' // Needs admin approval
  })

  const createdRestaurant = await restaurant.save()
  res.status(201).json(createdRestaurant)
}

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Merchant
const updateRestaurant = async (req, res) => {
  const { name, description, address, image, status, category } = req.body

  const restaurant = await Restaurant.findById(req.params.id)

  if (restaurant) {
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' })
    }

    restaurant.name = name || restaurant.name
    restaurant.description = description || restaurant.description
    restaurant.address = address || restaurant.address
    restaurant.category = category || restaurant.category
    
    if (image) {
      try {
        restaurant.image = await uploadImageBase64(image)
      } catch (error) {
        return res.status(400).json({ message: 'Lỗi khi upload ảnh' })
      }
    }
    
    if (req.user.role === 'admin' && status) {
      restaurant.status = status
      
      // If approving or rejecting the restaurant, also update the owner's status
      if (status === 'approved' || status === 'rejected') {
        const User = require('../models/User');
        const owner = await User.findById(restaurant.ownerId);
        if (owner) {
          owner.status = status === 'approved' ? 'active' : 'banned';
          await owner.save();
        }
      }
    }

    const updatedRestaurant = await restaurant.save()

    const io = req.app.get('io');
    if (io) {
      io.emit('restaurant_updated');
    }

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

const getAllRestaurantsAdmin = async (req, res) => {
  const restaurants = await Restaurant.find({}).populate('ownerId', 'fullName email phone cccd')
  res.json(restaurants)
}

const getMyRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id }).populate('ownerId', 'fullName email phone cccd')
  if (restaurant) {
    res.json(restaurant)
  } else {
    res.status(404).json({ message: 'Restaurant not found' })
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  getMyRestaurant
}
