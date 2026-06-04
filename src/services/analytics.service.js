const { Task } = require('../models');

const getTaskStatus = async () => {
  return Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
};

const getTaskPriority = async () => {
  return Task.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);
};

module.exports = {
  getTaskStatus,
  getTaskPriority,
};