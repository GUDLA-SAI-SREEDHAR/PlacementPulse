const Notification = require('../models/Notification');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

exports.getNotifications = async (req, res, next) => {
  try {
    let notifications = [];
    if (isMongoConnected()) {
      notifications = await Notification.find().sort({ createdAt: -1 });
    } else {
      notifications = inMemoryData.notifications;
    }
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      await Notification.updateMany({}, { $set: { isRead: true } });
    } else {
      inMemoryData.notifications.forEach((n) => (n.isRead = true));
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
