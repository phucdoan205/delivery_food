const express = require('express')
const router = express.Router()
const {
  getFoodsByRestaurant,
  createFood,
  updateFood,
  getCategories,
  createCategory
} = require('../controllers/foodController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Food menu and category management
 */

/**
 * @swagger
 * /api/foods/restaurant/{restaurantId}:
 *   get:
 *     summary: Get all food items for a specific restaurant
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of food items retrieved
 */
router.get('/restaurant/:restaurantId', getFoodsByRestaurant)

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Create a new food item
 *     tags: [Foods]
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
 *               - name
 *               - price
 *             properties:
 *               restaurantId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Food item created
 */
router.post('/', protect, authorize('merchant', 'admin'), createFood)

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: Update a food item
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Food item updated
 */
router.put('/:id', protect, authorize('merchant', 'admin'), updateFood)

/**
 * @swagger
 * /api/foods/categories:
 *   get:
 *     summary: Get all food categories
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: List of categories retrieved
 *   post:
 *     summary: Create a new food category
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.get('/categories', getCategories)
router.post('/categories', protect, authorize('admin'), createCategory)

module.exports = router
