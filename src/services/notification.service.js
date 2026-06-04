const Notification = require('../models/notification.model');

const createNotification = async (data) => {
  return Notification.create(data);
};

const getNotifications = async (userId) => {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
};

const markAsRead = async (id) => {
  return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};