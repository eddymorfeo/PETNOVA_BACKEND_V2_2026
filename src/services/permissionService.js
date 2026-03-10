const ApiError = require('../utils/apiError');
const {
  createPermission,
  findPermissionById,
  findPermissionByCode,
  getAllPermissions,
  updatePermissionById,
  softDeletePermissionById,
} = require('../models/permissionModel');

const createNewPermission = async (payload, authenticatedUserId) => {
  const existingPermission = await findPermissionByCode(payload.code);

  if (existingPermission) {
    throw new ApiError(409, 'Ya existe un permiso con ese código.');
  }

  return createPermission({
    code: payload.code,
    name: payload.name,
    description: payload.description,
    module: payload.module,
    createdBy: authenticatedUserId,
  });
};

const listPermissions = async () => {
  return getAllPermissions();
};

const getPermissionDetail = async (permissionId) => {
  const permission = await findPermissionById(permissionId);

  if (!permission) {
    throw new ApiError(404, 'Permiso no encontrado.');
  }

  return permission;
};

const updatePermission = async (permissionId, payload, authenticatedUserId) => {
  const currentPermission = await findPermissionById(permissionId);

  if (!currentPermission) {
    throw new ApiError(404, 'Permiso no encontrado.');
  }

  if (payload.code && payload.code !== currentPermission.code) {
    const existingPermission = await findPermissionByCode(payload.code);

    if (existingPermission && existingPermission.id !== permissionId) {
      throw new ApiError(409, 'Ya existe un permiso con ese código.');
    }
  }

  return updatePermissionById(permissionId, payload, authenticatedUserId);
};

const deletePermission = async (permissionId, authenticatedUserId) => {
  const currentPermission = await findPermissionById(permissionId);

  if (!currentPermission) {
    throw new ApiError(404, 'Permiso no encontrado.');
  }

  return softDeletePermissionById(permissionId, authenticatedUserId);
};

module.exports = {
  createNewPermission,
  listPermissions,
  getPermissionDetail,
  updatePermission,
  deletePermission,
};