const User = require('../models/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')
const { sendNotification } = require('../utils/notify')
const nodemailer = require('nodemailer')

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, password, phone, role, dob } = req.body

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
    status: userStatus,
    dob
  })

  if (user) {
    const io = req.app.get('io');
    if (io) {
      io.emit('new_user_registered');
      
      let msg = '';
      if (role === 'merchant') msg = `Có một cửa hàng mới (${fullName}) vừa đăng ký và đang chờ duyệt.`;
      else if (role === 'shipper') msg = `Có một tài xế mới (${fullName}) vừa đăng ký và đang chờ duyệt.`;
      else msg = `Người dùng mới (${fullName}) vừa tham gia hệ thống.`;
      
      await sendNotification(io, 'admin', 'Đăng ký mới', msg);
      
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
      restaurantId: user.restaurantId,
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
      addresses: user.addresses,
      bankAccounts: user.bankAccounts,
      cccd: user.cccd,
      dob: user.dob,
      status: user.status,
      restaurantId: user.restaurantId
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
        user.restaurantAddress = rest.address
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
    user.cccd = req.body.cccd || user.cccd
    user.dob = req.body.dob || user.dob

    if (req.body.addresses !== undefined) {
      user.addresses = req.body.addresses;
      const defaultAddr = user.addresses.find(a => a.isDefault);
      if (defaultAddr) {
        user.address = defaultAddr.address;
      } else if (user.addresses.length > 0) {
        // Nếu ko có default nào mà có địa chỉ, lấy cái đầu tiên làm default
        user.addresses[0].isDefault = true;
        user.address = user.addresses[0].address;
      }
    } else {
      user.address = req.body.address || user.address;
    }

    if (req.body.bankAccounts !== undefined) {
      user.bankAccounts = req.body.bankAccounts;
    }

    if (req.body.password) {
      if (user.role === 'admin') {
        if (!req.body.oldPassword) {
          return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu hiện tại' });
        }
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
        }
      } else if (req.body.oldPassword) {
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
        }
      }

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
      addresses: updatedUser.addresses,
      bankAccounts: updatedUser.bankAccounts,
      cccd: updatedUser.cccd,
      dob: updatedUser.dob,
      status: updatedUser.status
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

// @desc    Get user favorite restaurants
// @route   GET /api/auth/favorites
// @access  Private
const getFavoriteRestaurants = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favoriteRestaurants')
  if (user) {
    res.json(user.favoriteRestaurants)
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

// @desc    Forgot Password - Send OTP via Email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Vui lòng cung cấp email' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiry to 5 minutes from now
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã xác nhận khôi phục mật khẩu',
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn trong vòng 5 phút.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn' });
  } catch (error) {
    console.error('Email send error:', error);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();
    return res.status(500).json({ message: 'Không thể gửi email OTP, vui lòng thử lại sau.' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }

  if (!user.resetOtp || user.resetOtp !== otp) {
    return res.status(400).json({ message: 'Mã OTP không hợp lệ' });
  }

  if (Date.now() > user.resetOtpExpiry) {
    return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
  }

  res.status(200).json({ message: 'Xác nhận OTP thành công' });
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }

  if (!user.resetOtp || user.resetOtp !== otp) {
    return res.status(400).json({ message: 'Mã OTP không hợp lệ' });
  }

  if (Date.now() > user.resetOtpExpiry) {
    return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Clear OTP fields
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  
  await user.save();
  res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
  getFavoriteRestaurants,
  forgotPassword,
  verifyResetOtp,
  resetPassword
}
