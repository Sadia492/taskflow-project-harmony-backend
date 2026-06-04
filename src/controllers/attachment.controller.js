const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const { attachmentService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const uploadAttachment = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a file');
  }
  
  const attachment = await attachmentService.createAttachment(
    req.file,
    req.body.taskId,
    req.user.id
  );

  res.status(httpStatus.CREATED).send(
    new ApiResponse(httpStatus.CREATED, attachment, 'File uploaded successfully')
  );
});

const getAttachments = catchAsync(async (req, res) => {
  const attachments = await attachmentService.getAttachments(req.params.taskId);
  res.send(new ApiResponse(httpStatus.OK, attachments, 'Attachments retrieved successfully'));
});

module.exports = {
  uploadAttachment,
  getAttachments,
};
