const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');
const taskRoute = require('./task.route');
const activityRoute = require('./activity.route');

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
