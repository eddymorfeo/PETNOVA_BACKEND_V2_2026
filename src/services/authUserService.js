const ApiError = require('../utils/apiError');
const { comparePassword } = require('../utils/password');
const { generateAccessToken } = require('../configs/jwt');
const { findUserByUsername, findRolesByUserId, findUserById  } = require('../models/userModel');

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

  const roles = await findRolesByUserId(user.id);

  const accessToken = generateAccessToken({
    sub: user.id,
    username: user.username,
    email: user.email,
    roles: roles.map((role) => role.code),
  });

  return {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      isActive: user.is_active,
      roles,
    },
  };
};

const getAuthenticatedUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado.');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'El usuario se encuentra inactivo.');
  }

  const roles = await findRolesByUserId(user.id);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone,
    isActive: user.is_active,
    roles,
  };
};
module.exports = {
  loginUser,
  getAuthenticatedUser
};