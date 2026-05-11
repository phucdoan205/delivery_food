const Order = require('../models/Order');
const Shop = require('../models/Shop');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createOrder = async (req, res) => {
  try {
    const { shop, items, deliveryAddress, phone, totalAmount } = req.body;

    const shopData = await Shop.findById(shop);
    if (!shopData || !shopData.isApproved) {
      return errorResponse(res, 'Cửa hàng không hợp lệ', 400);
    }

    // Tính chiết khấu cho app
    const platformFee = Math.round(totalAmount * (shopData.commissionRate / 100));
    const shopAmount = totalAmount - platformFee;

    const order = await Order.create({
      customer: req.user.id,
      shop,
      items,
      totalAmount,
      platformFee,
      shopAmount,
      deliveryAddress,
      phone,
      status: 'pending'
    });

    successResponse(res, 'Đặt hàng thành công', { order }, 201);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('shop', 'name')
      .sort({ createdAt: -1 });
    
    successResponse(res, 'Lấy danh sách đơn hàng thành công', { orders });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return errorResponse(res, 'Không tìm thấy cửa hàng', 404);

    const orders = await Order.find({ shop: shop._id })
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });

    successResponse(res, 'Lấy đơn hàng của cửa hàng thành công', { orders });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const shop = await Shop.findOne({ owner: req.user.id });
    
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      { status },
      { new: true }
    );

    if (!order) return errorResponse(res, 'Không tìm thấy đơn hàng', 404);

    successResponse(res, 'Cập nhật trạng thái đơn hàng thành công', { order });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus
};