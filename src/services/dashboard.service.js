const { Project, Task } = require('../models');

const getStats = async () => {
  const totalProjects = await Project.countDocuments();
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const pendingTasks = await Task.countDocuments({ status: { $ne: 'completed' } });

  const overdueTasks = await Task.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  });

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
  };
};

const getWorkload = async () => {
  return Task.aggregate([
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
        pendingTasks: {
          $sum: {
            $cond: [{ $ne: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },
  ]);
};

const getProjectProgress = async () => {
  return Task.aggregate([
    {
      $group: {
        _id: '$project',
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project',
      },
    },
    { $unwind: '$project' },
    {
      $project: {
        project: '$project.name',
        progress: {
          $multiply: [{ $divide: ['$completed', '$total'] }, 100],
        },
      },
    },
  ]);
};

module.exports = {
  getStats,
  getWorkload,
  getProjectProgress,
};