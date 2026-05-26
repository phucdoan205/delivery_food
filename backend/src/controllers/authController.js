const User = require('../models/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, password, phone, role } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const userStatus = (role === 'merchant' || role === 'shipper') ? 'pending' : 'active';

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role: role || 'user',
    status: userStatus
  })

  if (user) {
    const io = req.app.get('io');
    if (io) {
      io.emit('new_user_registered');
      
      if (userStatus === 'pending') {
        io.emit('new_registration_pending', {
          _id: user._id,
          fullName: user.fullName,
          role: user.role,
          email: user.email,
          createdAt: user.createdAt
        });
      }
    }
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } else {
    res.status(400).json({ message: 'Invalid user data' })
  }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Vui lòng chờ duyệt tài khoản' })
    }
    if (user.status === 'banned') {
      if (user.role === 'merchant' || user.role === 'shipper') {
        return res.status(403).json({ message: 'Tài khoản tạm thời bị khóa/tạm dừng hãy liên lạc người quản trị' })
      }
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khoá' })
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } else {
    res.status(401).json({ message: 'Invalid email or password' })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
      cccd: user.cccd,
      dob: user.dob,
      status: user.status
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password').lean()
  const Restaurant = require('../models/Restaurant')
  for (let user of users) {
    if (user.role === 'merchant') {
      const rest = await Restaurant.findOne({ ownerId: user._id }).lean()
      if (rest) {
        user.restaurantName = rest.name
        user.restaurantImage = rest.image
      }
    }
  }
  res.json(users)
}

const updateUserStatus = async (req, res) => {
  const { status } = req.body
  const user = await User.findById(req.params.id)

  if (user) {
    user.status = status || user.status
    const updatedUser = await user.save()

    const io = req.app.get('io');
    if (io) {
      io.emit('new_user_registered'); // emit to update admin dashboard realtime
    }
    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.fullName = req.body.fullName || user.fullName
    user.phone = req.body.phone || user.phone
    user.avatar = req.body.avatar || user.avatar
    user.address = req.body.address || user.address
    user.cccd = req.body.cccd || user.cccd
    user.dob = req.body.dob || user.dob

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await user.save()

    const io = req.app.get('io');
    if (io) {
      io.emit('new_user_registered');
      io.emit('user_profile_updated');
      if (user.role === 'merchant') {
        io.emit('restaurant_updated');
      }
    }

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      cccd: updatedUser.cccd,
      dob: updatedUser.dob,
      status: updatedUser.status
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus
}
