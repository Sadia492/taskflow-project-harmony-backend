const Activity = require('../models/activity.model');

const createActivity = async (data) => {
  return Activity.create(data);
};

const getActivities = async () => {
  return Activity.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name')
    .populate('project', 'name')
    .populate('task', 'title');
};

module.exports = {
  createActivity,
  getActivities,
};