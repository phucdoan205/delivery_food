const Notification = require('../models/Notification');

/**
 * Creates a notification in the database and emits via socket.io
 * @param {Object} io - the socket.io instance
 * @param {String} userId - the ID of the user (or 'admin' for global admin notifications)
 * @param {String} title - notification title
 * @param {String} message - notification message
 */
const sendNotification = async (io, userId, title, message) => {
  try {
    let notifData = { title, message };
    if (userId !== 'admin') {
      notifData.userId = userId;
    }
    
    // Save to DB
    const notif = await Notification.create(notifData);
    
    // Emit to room (userId or 'admin')
    if (io) {
      io.to(userId.toString()).emit('new_notification', notif);
    }
  } catch (error) {
    console.log('Error sending notification:', error);
  }
};

module.exports = { sendNotification };
