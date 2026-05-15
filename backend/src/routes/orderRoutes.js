const express = require('express')
const router = express.Router()
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getMerchantOrders
} = require('../controllers/orderController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing and tracking
 */

router.use(protect)

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - items
 *               - totalPrice
 *             properties:
 *               restaurantId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *               deliveryAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, momo, zalopay]
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.route('/')
  .post(createOrder)

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged-in user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders retrieved
 */
router.get('/myorders', getMyOrders)

/**
 * @swagger
 * /api/orders/merchant/{restaurantId}:
 *   get:
 *     summary: Get all orders for a specific restaurant (Merchant only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of restaurant orders retrieved
 */
router.get('/merchant/:restaurantId', authorize('merchant', 'admin'), getMerchantOrders)

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved
 */
router.route('/:id')
  .get(getOrderById)

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, delivering, completed, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/:id/status', authorize('merchant', 'admin', 'shipper'), updateOrderStatus)

module.exports = router
