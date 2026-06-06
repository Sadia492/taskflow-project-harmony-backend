const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { commentValidation } = require('../validations');
const { commentController } = require('../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(commentValidation.addComment), commentController.addComment);

router
  .route('/:taskId')
  .get(auth(), validate(commentValidation.getTaskComments), commentController.getTaskComments);

router
  .route('/delete/:commentId')
  .delete(auth(), validate(commentValidation.deleteComment), commentController.deleteComment);

module.exports = router;
