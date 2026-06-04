const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    deadline: Joi.date().required(),
    status: Joi.string().valid(
      'active',
      'completed',
      'onHold'
    ),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),

  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      deadline: Joi.date(),
      status: Joi.string().valid(
        'active',
        'completed',
        'onHold'
      ),
    })
    .min(1),
};

module.exports = {
  createProject,
  updateProject,
};
