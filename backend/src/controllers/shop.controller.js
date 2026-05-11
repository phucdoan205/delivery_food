const Shop = require('../models/Shop');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createShop = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return errorResponse(res, 'Bạn đã có một cửa hàng', 400);
    }

    const shop = await Shop.create({
      owner: req.user.id,
      name,
      description,
      address,
      phone,
      isApproved: false // Cần admin duyệt
    });

    successResponse(res, 'Tạo cửa hàng thành công, đang chờ duyệt', { shop }, 201);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) {
      return errorResponse(res, 'Bạn chưa có cửa hàng nào', 404);
    }
    successResponse(res, 'Lấy thông tin cửa hàng thành công', { shop });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return errorResponse(res, 'Không tìm thấy cửa hàng', 404);

    const updatedShop = await Shop.findByIdAndUpdate(shop._id, req.body, { new: true });
    successResponse(res, 'Cập nhật cửa hàng thành công', { shop: updatedShop });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createShop,
  getMyShop,
  updateShop
};