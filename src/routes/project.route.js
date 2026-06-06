
const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const projectValidation = require('../validations/project.validation');
const projectController = require('../controllers/project.controller');

const router = express.Router();
router
  .route('/')
  .post(
    auth('manageProjects'),
    validate(projectValidation.createProject),
    projectController.createProject
  )
  .get(
    auth('getProjects'),
    projectController.getProjects
  );

router
  .route('/:projectId')
  .get(
    auth('getProjects'),
    projectController.getProject
  )
  .patch(
    auth('manageProjects'),
    validate(projectValidation.updateProject),
    projectController.updateProject
  )
  .delete(
    auth('manageProjects'),
    projectController.deleteProject
  );
  router.post(
  '/:projectId/members',
  auth('manageProjects'),
  validate(projectValidation.addMember),
  projectController.addMember
);
router.delete(
  '/:projectId/members/:userId',
  auth('manageProjects'),
  projectController.removeMember
);

  module.exports = router;