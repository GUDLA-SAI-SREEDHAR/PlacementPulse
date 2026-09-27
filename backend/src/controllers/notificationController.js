const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || req.query.student_id;

    const filter = {};
    if (studentId) {
      const num = Number(studentId);
      filter.$or = [
        { studentId: !isNaN(num) ? num : studentId },
        { studentId: null },
        { studentId: { $exists: false } },
      ];
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { title, message, type = 'INFO', studentId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ detail: 'Title and message are required' });
    }

    const notifObj = {
      id: `NOTIF-${Date.now()}`,
      studentId: studentId ? Number(studentId) : null,
      title,
      message,
      type,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
    };

    await Notification.create(notifObj);
    res.status(201).json(notifObj);
  } catch (error) {
    next(error);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({}, { $set: { isRead: true } });
    res.json({ message: 'All notifications marked as read', success: true });
  } catch (error) {
    next(error);
  }
};

exports.markOneRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { $or: [{ id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])] },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ detail: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification, success: true });
  } catch (error) {
    next(error);
  }
};
