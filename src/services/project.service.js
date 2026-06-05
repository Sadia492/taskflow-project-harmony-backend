const httpStatus = require('http-status').default;
const { Project, User } = require('../models');
const ApiError = require('../utils/ApiError');
const Activity = require('../models/activity.model');
const notificationService = require('./notification.service');



const createProject = async (projectBody) => {
const project = await Project.create(projectBody);
await notificationService.createNotification({
  user: projectBody.createdBy,
  message: `Project "${project.name}" created successfully`,
  type: 'PROJECT',
});

await Activity.create({
  action: 'PROJECT_CREATED',
  description: `Project "${project.name}" created`,
  user: projectBody.createdBy,
  project: project._id,
});

return project;
};

const queryProjects = async (filter) => {
  return Project.find(filter)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');
};

const getProjectById = async (projectId) => {
  return Project.findById(projectId)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');
};

const updateProjectById = async (projectId, updateBody) => {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  Object.assign(project, updateBody);

  await project.save();

  await notificationService.createNotification({
  user: project.createdBy,
  message: `Project "${project.name}" was updated`,
  type: 'PROJECT',
});

  await Activity.create({
  action: 'PROJECT_UPDATED',
  description: `Project "${project.name}" updated`,
  user: project.createdBy,
  project: project._id,
});

  return project;
};

const deleteProjectById = async (projectId) => {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  await project.deleteOne();

  await Activity.create({
  action: 'PROJECT_DELETED',
  description: `Project "${project.name}" deleted`,
  user: project.createdBy,
  project: project._id,
});

  return project;
};

const addMemberToProject = async (projectId, userId) => {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const alreadyExists = project.members.some(
    (member) => member._id.toString() === userId
  );

  if (alreadyExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists in project');
  }

  project.members.push(userId);

  await project.save();

  await notificationService.createNotification({
  user: userId,
  message: `You were added to project "${project.name}"`,
  type: 'PROJECT',
});

  await Activity.create({
  action: 'PROJECT_MEMBER_ADDED',
  description: `User added to project "${project.name}"`,
  user: userId,
  project: project._id,
});

  return project;
};

const removeMemberFromProject = async (projectId, userId) => {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  project.members = project.members.filter(
    (member) => member._id.toString() !== userId
  );

  await project.save();

  await notificationService.createNotification({
  user: userId,
  message: `You were removed from project "${project.name}"`,
  type: 'PROJECT',
});
  await Activity.create({
  action: 'PROJECT_MEMBER_REMOVED',
  description: `User removed from project "${project.name}"`,
  user: userId,
  project: project._id,
});

  return project;
};

module.exports = {
  createProject,
  queryProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  addMemberToProject,
  removeMemberFromProject,
};