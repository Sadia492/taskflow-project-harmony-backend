const httpStatus = require('http-status').default;
const { Task, Project, User } = require('../models');
const ApiError = require('../utils/ApiError');
const Activity = require('../models/activity.model');
const notificationService = require('./notification.service');




const createTask = async (taskBody) => {
  const project = await Project.findById(taskBody.project).populate('members');

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  // ✅ validate assigned user belongs to project
  if (taskBody.assignedTo) {
    const isMember = project.members.some(
      (m) => m._id.toString() === taskBody.assignedTo
    );

    const isCreator =
      project.createdBy.toString() === taskBody.assignedTo;

    if (!isMember && !isCreator) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'User is not part of this project'
      );
    }
  }

  // ✅ duplicate task check
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

  // ✅ deadline validation
  if (new Date(taskBody.dueDate) < new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please select a valid deadline'
    );
  }

  const task = await Task.create(taskBody);

  // ✅ notification
  if (task.assignedTo) {
    await notificationService.createNotification({
      user: task.assignedTo,
      message: `New task assigned: "${task.title}"`,
      type: 'TASK',
    });
  }

  // ✅ activity log
  await Activity.create({
    action: 'TASK_CREATED',
    description: `Task "${task.title}" created`,
    user: taskBody.createdBy,
    project: task.project,
    task: task._id,
  });

  return task;
};


const queryTasks = async (user, query = {}) => {
  let filter = {};
  const role = user ? user.role : null;

  // ADMIN → sees everything
  if (role === 'admin') {
    filter = {};
  }

  // PROJECT MANAGER (member-based system)
  else if (role === 'projectManager') {
    const projects = await Project.find({
      members: { $in: [user.id] }
    }).select('_id');

    const projectIds = projects.map(p => p._id);

    filter = {
      project: { $in: projectIds }
    };
  }

  // TEAM MEMBER → only assigned tasks
  else if (role === 'teamMember') {
    filter = {
      assignedTo: user.id
    };
  }

  // apply extra filters safely (search, status, priority)
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.project) filter.project = query.project;

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

  const project = await Project.findById(task.project).populate('members');

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  // ==============================
  // 1. ASSIGNMENT VALIDATION FIRST
  // ==============================
  if (updateBody.assignedTo) {
    const isMember = project.members.some(
      (m) => m._id.toString() === updateBody.assignedTo
    );

    const isCreator =
      project.createdBy.toString() === updateBody.assignedTo;

    if (!isMember && !isCreator) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'User is not part of this project'
      );
    }
  }

  // ==============================
  // 2. COMPLETED TASK RULE
  // ==============================
  if (task.status === 'completed' && updateBody.assignedTo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Completed tasks cannot be reassigned'
    );
  }

  // ==============================
  // 3. DEADLINE VALIDATION
  // ==============================
  if (updateBody.dueDate) {
    if (new Date(updateBody.dueDate) < new Date()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please select a valid deadline'
      );
    }
  }

  // ==============================
  // 4. DUPLICATE TITLE CHECK
  // ==============================
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

  // ==============================
  // 5. STATUS CHANGE TRACKING
  // ==============================
  const statusChanged =
    updateBody.status && updateBody.status !== task.status;

  if (statusChanged) {
    await Activity.create({
      action: 'TASK_STATUS_CHANGED',
      description: `Task "${task.title}" moved to ${updateBody.status}`,
      user: task.createdBy,
      project: task.project,
      task: task._id,
    });

    await notificationService.createNotification({
      user: task.createdBy,
      message: `Task "${task.title}" moved to ${updateBody.status}`,
      type: 'TASK',
    });
  }

  // ==============================
  // 6. ASSIGNMENT CHANGE NOTIFICATION
  // ==============================
  if (
    updateBody.assignedTo &&
    task.assignedTo &&
    updateBody.assignedTo !== task.assignedTo.toString()
  ) {
    await notificationService.createNotification({
      user: updateBody.assignedTo,
      message: `You were assigned task "${task.title}"`,
      type: 'TASK',
    });
  }

  // ==============================
  // 7. APPLY UPDATE SAFELY
  // ==============================
  Object.assign(task, updateBody);

  await task.save();

  // ==============================
  // 8. FINAL ACTIVITY LOG
  // ==============================
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