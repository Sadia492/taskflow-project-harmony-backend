const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status').default;
const ApiResponse = require('../utils/ApiResponse');
const activityService = require('../services/activity.service');

const getActivities = catchAsync(async (req, res) => {
  const data = await activityService.getActivities();

  res.send(new ApiResponse(httpStatus.OK, data, 'Recent activities'));
});

module.exports = { getActivities };