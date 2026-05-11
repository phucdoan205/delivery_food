const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return errorResponse(res, 'Bạn chưa có cửa hàng', 404);
    if (!shop.isApproved) return errorResponse(res, 'Cửa hàng chưa được duyệt', 403);

    const product = await Product.create({
      ...req.body,
      shop: shop._id,
      images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : []
    });

    successResponse(res, 'Tạo sản phẩm thành công', { product }, 201);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const products = await Product.find({ shop: shopId, isAvailable: true })
      .populate('category', 'name');

    successResponse(res, 'Lấy danh sách sản phẩm thành công', { products });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .populate('shop', 'name address')
      .populate('category', 'name');

    successResponse(res, 'Lấy tất cả sản phẩm thành công', { products });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return errorResponse(res, 'Không tìm thấy cửa hàng', 404);

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      req.body,
      { new: true }
    );

    if (!product) return errorResponse(res, 'Không tìm thấy sản phẩm', 404);

    successResponse(res, 'Cập nhật sản phẩm thành công', { product });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return errorResponse(res, 'Không tìm thấy cửa hàng', 404);

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      shop: shop._id
    });

    if (!product) return errorResponse(res, 'Không tìm thấy sản phẩm', 404);

    successResponse(res, 'Xóa sản phẩm thành công');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createProduct,
  getProductsByShop,
  getAllProducts,
  updateProduct,
  deleteProduct
};