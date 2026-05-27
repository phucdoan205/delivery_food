const express = require('express')
const router = express.Router()
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  getMyRestaurant,
  updateOperatingHours,
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getStaffByRestaurant,
  createStaff,
  updateStaff,
  toggleStaffStatus
} = require('../controllers/restaurantController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management and listing
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all approved restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants retrieved
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
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
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant created
 *       403:
 *         description: Not authorized
 */
router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('merchant', 'admin'), createRestaurant)

/**
 * @swagger
 * /api/restaurants/admin:
 *   get:
 *     summary: Get all restaurants (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all restaurants retrieved
 *       403:
 *         description: Not authorized
 */
router.route('/admin')
  .get(protect, authorize('admin'), getAllRestaurantsAdmin)

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant data retrieved
 *       404:
 *         description: Restaurant not found
 *   put:
 *     summary: Update a restaurant
 *     tags: [Restaurants]
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
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Restaurant updated
 *       403:
 *         description: Not authorized
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
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
 *         description: Restaurant deleted
 *       403:
 *         description: Not authorized (Admin only)
 */
router.get('/mine', protect, authorize('merchant', 'staff'), getMyRestaurant)

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, authorize('merchant', 'admin'), updateRestaurant)
  .delete(protect, authorize('admin'), deleteRestaurant)

router.put('/:id/operating-hours', protect, authorize('merchant', 'admin'), updateOperatingHours)

router.post('/:id/bank-accounts', protect, authorize('merchant'), addBankAccount)
router.put('/:id/bank-accounts/:accountId', protect, authorize('merchant'), updateBankAccount)
router.delete('/:id/bank-accounts/:accountId', protect, authorize('merchant'), deleteBankAccount)

// Staff management
router.route('/:id/staff')
  .get(protect, authorize('merchant'), getStaffByRestaurant)
  .post(protect, authorize('merchant'), createStaff)

router.put('/:id/staff/:staffId', protect, authorize('merchant'), updateStaff)
router.put('/:id/staff/:staffId/status', protect, authorize('merchant'), toggleStaffStatus)

module.exports = router
