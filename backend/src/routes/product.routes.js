const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createProduct,
  getProductsByShop,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const { protect } = require('../middleware/auth');

router.post('/', protect, upload.array('images', 5), createProduct);
router.get('/', getAllProducts);
router.get('/shop/:shopId', getProductsByShop);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;