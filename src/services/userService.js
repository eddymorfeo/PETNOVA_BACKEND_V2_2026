const ApiError = require('../utils/apiError');
const { hashPassword } = require('../utils/password');
const {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  updateUserById,
  softDeleteUserById,
} = require('../models/userModel');

const createNewUser = async (payload, authenticatedUserId) => {
  const existingUserByUsername = await findUserByUsername(payload.username);

  if (existingUserByUsername) {
    throw new ApiError(409, 'Ya existe un usuario con ese username.');
  }

  const existingUserByEmail = await findUserByEmail(payload.email);

  if (existingUserByEmail) {
    throw new ApiError(409, 'Ya existe un usuario con ese email.');
  }

  const passwordHash = await hashPassword(payload.password);

  return createUser({
    username: payload.username,
    email: payload.email,
    passwordHash,
    fullName: payload.fullName,
    phone: payload.phone,
    createdBy: authenticatedUserId,
  });
};

const listUsers = async () => {
  return getAllUsers();
};

const getUserDetail = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado.');
  }

  return user;
};

const updateUser = async (userId, payload, authenticatedUserId) => {
  const currentUser = await findUserById(userId);

  if (!currentUser) {
    throw new ApiError(404, 'Usuario no encontrado.');
  }

  if (payload.username && payload.username !== currentUser.username) {
    const existingUserByUsername = await findUserByUsername(payload.username);

    if (existingUserByUsername && existingUserByUsername.id !== userId) {
      throw new ApiError(409, 'Ya existe un usuario con ese username.');
    }
  }

  if (payload.email && payload.email !== currentUser.email) {
    const existingUserByEmail = await findUserByEmail(payload.email);

    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      throw new ApiError(409, 'Ya existe un usuario con ese email.');
    }
  }

  const updatePayload = {
    username: payload.username,
    email: payload.email,
    fullName: payload.fullName,
    phone: payload.phone,
    isActive: payload.isActive,
  };

  if (payload.password) {
    updatePayload.passwordHash = await hashPassword(payload.password);
  }

  return updateUserById(userId, updatePayload, authenticatedUserId);
};

const deleteUser = async (userId, authenticatedUserId) => {
  const currentUser = await findUserById(userId);

  if (!currentUser) {
    throw new ApiError(404, 'Usuario no encontrado.');
  }

  return softDeleteUserById(userId, authenticatedUserId);
};

module.exports = {
  createNewUser,
  listUsers,
  getUserDetail,
  updateUser,
  deleteUser,
};