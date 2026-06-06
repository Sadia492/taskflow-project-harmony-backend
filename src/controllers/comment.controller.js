const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const addComment = catchAsync(async (req, res) => {
  const comment = await commentService.addComment({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(new ApiResponse(httpStatus.CREATED, comment, 'Comment added successfully'));
});

const getTaskComments = catchAsync(async (req, res) => {
  const comments = await commentService.getTaskComments(req.params.taskId);
  res.send(new ApiResponse(httpStatus.OK, comments, 'Comments retrieved successfully'));
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteComment(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addComment,
  getTaskComments,
  deleteComment,
};
