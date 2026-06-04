const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const httpStatus = require('http-status').default;
const dashboardService = require('../services/dashboard.service');

const getStats = catchAsync(async (req, res) => {
  const data = await dashboardService.getStats();

  res.send(new ApiResponse(httpStatus.OK, data, 'Dashboard stats'));
});

const getWorkload = catchAsync(async (req, res) => {
  const data = await dashboardService.getWorkload();

  res.send(new ApiResponse(httpStatus.OK, data, 'Workload summary'));
});

const getProjectProgress = catchAsync(async (req, res) => {
  const data = await dashboardService.getProjectProgress();

  res.send(new ApiResponse(httpStatus.OK, data, 'Project progress'));
});

module.exports = {
  getStats,
  getWorkload,
  getProjectProgress,
};