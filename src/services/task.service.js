const httpStatus = require('http-status').default;
const { Task, Project, User } = require('../models');
const ApiError = require('../utils/ApiError');

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

  return Task.create(taskBody);
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

  Object.assign(task, updateBody);

  await task.save();

  return task;
};


const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  await task.deleteOne();

  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};