const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { taskService } = require('../services');


const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask({
    ...req.body,
    createdBy: req.user.id,
  });

  res
    .status(httpStatus.CREATED)
    .send(
      new ApiResponse(
        httpStatus.CREATED,
        task,
        'Task created successfully'
      )
    );
});


const getTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.queryTasks(req.query);

  res.send(
    new ApiResponse(
      httpStatus.OK,
      tasks,
      'Tasks retrieved successfully'
    )
  );
});

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.taskId);

  if (!task) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Task not found'
    );
  }

  res.send(
    new ApiResponse(
      httpStatus.OK,
      task,
      'Task retrieved successfully'
    )
  );
});


const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTaskById(
    req.params.taskId,
    req.body
  );

  res.send(
    new ApiResponse(
      httpStatus.OK,
      task,
      'Task updated successfully'
    )
  );
});


const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTaskById(req.params.taskId);

  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};