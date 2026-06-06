const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { notificationValidation } = require('../validations');
const { notificationController } = require('../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(), notificationController.getUserNotifications);

router
  .route('/:notificationId/read')
  .patch(auth(), validate(notificationValidation.markAsRead), notificationController.markAsRead);

module.exports = router;
