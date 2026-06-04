const express = require('express');
const auth = require('../middleware/auth');
const analyticsController = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/task-status', auth('getAnalytics'), analyticsController.getTaskStatus);

router.get('/task-priority', auth('getAnalytics'), analyticsController.getTaskPriority);

module.exports = router;