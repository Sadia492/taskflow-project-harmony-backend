const httpStatus = require('http-status').default;
const { Project, User } = require('../models');
const ApiError = require('../utils/ApiError');

const createProject = async (projectBody) => {
    console.log(projectBody, "from service")
  return Project.create(projectBody);
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

  return project;
};

const deleteProjectById = async (projectId) => {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  await project.deleteOne();

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