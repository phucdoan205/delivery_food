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

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role: role || 'user'
  })

  if (user) {
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
      status: user.status
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
}

const updateUserStatus = async (req, res) => {
  const { status } = req.body
  const user = await User.findById(req.params.id)

  if (user) {
    user.status = status || user.status
    const updatedUser = await user.save()
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

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
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
