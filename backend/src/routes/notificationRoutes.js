const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
