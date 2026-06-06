const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { projectService } = require('../services');

const createProject = catchAsync(async (req, res) => {
    console.log(req.body)
  const project = await projectService.createProject({
    ...req.body,
    createdBy: req.user.id,
  });

  res
    .status(httpStatus.CREATED)
    .send(new ApiResponse(httpStatus.CREATED, project, 'Project created successfully'));
});

const getProjects = async (req, res) => {
  const user = req.user;

  const projects = await projectService.queryProjects(user);

  res.json({ data: projects });
};

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  res.send(
    new ApiResponse(httpStatus.OK, project, 'Project retrieved successfully')
  );
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(
    req.params.projectId,
    req.body
  );

  res.send(
    new ApiResponse(httpStatus.OK, project, 'Project updated successfully')
  );
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProjectById(req.params.projectId);

  res.status(httpStatus.NO_CONTENT).send();
});

const addMember = catchAsync(async (req, res) => {
  const project = await projectService.addMemberToProject(
    req.params.projectId,
    req.body.userId
  );

  res.send(
    new ApiResponse(httpStatus.OK, project, 'Member added successfully')
  );
});

const removeMember = catchAsync(async (req, res) => {
  const project = await projectService.removeMemberFromProject(
    req.params.projectId,
    req.params.userId
  );

  res.send(
    new ApiResponse(httpStatus.OK, project, 'Member removed successfully')
  );
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};