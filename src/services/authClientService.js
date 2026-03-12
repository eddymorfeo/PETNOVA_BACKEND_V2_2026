const crypto = require('crypto');

const ApiError = require('../utils/apiError');
const { comparePassword, hashPassword } = require('../utils/password');
const { generateAccessToken } = require('../configs/jwt');

const {
  createClient,
  findClientByEmail,
  findClientById,
  findClientAuthByEmail,
  findClientAuthById,
  updateClientPasswordById,
} = require('../models/clientModel');

const {
  createPasswordResetToken,
  findValidPasswordResetTokenByHash,
  invalidatePasswordResetTokensBySubject,
  markPasswordResetTokenAsUsed,
} = require('../models/passwordResetTokenModel');

const {
  enqueueAccountCreatedEmail,
  enqueuePasswordResetEmail,
  enqueuePasswordChangedEmail,
} = require('./email/emailNotificationService');

const buildClientAccessToken = (client) => {
  return generateAccessToken({
    sub: client.id,
    email: client.email,
    type: 'client',
  });
};

const mapClientPublic = (client) => ({
  id: client.id,
  email: client.email,
  fullName: client.full_name,
  phone: client.phone,
  documentId: client.document_id,
  address: client.address,
  isActive: client.is_active,
});

const registerClient = async (payload) => {
  const existingClient = await findClientByEmail(payload.email.trim().toLowerCase());

  if (existingClient) {
    throw new ApiError(409, 'Ya existe una cuenta asociada a ese correo.');
  }

  const passwordHash = await hashPassword(payload.password);

  const client = await createClient({
    fullName: payload.fullName,
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone || null,
    documentId: payload.documentId || null,
    address: payload.address || null,
    passwordHash,
    createdBy: null,
  });

  await enqueueAccountCreatedEmail({
    toEmail: client.email,
    fullName: client.full_name,
    email: client.email,
    createdBy: null,
  });

  return {
    accessToken: buildClientAccessToken(client),
    client: mapClientPublic(client),
  };
};

const loginClient = async ({ email, password }) => {
  const client = await findClientAuthByEmail(email.trim().toLowerCase());

  if (!client) {
    throw new ApiError(401, 'Credenciales inválidas.');
  }

  if (!client.is_active) {
    throw new ApiError(403, 'La cuenta del cliente se encuentra inactiva.');
  }

  const passwordIsValid = await comparePassword(password, client.password_hash);

  if (!passwordIsValid) {
    throw new ApiError(401, 'Credenciales inválidas.');
  }

  return {
    accessToken: buildClientAccessToken(client),
    client: mapClientPublic(client),
  };
};

const getAuthenticatedClient = async (clientId) => {
  const client = await findClientAuthById(clientId);

  if (!client) {
    throw new ApiError(404, 'Cliente no encontrado.');
  }

  if (!client.is_active) {
    throw new ApiError(403, 'La cuenta del cliente se encuentra inactiva.');
  }

  return mapClientPublic(client);
};

const requestClientPasswordReset = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const client = await findClientByEmail(normalizedEmail);

  if (!client || !client.is_active) {
    return { queued: true };
  }

  await invalidatePasswordResetTokensBySubject({
    subjectType: 'CLIENT',
    subjectId: client.id,
    updatedBy: null,
  });

  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  await createPasswordResetToken({
    subjectType: 'CLIENT',
    subjectId: client.id,
    tokenHash,
    expiresAt,
    createdBy: null,
  });

  await enqueuePasswordResetEmail({
    toEmail: client.email,
    token: plainToken,
    createdBy: null,
  });

  return { queued: true };
};

const resetClientPassword = async ({ token, password }) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const passwordResetToken = await findValidPasswordResetTokenByHash({
    subjectType: 'CLIENT',
    tokenHash,
  });

  if (!passwordResetToken) {
    throw new ApiError(400, 'El token es inválido, ya fue usado o expiró.');
  }

  const client = await findClientAuthById(passwordResetToken.subject_id);

  if (!client) {
    throw new ApiError(404, 'Cliente no encontrado.');
  }

  const newPasswordHash = await hashPassword(password);

  await updateClientPasswordById(client.id, newPasswordHash, null);

  await markPasswordResetTokenAsUsed(passwordResetToken.id, null);

  await invalidatePasswordResetTokensBySubject({
    subjectType: 'CLIENT',
    subjectId: client.id,
    updatedBy: null,
  });

  await enqueuePasswordChangedEmail({
    toEmail: client.email,
    fullName: client.full_name,
    createdBy: null,
  });

  return { updated: true };
};

module.exports = {
  registerClient,
  loginClient,
  getAuthenticatedClient,
  requestClientPasswordReset,
  resetClientPassword,
};