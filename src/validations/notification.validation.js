const Joi = require('joi');
const { objectId } = require('./custom.validation');

const markAsRead = {
  params: Joi.object().keys({
    notificationId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  markAsRead,
};
