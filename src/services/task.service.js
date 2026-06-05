const httpStatus = require('http-status').default;
const { Task, Project, User } = require('../models');
const ApiError = require('../utils/ApiError');
const Activity = require('../models/activity.model');
const notificationService = require('./notification.service');




const createTask = async (taskBody) => {
  const project = await Project.findById(taskBody.project);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const duplicateTask = await Task.findOne({
    project: taskBody.project,
    title: taskBody.title,
  });

  if (duplicateTask) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This task already exists in the project'
    );
  }

  if (new Date(taskBody.dueDate) < new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please select a valid deadline'
    );
  }
const task = await Task.create(taskBody);

await notificationService.createNotification({
  user: task.assignedTo,
  message: `New task assigned: "${task.title}"`,
  type: 'TASK',
});

await Activity.create({
  action: 'TASK_CREATED',
  description: `Task "${task.title}" created`,
  user: taskBody.createdBy,
  project: task.project,
  task: task._id,
});

return task;
};


const queryTasks = async (filter) => {
  return Task.find(filter)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
};


const getTaskById = async (taskId) => {
  return Task.findById(taskId)
    .populate('project')
    .populate('assignedTo', 'name email');
};

const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (
    task.status === 'completed' &&
    updateBody.assignedTo
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Completed tasks cannot be reassigned'
    );
  }

  if (updateBody.dueDate) {
    if (new Date(updateBody.dueDate) < new Date()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please select a valid deadline'
      );
    }
  }

  if (updateBody.title) {
    const duplicate = await Task.findOne({
      project: task.project._id,
      title: updateBody.title,
      _id: { $ne: taskId },
    });

    if (duplicate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'This task already exists in the project'
      );
    }
  }
if (updateBody.status && updateBody.status !== task.status) {
  await Activity.create({
    action: 'TASK_STATUS_CHANGED',
    description: `Task "${task.title}" moved to ${updateBody.status}`,
    user: task.createdBy,
    project: task.project,
    task: task._id,
  });
}

if (updateBody.status && updateBody.status !== task.status) {
  await notificationService.createNotification({
    user: task.createdBy,
    message: `Task "${task.title}" moved to ${updateBody.status}`,
    type: 'TASK',
  });
}
if (updateBody.assignedTo && updateBody.assignedTo !== task.assignedTo.toString()) {
  await notificationService.createNotification({
    user: updateBody.assignedTo,
    message: `You were assigned task "${task.title}"`,
    type: 'TASK',
  });
}

  Object.assign(task, updateBody);

  await task.save();
  await Activity.create({
  action: 'TASK_UPDATED',
  description: `Task "${task.title}" updated`,
  user: task.createdBy,
  project: task.project,
  task: task._id,
});

  return task;
};


const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  await task.deleteOne();

  await notificationService.createNotification({
    user: task.createdBy,
    message: `Task "${task.title}" was deleted`,
    type: 'TASK',
  });

  await Activity.create({
  action: 'TASK_DELETED',
  description: `Task "${task.title}" deleted`,
  user: task.createdBy,
  project: task.project,
  task: task._id,
});

  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};