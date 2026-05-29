const Notification = require('../models/Notification');

// @desc    Get notifications for logged in user (or admin)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;
    
    // If admin, we get admin notifications (where userId is null)
    let query = { userId: req.user._id };
    if (req.user.role === 'admin') {
      // If the UI fetches /notifications?admin=true
      if (req.query.admin === 'true') {
        query = { userId: null };
      }
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    let query = { userId: req.user._id, isRead: false };
    if (req.user.role === 'admin' && req.query.admin === 'true') {
      query = { userId: null, isRead: false };
    }

    const count = await Notification.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    let query = { userId: req.user._id, isRead: false };
    if (req.user.role === 'admin' && req.query.admin === 'true') {
      query = { userId: null, isRead: false };
    }

    await Notification.updateMany(query, { isRead: true });
    res.json({ message: 'Marked all as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark one as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Optional: add authorization check
    if (notification.userId && notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
};
