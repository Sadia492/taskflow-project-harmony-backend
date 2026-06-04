const allRoles = {
  teamMember: ['getProjects', 'getTasks', 'manageTasks', 'getActivities'],
  projectManager: ['getProjects', 'manageProjects', 'getTasks', 'manageTasks', 'getActivities'],
  admin: ['getUsers', 'manageUsers', 'getProjects', 'manageProjects', 'getTasks', 'manageTasks', 'getActivities'],
};

const roles = Object.keys(allRoles);

const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};