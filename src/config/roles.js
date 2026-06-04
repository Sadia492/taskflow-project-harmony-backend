const allRoles = {
  teamMember: ['getProjects', 'getTasks', 'manageTasks', 'getActivities', 'getAnalytics', 'getDashboard'],
  projectManager: ['getProjects', 'manageProjects', 'getTasks', 'manageTasks', 'getActivities', 'getAnalytics', 'getDashboard'],
  admin: ['getUsers', 'manageUsers', 'getProjects', 'manageProjects', 'getTasks', 'manageTasks', 'getActivities', 'getAnalytics', 'getDashboard'],
};

const roles = Object.keys(allRoles);

const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};