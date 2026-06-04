const allRoles = {
  teamMember: ['getProjects'],
  projectManager: ['getProjects', 'manageProjects'],
  admin: ['getUsers', 'manageUsers', 'getProjects', 'manageProjects'],
};

const roles = Object.keys(allRoles);

const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};