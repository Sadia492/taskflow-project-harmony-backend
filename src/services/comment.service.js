const { Comment, Activity } = require('../models');
const notificationService = require('./notification.service');

const addComment = async (data) => {
  const comment = await Comment.create(data);

  await notificationService.createNotification({
    user: data.taskOwner, // or task.createdBy
    message: `New comment on task`,
    type: 'TASK',
  });

  await Activity.create({
    action: 'COMMENT_ADDED',
    description: 'Comment added on task',
    user: data.user,
    task: data.task,
  });

  return comment;
};

const getTaskComments = async (taskId) => {
  return Comment.find({ task: taskId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

const deleteComment = async (id) => {
  return Comment.findByIdAndDelete(id);
};

module.exports = {
  addComment,
  getTaskComments,
  deleteComment,
};