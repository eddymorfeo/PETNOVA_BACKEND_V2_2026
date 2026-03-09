const ApiError = require('../utils/apiError');
const {
  createRole,
  findRoleById,
  findRoleByCode,
  getAllRoles,
  updateRoleById,
  softDeleteRoleById,
} = require('../models/roleModel');

const createNewRole = async (payload, authenticatedUserId) => {
  const existingRole = await findRoleByCode(payload.code);

  if (existingRole) {
    throw new ApiError(409, 'Ya existe un rol registrado con ese código.');
  }

  return createRole({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listRoles = async () => {
  return getAllRoles();
};

const getRoleDetail = async (roleId) => {
  const role = await findRoleById(roleId);

  if (!role) {
    throw new ApiError(404, 'Rol no encontrado.');
  }

  return role;
};

const updateRole = async (roleId, payload, authenticatedUserId) => {
  const currentRole = await findRoleById(roleId);

  if (!currentRole) {
    throw new ApiError(404, 'Rol no encontrado.');
  }

  if (payload.code && payload.code !== currentRole.code) {
    const existingRole = await findRoleByCode(payload.code);

    if (existingRole && existingRole.id !== roleId) {
      throw new ApiError(409, 'Ya existe un rol registrado con ese código.');
    }
  }

  return updateRoleById(roleId, payload, authenticatedUserId);
};

const deleteRole = async (roleId, authenticatedUserId) => {
  const currentRole = await findRoleById(roleId);

  if (!currentRole) {
    throw new ApiError(404, 'Rol no encontrado.');
  }

  return softDeleteRoleById(roleId, authenticatedUserId);
};

module.exports = {
  createNewRole,
  listRoles,
  getRoleDetail,
  updateRole,
  deleteRole,
};