const ApiError = require('../utils/apiError');
const { comparePassword } = require('../utils/password');
const { generateAccessToken } = require('../configs/jwt');
const {
  findUserByUsername,
  findRolesByUserId,
  findPermissionsByUserId,
  findUserById,
} = require('../models/userModel');

const mapAuthenticatedUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  fullName: user.full_name,
  phone: user.phone,
  isActive: user.is_active,
  createdBy: user.created_by ?? null,
  updatedBy: user.updated_by ?? null,
  createdAt: user.created_at ?? null,
  updatedAt: user.updated_at ?? null,
});

const buildAccessibleModules = (permissions) => {
  const modulesMap = new Map();

  for (const permission of permissions) {
    const moduleKey = permission.module;

    if (!modulesMap.has(moduleKey)) {
      modulesMap.set(moduleKey, {
        code: moduleKey,
        permissions: [],
      });
    }

    modulesMap.get(moduleKey).permissions.push(permission.code);
  }

  return Array.from(modulesMap.values()).sort((leftModule, rightModule) =>
    leftModule.code.localeCompare(rightModule.code)
  );
};

const buildAuthenticatedSession = async (user) => {
  const roles = await findRolesByUserId(user.id);
  const permissions = await findPermissionsByUserId(user.id);
  const modules = buildAccessibleModules(permissions);

  return {
    user: mapAuthenticatedUser(user),
    roles,
    permissions,
    modules,
  };
};

const loginUser = async ({ username, password }) => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new ApiError(401, 'Credenciales inválidas.');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'El usuario se encuentra inactivo.');
  }

  const passwordIsValid = await comparePassword(password, user.password_hash);

  if (!passwordIsValid) {
    throw new ApiError(401, 'Credenciales inválidas.');
  }

  const session = await buildAuthenticatedSession(user);

  const accessToken = generateAccessToken({
    sub: user.id,
    username: user.username,
    email: user.email,
    roles: session.roles.map((role) => role.code),
    permissions: session.permissions.map((permission) => permission.code),
  });

  return {
    accessToken,
    ...session,
  };
};

const getAuthenticatedSession = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado.');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'El usuario se encuentra inactivo.');
  }

  return buildAuthenticatedSession(user);
};

module.exports = {
  loginUser,
  getAuthenticatedSession,
};