const express = require('express')
const router = express.Router()
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
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
router.route('/:id')
  .get(getRestaurantById)
  .put(protect, authorize('merchant', 'admin'), updateRestaurant)
  .delete(protect, authorize('admin'), deleteRestaurant)

module.exports = router
