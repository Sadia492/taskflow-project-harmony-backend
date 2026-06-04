const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/stats', auth('getDashboard'), controller.getStats);
router.get('/workload', auth('getDashboard'), controller.getWorkload);
router.get('/project-progress', auth('getDashboard'), controller.getProjectProgress);

module.exports = router;