const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');
const taskRoute = require('./task.route');
const activityRoute = require('./activity.route');
const attachmentRoute = require('./attachment.route');
const analyticsRoute = require('./analytics.route');
const dashboardRoute = require('./dashboard.route');



const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/projects',
    route: projectRoute,
  },
  {
    path: '/tasks',
    route: taskRoute,
  },
  {
    path: '/activities',
    route: activityRoute,
  },
  {
    path: '/attachments',
    route: attachmentRoute,
  },
  {
    path: '/analytics',
    route: analyticsRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
