const allRoles = {
  teamMember: ['getProjects', 'getTasks', 'manageTasks'],
  projectManager: ['getProjects', 'manageProjects', 'getTasks', 'manageTasks'],
  admin: ['getUsers', 'manageUsers', 'getProjects', 'manageProjects', 'getTasks', 'manageTasks'],
};

const roles = Object.keys(allRoles);

const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};