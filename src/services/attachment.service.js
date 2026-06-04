const Attachment = require('../models/attachment.model');

const createAttachment = async (data) => {
  return Attachment.create(data);
};

const getAttachments = async (taskId) => {
  return Attachment.find({ task: taskId });
};

module.exports = {
  createAttachment,
  getAttachments,
};