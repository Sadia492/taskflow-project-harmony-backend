const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const taskValidation = require('../validations/task.validation');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageTasks'),
    validate(taskValidation.createTask),
    taskController.createTask
  )
  .get(
    auth('getTasks'),
    taskController.getTasks
  );

router
  .route('/:taskId')
  .get(
    auth('getTasks'),
    taskController.getTask
  )
  .patch(
    auth('manageTasks'),
    validate(taskValidation.updateTask),
    taskController.updateTask
  )
  .delete(
    auth('manageTasks'),
    taskController.deleteTask
  );

module.exports = router;