const ApiError = require('../utils/apiError');
const { findClientById } = require('../models/clientModel');
const {
  createClientAuthSession,
  findClientAuthSessionById,
  getAllClientAuthSessions,
  updateClientAuthSessionById,
  revokeClientAuthSessionById,
} = require('../models/clientAuthSessionModel');

const validateExpiryDate = (expiresAt) => {
  const expiresDate = new Date(expiresAt);

  if (Number.isNaN(expiresDate.getTime())) {
    throw new ApiError(400, 'expiresAt debe ser una fecha válida.');
  }
};

const createNewClientAuthSession = async (payload, authenticatedUserId) => {
  const client = await findClientById(payload.clientId);

  if (!client) {
    throw new ApiError(404, 'El cliente asociado no existe.');
  }

  validateExpiryDate(payload.expiresAt);

  return createClientAuthSession({
    clientId: payload.clientId,
    refreshTokenHash: payload.refreshTokenHash,
    expiresAt: payload.expiresAt,
    createdBy: authenticatedUserId,
  });
};

const listClientAuthSessions = async () => {
  return getAllClientAuthSessions();
};

const getClientAuthSessionDetail = async (sessionId) => {
  const session = await findClientAuthSessionById(sessionId);

  if (!session) {
    throw new ApiError(404, 'Sesión de cliente no encontrada.');
  }

  return session;
};

const updateClientAuthSession = async (sessionId, payload, authenticatedUserId) => {
  const currentSession = await findClientAuthSessionById(sessionId);

  if (!currentSession) {
    throw new ApiError(404, 'Sesión de cliente no encontrada.');
  }

  if (payload.expiresAt !== undefined) {
    validateExpiryDate(payload.expiresAt);
  }

  return updateClientAuthSessionById(sessionId, payload, authenticatedUserId);
};

const deleteClientAuthSession = async (sessionId, authenticatedUserId) => {
  const currentSession = await findClientAuthSessionById(sessionId);

  if (!currentSession) {
    throw new ApiError(404, 'Sesión de cliente no encontrada.');
  }

  return revokeClientAuthSessionById(sessionId, authenticatedUserId);
};

module.exports = {
  createNewClientAuthSession,
  listClientAuthSessions,
  getClientAuthSessionDetail,
  updateClientAuthSession,
  deleteClientAuthSession,
};