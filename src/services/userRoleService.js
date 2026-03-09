const ApiError = require('../utils/apiError');
const { findUserById } = require('../models/userModel');
const { findRoleById } = require('../models/roleModel');
const {
  createUserRole,
  findUserRole,
  getAllUserRoles,
  getRolesByUserId,
  deleteUserRole,
} = require('../models/userRoleModel');

const assignRoleToUser = async (payload, authenticatedUserId) => {
  const user = await findUserById(payload.userId);

  if (!user) {
    throw new ApiError(404, 'El usuario no existe.');
  }

  const role = await findRoleById(payload.roleId);

  if (!role) {
    throw new ApiError(404, 'El rol no existe.');
  }

  const existingAssignment = await findUserRole(payload.userId, payload.roleId);

  if (existingAssignment) {
    throw new ApiError(409, 'Ese rol ya está asignado al usuario.');
  }

  return createUserRole({
    userId: payload.userId,
    roleId: payload.roleId,
    createdBy: authenticatedUserId,
  });
};

const listUserRoles = async () => {
  return getAllUserRoles();
};

const listRolesByUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'El usuario no existe.');
  }

  return getRolesByUserId(userId);
};

const removeRoleFromUser = async (payload) => {
  const assignment = await findUserRole(payload.userId, payload.roleId);

  if (!assignment) {
    throw new ApiError(404, 'La asignación de rol no existe.');
  }

  return deleteUserRole(payload.userId, payload.roleId);
};

module.exports = {
  assignRoleToUser,
  listUserRoles,
  listRolesByUser,
  removeRoleFromUser,
};