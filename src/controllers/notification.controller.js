const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const getUserNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user.id);
  res.send(new ApiResponse(httpStatus.OK, notifications, 'Notifications retrieved successfully'));
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.notificationId);
  res.send(new ApiResponse(httpStatus.OK, notification, 'Notification marked as read'));
});

module.exports = {
  getUserNotifications,
  markAsRead,
};
