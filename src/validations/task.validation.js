const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    project: Joi.string().custom(objectId).required(),
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    assignedTo: Joi.string().custom(objectId),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('high', 'medium', 'low'),
    status: Joi.string().valid('todo', 'inProgress', 'completed'),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),

  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      assignedTo: Joi.string().custom(objectId),
      dueDate: Joi.date(),
      priority: Joi.string().valid('high', 'medium', 'low'),
      status: Joi.string().valid('todo', 'inProgress', 'completed'),
    })
    .min(1),
};

module.exports = {
  createTask,
  updateTask,
};