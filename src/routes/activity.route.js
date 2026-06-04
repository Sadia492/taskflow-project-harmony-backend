const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/activity.controller');

const router = express.Router();

/**
 * Only readable — not creatable from frontend
 */
router.get(
  '/',
  auth('getActivities'),
  controller.getActivities
);

module.exports = router;