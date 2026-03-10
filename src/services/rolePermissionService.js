const ApiError = require('../utils/apiError');
const { findRoleById } = require('../models/roleModel');
const { findPermissionById } = require('../models/permissionModel');
const {
  createRolePermission,
  findRolePermission,
  getAllRolePermissions,
  getPermissionsByRoleId,
  deleteRolePermission,
} = require('../models/rolePermissionModel');

const assignPermissionToRole = async (payload, authenticatedUserId) => {
  const role = await findRoleById(payload.roleId);

  if (!role) {
    throw new ApiError(404, 'El rol no existe.');
  }

  const permission = await findPermissionById(payload.permissionId);

  if (!permission) {
    throw new ApiError(404, 'El permiso no existe.');
  }

  const existingAssignment = await findRolePermission(payload.roleId, payload.permissionId);

  if (existingAssignment) {
    throw new ApiError(409, 'Ese permiso ya está asignado al rol.');
  }

  return createRolePermission({
    roleId: payload.roleId,
    permissionId: payload.permissionId,
    createdBy: authenticatedUserId,
  });
};

const listRolePermissions = async () => {
  return getAllRolePermissions();
};

const listPermissionsByRole = async (roleId) => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new ApiError(404, 'El rol no existe.');
  }

  return getPermissionsByRoleId(roleId);
};

const removePermissionFromRole = async (payload) => {
  const assignment = await findRolePermission(payload.roleId, payload.permissionId);

  if (!assignment) {
    throw new ApiError(404, 'La asignación de permiso no existe.');
  }

  return deleteRolePermission(payload.roleId, payload.permissionId);
};

module.exports = {
  assignPermissionToRole,
  listRolePermissions,
  listPermissionsByRole,
  removePermissionFromRole,
};