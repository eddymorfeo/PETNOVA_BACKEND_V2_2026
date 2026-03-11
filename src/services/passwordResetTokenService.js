const ApiError = require('../utils/apiError');
const { findUserById } = require('../models/userModel');
const { findClientById } = require('../models/clientModel');
const {
  createPasswordResetToken,
  findPasswordResetTokenById,
  getAllPasswordResetTokens,
  updatePasswordResetTokenById,
  deletePasswordResetTokenById,
} = require('../models/passwordResetTokenModel');

const validatePasswordResetTokenDates = (expiresAt, usedAt) => {
  const expiresDate = new Date(expiresAt);

  if (Number.isNaN(expiresDate.getTime())) {
    throw new ApiError(400, 'expiresAt debe ser una fecha válida.');
  }

  if (usedAt !== undefined && usedAt !== null) {
    const usedDate = new Date(usedAt);

    if (Number.isNaN(usedDate.getTime())) {
      throw new ApiError(400, 'usedAt debe ser una fecha válida.');
    }
  }
};

const validatePasswordResetSubject = async (subjectType, subjectId) => {
  if (subjectType === 'USER') {
    const user = await findUserById(subjectId);

    if (!user) {
      throw new ApiError(404, 'El usuario asociado no existe.');
    }

    return;
  }

  if (subjectType === 'CLIENT') {
    const client = await findClientById(subjectId);

    if (!client) {
      throw new ApiError(404, 'El cliente asociado no existe.');
    }

    return;
  }

  throw new ApiError(400, 'subjectType debe ser USER o CLIENT.');
};

const createNewPasswordResetToken = async (payload, authenticatedUserId) => {
  await validatePasswordResetSubject(payload.subjectType, payload.subjectId);
  validatePasswordResetTokenDates(payload.expiresAt, payload.usedAt);

  return createPasswordResetToken({
    subjectType: payload.subjectType,
    subjectId: payload.subjectId,
    tokenHash: payload.tokenHash,
    expiresAt: payload.expiresAt,
    usedAt: payload.usedAt,
    createdBy: authenticatedUserId,
  });
};

const listPasswordResetTokens = async () => {
  return getAllPasswordResetTokens();
};

const getPasswordResetTokenDetail = async (passwordResetTokenId) => {
  const token = await findPasswordResetTokenById(passwordResetTokenId);

  if (!token) {
    throw new ApiError(404, 'Token de recuperación no encontrado.');
  }

  return token;
};

const updatePasswordResetToken = async (passwordResetTokenId, payload, authenticatedUserId) => {
  const currentToken = await findPasswordResetTokenById(passwordResetTokenId);

  if (!currentToken) {
    throw new ApiError(404, 'Token de recuperación no encontrado.');
  }

  const mergedExpiresAt = payload.expiresAt ?? currentToken.expires_at;
  const mergedUsedAt = payload.usedAt ?? currentToken.used_at;

  validatePasswordResetTokenDates(mergedExpiresAt, mergedUsedAt);

  return updatePasswordResetTokenById(passwordResetTokenId, payload, authenticatedUserId);
};

const deletePasswordResetToken = async (passwordResetTokenId) => {
  const currentToken = await findPasswordResetTokenById(passwordResetTokenId);

  if (!currentToken) {
    throw new ApiError(404, 'Token de recuperación no encontrado.');
  }

  return deletePasswordResetTokenById(passwordResetTokenId);
};

module.exports = {
  createNewPasswordResetToken,
  listPasswordResetTokens,
  getPasswordResetTokenDetail,
  updatePasswordResetToken,
  deletePasswordResetToken,
};