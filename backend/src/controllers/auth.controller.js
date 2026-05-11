const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer' } = req.body;

    // Kiểm tra input
    if (!name || !email || !password || !phone) {
      return errorResponse(res, 'Vui lòng điền đầy đủ thông tin', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'Email đã tồn tại trên hệ thống', 400);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role
    });

    const token = generateToken(user._id, user.role);

    // Trả về dữ liệu không bao gồm password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    };

    successResponse(res, 'Đăng ký tài khoản thành công', {
      user: userResponse,
      token
    }, 201);

  } catch (error) {
    console.error('Register error:', error);
    errorResponse(res, error.message || 'Đăng ký thất bại', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Vui lòng nhập email và mật khẩu', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    const token = generateToken(user._id, user.role);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    };

    successResponse(res, 'Đăng nhập thành công', { user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Đăng nhập thất bại', 500);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user) return errorResponse(res, 'Không tìm thấy người dùng', 404);
    
    successResponse(res, 'Lấy thông tin thành công', { user });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = {
  register,
  login,
  getMe
};