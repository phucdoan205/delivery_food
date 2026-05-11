const Shop = require('../models/Shop');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    
    successResponse(res, 'Lấy danh sách cửa hàng thành công', { shops });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const approveShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { commissionRate } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { 
        isApproved: true,
        commissionRate: commissionRate || process.env.DEFAULT_PLATFORM_COMMISSION 
      },
      { new: true }
    ).populate('owner', 'name email');

    if (!shop) return errorResponse(res, 'Không tìm thấy cửa hàng', 404);

    successResponse(res, 'Duyệt cửa hàng thành công', { shop });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const updateGlobalCommission = async (req, res) => {
  try {
    const { defaultCommission } = req.body;
    
    // Cập nhật commission mặc định cho tất cả shop chưa duyệt hoặc có commission mặc định
    const result = await Shop.updateMany(
      { isApproved: false },
      { commissionRate: defaultCommission }
    );

    successResponse(res, 'Cập nhật chiết khấu toàn cục thành công', { 
      updatedCount: result.modifiedCount,
      newDefault: defaultCommission 
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalShops = await Shop.countDocuments();
    const approvedShops = await Shop.countDocuments({ isApproved: true });
    const totalUsers = await User.countDocuments();
    const totalOrders = await require('../models/Order').countDocuments();

    successResponse(res, 'Lấy thống kê dashboard thành công', {
      totalShops,
      approvedShops,
      totalUsers,
      totalOrders
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAllShops,
  approveShop,
  updateGlobalCommission,
  getDashboardStats
};