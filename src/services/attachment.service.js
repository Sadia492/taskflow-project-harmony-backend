const { Attachment, Task, Activity } = require('../models');
const { uploadToCloudinary } = require('../utils/fileUploader');

const createAttachment = async (file, taskId, userId) => {
  const uploadResult = await uploadToCloudinary(file);
  
  const attachment = await Attachment.create({
    task: taskId,
    uploadedBy: userId,
    fileName: file.originalname,
    fileUrl: uploadResult.secure_url,
  });

  // Log activity
  await Activity.create({
    task: taskId,
    user: userId,
    action: 'uploaded an attachment',
    details: file.originalname
  });

  return attachment;
};

const getAttachments = async (taskId) => {
  return Attachment.find({ task: taskId });
};

module.exports = {
  createAttachment,
  getAttachments,
};