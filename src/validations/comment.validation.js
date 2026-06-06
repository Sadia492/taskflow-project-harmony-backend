const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addComment = {
  body: Joi.object().keys({
    task: Joi.string().required().custom(objectId),
    content: Joi.string().required(),
    taskOwner: Joi.string().custom(objectId), // needed for notification in service
  }),
};

const getTaskComments = {
  params: Joi.object().keys({
    taskId: Joi.string().required().custom(objectId),
  }),
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  addComment,
  getTaskComments,
  deleteComment,
};
