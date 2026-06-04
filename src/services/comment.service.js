const Comment = require('../models/comment.model');

const addComment = async (data) => {
  return Comment.create(data);
};

const getComments = async (taskId) => {
  return Comment.find({ task: taskId }).populate('user', 'name');
};

module.exports = {
  addComment,
  getComments,
};