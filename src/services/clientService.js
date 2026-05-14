const ApiError = require('../utils/apiError');
const { hashPassword } = require('../utils/password');
const {
  createClient,
  findClientByEmail,
  findClientById,
  getAllClients,
  updateClientById,
  softDeleteClientById,
} = require('../models/clientModel');
const {
  enqueueClientCreatedEmail,
  enqueueUserProfileUpdatedEmail,
} = require('./email/emailNotificationService');

const createNewClient = async (payload, authenticatedUserId) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const existingClient = await findClientByEmail(normalizedEmail);

  if (existingClient) {
    throw new ApiError(409, 'Ya existe un cliente registrado con ese email.');
  }

  const passwordHash = payload.password
    ? await hashPassword(payload.password)
    : null;

  const client = await createClient({
    ...payload,
    email: normalizedEmail,
    passwordHash,
    createdBy: authenticatedUserId,
  });

  await enqueueClientCreatedEmail({
    toEmail: client.email,
    fullName: client.full_name,
    createdBy: authenticatedUserId,
  });

  return client;
};

const listClients = async () => {
  return getAllClients();
};

const getClientDetail = async (clientId) => {
  const client = await findClientById(clientId);

  if (!client) {
    throw new ApiError(404, 'Cliente no encontrado.');
  }

  return client;
};

const updateClient = async (clientId, payload, authenticatedUserId) => {
  const currentClient = await findClientById(clientId);

  if (!currentClient) {
    throw new ApiError(404, 'Cliente no encontrado.');
  }

  const updatePayload = { ...payload };

  if (payload.email) {
    updatePayload.email = payload.email.trim().toLowerCase();
  }

  if (payload.password) {
    updatePayload.passwordHash = await hashPassword(payload.password);
    delete updatePayload.password;
  }

  if (updatePayload.email && updatePayload.email !== currentClient.email) {
    const existingClient = await findClientByEmail(updatePayload.email);

    if (existingClient && existingClient.id !== clientId) {
      throw new ApiError(409, 'Ya existe un cliente registrado con ese email.');
    }
  }

  const updatedClient = await updateClientById(clientId, updatePayload, authenticatedUserId);

  const notificationEmails = [
    currentClient.email,
    updatedClient.email,
  ].filter((email, index, emails) => email && emails.indexOf(email) === index);

  await Promise.all(
    notificationEmails.map((toEmail) =>
      enqueueUserProfileUpdatedEmail({
        toEmail,
        fullName: updatedClient.full_name,
        createdBy: authenticatedUserId,
      })
    )
  );

  return updatedClient;
};

const deleteClient = async (clientId, authenticatedUserId) => {
  const currentClient = await findClientById(clientId);

  if (!currentClient) {
    throw new ApiError(404, 'Cliente no encontrado.');
  }

  return softDeleteClientById(clientId, authenticatedUserId);
};

module.exports = {
  createNewClient,
  listClients,
  getClientDetail,
  updateClient,
  deleteClient,
};
