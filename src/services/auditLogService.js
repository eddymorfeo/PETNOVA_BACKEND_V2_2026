const ApiError = require('../utils/apiError');
const { findUserById } = require('../models/userModel');
const { findClientById } = require('../models/clientModel');
const {
  createAuditLog,
  findAuditLogById,
  getAllAuditLogs,
} = require('../models/auditLogModel');

const validateActor = async (actorType, actorId) => {
  if (actorType === 'SYSTEM') {
    return;
  }

  if (!actorId) {
    throw new ApiError(400, 'actorId es obligatorio cuando actorType no es SYSTEM.');
  }

  if (actorType === 'USER') {
    const user = await findUserById(actorId);

    if (!user) {
      throw new ApiError(404, 'El usuario actor no existe.');
    }

    return;
  }

  if (actorType === 'CLIENT') {
    const client = await findClientById(actorId);

    if (!client) {
      throw new ApiError(404, 'El cliente actor no existe.');
    }

    return;
  }

  throw new ApiError(400, 'actorType debe ser USER, CLIENT o SYSTEM.');
};

const createNewAuditLog = async (payload, authenticatedUserId) => {
  await validateActor(payload.actorType, payload.actorId);

  return createAuditLog({
    actorType: payload.actorType,
    actorId: payload.actorId,
    action: payload.action,
    entity: payload.entity,
    entityId: payload.entityId,
    meta: payload.meta,
    createdBy: authenticatedUserId,
  });
};

const listAuditLogs = async () => {
  return getAllAuditLogs();
};

const getAuditLogDetail = async (auditLogId) => {
  const auditLog = await findAuditLogById(auditLogId);

  if (!auditLog) {
    throw new ApiError(404, 'Registro de auditoría no encontrado.');
  }

  return auditLog;
};

module.exports = {
  createNewAuditLog,
  listAuditLogs,
  getAuditLogDetail,
};