const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status').default;
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analytics.service');

const getTaskStatus = catchAsync(async (req, res) => {
  const data = await analyticsService.getTaskStatus();
  res.send(new ApiResponse(httpStatus.OK, data));
});

const getTaskPriority = catchAsync(async (req, res) => {
  const data = await analyticsService.getTaskPriority();
  res.send(new ApiResponse(httpStatus.OK, data));
});

module.exports = {
  getTaskStatus,
  getTaskPriority,
};