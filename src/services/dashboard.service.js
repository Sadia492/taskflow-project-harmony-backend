const { Project, Task } = require('../models');

const getStats = async (user) => {
  let projectFilter = {};
  let taskFilter = {};

  // ADMIN
  if (user.role === 'admin') {
    projectFilter = {};
    taskFilter = {};
  }

  // PROJECT MANAGER
  else if (user.role === 'projectManager') {
    const projects = await Project.find({
      members: { $in: [user.id] }
    }).select('_id');

    const projectIds = projects.map(p => p._id);

    projectFilter = { _id: { $in: projectIds } };
    taskFilter = { project: { $in: projectIds } };
  }

  // TEAM MEMBER
  else {
    projectFilter = { members: user.id };
    taskFilter = { assignedTo: user.id };
  }

  const totalProjects = await Project.countDocuments(projectFilter);
  const totalTasks = await Task.countDocuments(taskFilter);

  const completedTasks = await Task.countDocuments({
    ...taskFilter,
    status: 'completed',
  });

  const pendingTasks = await Task.countDocuments({
    ...taskFilter,
    status: { $ne: 'completed' },
  });

  const overdueTasks = await Task.countDocuments({
    ...taskFilter,
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

const getWorkload = async (user) => {
  let match = {};

  if (user.role === 'admin') {
    match = {};
  }

  else if (user.role === 'projectManager') {
    const projects = await Project.find({
      members: user.id
    }).select('_id');

    match = {
      project: { $in: projects.map(p => p._id) }
    };
  }

  else {
    match = {
      assignedTo: user.id
    };
  }

  return Task.aggregate([
    { $match: match },
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



const getProjectProgress = async (user) => {
  let match = {};

  if (user.role === 'admin') {
    match = {};
  }

  else if (user.role === 'projectManager') {
    const projects = await Project.find({
      members: user.id
    }).select('_id');

    match = {
      project: { $in: projects.map(p => p._id) }
    };
  }

  else {
    match = {
      assignedTo: user.id
    };
  }

  return Task.aggregate([
    { $match: match },
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