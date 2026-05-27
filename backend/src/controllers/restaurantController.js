const Restaurant = require('../models/Restaurant')
const User = require('../models/User')
const { uploadImageBase64 } = require('../utils/cloudinary')
const bcrypt = require('bcryptjs')

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
  const restaurants = await Restaurant.find({}).populate('ownerId', 'fullName email phone cccd dob')
  res.json(restaurants)
}

const getMyRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id }).populate('ownerId', 'fullName email phone cccd dob')
  if (restaurant) {
    res.json(restaurant)
  } else {
    res.status(404).json({ message: 'Restaurant not found' })
  }
}

// @desc    Update operating hours and temporary closed status
// @route   PUT /api/restaurants/:id/operating-hours
// @access  Private/Merchant
const updateOperatingHours = async (req, res) => {
  const { operatingHours, isTemporarilyClosed } = req.body;
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    if (operatingHours !== undefined) restaurant.operatingHours = operatingHours;
    if (isTemporarilyClosed !== undefined) restaurant.isTemporarilyClosed = isTemporarilyClosed;

    const updatedRestaurant = await restaurant.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('restaurant_status_updated', {
        restaurantId: restaurant._id,
        isTemporarilyClosed: updatedRestaurant.isTemporarilyClosed,
        operatingHours: updatedRestaurant.operatingHours
      });
      io.emit('restaurant_updated');
    }

    res.json(updatedRestaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
}

// @desc    Add bank account
// @route   POST /api/restaurants/:id/bank-accounts
// @access  Private/Merchant
const addBankAccount = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  const newAccount = {
    bankName: req.body.bankName,
    accountNumber: req.body.accountNumber,
    accountHolder: req.body.accountHolder,
    isDefault: req.body.isDefault || false
  }

  if (newAccount.isDefault) {
    restaurant.bankAccounts.forEach(acc => acc.isDefault = false)
  }

  restaurant.bankAccounts.push(newAccount)
  await restaurant.save()
  res.status(201).json(restaurant)
}

// @desc    Update bank account
// @route   PUT /api/restaurants/:id/bank-accounts/:accountId
// @access  Private/Merchant
const updateBankAccount = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  const accountIndex = restaurant.bankAccounts.findIndex(acc => acc._id.toString() === req.params.accountId)
  if (accountIndex === -1) {
    return res.status(404).json({ message: 'Bank account not found' })
  }

  const { bankName, accountNumber, accountHolder, isDefault } = req.body
  
  if (isDefault) {
    restaurant.bankAccounts.forEach(acc => acc.isDefault = false)
  }

  if (bankName) restaurant.bankAccounts[accountIndex].bankName = bankName
  if (accountNumber) restaurant.bankAccounts[accountIndex].accountNumber = accountNumber
  if (accountHolder) restaurant.bankAccounts[accountIndex].accountHolder = accountHolder
  if (isDefault !== undefined) restaurant.bankAccounts[accountIndex].isDefault = isDefault

  await restaurant.save()
  res.json(restaurant)
}

// @desc    Delete bank account
// @route   DELETE /api/restaurants/:id/bank-accounts/:accountId
// @access  Private/Merchant
const deleteBankAccount = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  restaurant.bankAccounts = restaurant.bankAccounts.filter(acc => acc._id.toString() !== req.params.accountId)
  
  await restaurant.save()
  res.json(restaurant)
}

// @desc    Get staff for a restaurant
// @route   GET /api/restaurants/:id/staff
// @access  Private/Merchant
const getStaffByRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  const staff = await User.find({ restaurantId: req.params.id, role: 'staff' }).select('-password')
  res.json(staff)
}

// @desc    Create staff for a restaurant
// @route   POST /api/restaurants/:id/staff
// @access  Private/Merchant
const createStaff = async (req, res) => {
  const { fullName, email, password, phone, avatar } = req.body

  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: 'Email đã tồn tại' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  let avatarUrl = undefined;
  if (avatar) {
    try {
      avatarUrl = await uploadImageBase64(avatar);
    } catch (error) {
      return res.status(400).json({ message: 'Lỗi khi upload ảnh' });
    }
  }

  const staff = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    avatar: avatarUrl,
    role: 'staff',
    restaurantId: req.params.id
  })

  if (staff) {
    res.status(201).json({
      _id: staff._id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role
    })
  } else {
    res.status(400).json({ message: 'Invalid staff data' })
  }
}

// @desc    Toggle staff status
// @route   PUT /api/restaurants/:id/staff/:staffId/status
// @access  Private/Merchant
const toggleStaffStatus = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  const staff = await User.findOne({ _id: req.params.staffId, restaurantId: req.params.id, role: 'staff' })
  if (!staff) {
    return res.status(404).json({ message: 'Staff not found' })
  }

  staff.status = staff.status === 'banned' ? 'active' : 'banned'
  await staff.save()

  res.json({
    _id: staff._id,
    fullName: staff.fullName,
    status: staff.status
  })
}

// @desc    Update staff
// @route   PUT /api/restaurants/:id/staff/:staffId
// @access  Private/Merchant
const updateStaff = async (req, res) => {
  const { fullName, email, password, phone, avatar } = req.body

  const restaurant = await Restaurant.findById(req.params.id)
  if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Restaurant not found or unauthorized' })
  }

  const staff = await User.findOne({ _id: req.params.staffId, restaurantId: req.params.id, role: 'staff' })
  if (!staff) {
    return res.status(404).json({ message: 'Staff not found' })
  }

  if (email && email !== staff.email) {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }
    staff.email = email
  }

  if (fullName) staff.fullName = fullName
  if (phone !== undefined) staff.phone = phone

  if (password) {
    const salt = await bcrypt.genSalt(10)
    staff.password = await bcrypt.hash(password, salt)
  }

  if (avatar) {
    try {
      staff.avatar = await uploadImageBase64(avatar)
    } catch (e) {
      return res.status(400).json({ message: 'Lỗi khi upload ảnh' })
    }
  }

  await staff.save()
  res.json({
    _id: staff._id,
    fullName: staff.fullName,
    email: staff.email,
    role: staff.role
  })
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  getMyRestaurant,
  updateOperatingHours,
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getStaffByRestaurant,
  createStaff,
  updateStaff,
  toggleStaffStatus
}
