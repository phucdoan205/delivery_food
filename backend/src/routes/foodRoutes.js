const express = require('express')
const router = express.Router()
const {
  getFoods,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  createCategory,
  incrementViewCount,
  toggleLikeFood
} = require('../controllers/foodController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

router.get('/', getFoods)
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
router.post('/', protect, authorize('merchant', 'admin', 'staff'), createFood)

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
router.route('/:id')
  .put(protect, authorize('merchant', 'admin', 'staff'), updateFood)
  .delete(protect, authorize('merchant', 'admin', 'staff'), deleteFood)

router.put('/:id/view', incrementViewCount)
router.post('/:id/like', protect, toggleLikeFood)

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
router.post('/categories', protect, authorize('admin', 'merchant', 'staff'), createCategory)

module.exports = router
