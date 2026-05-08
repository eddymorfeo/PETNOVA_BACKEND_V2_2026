const ApiError = require('../utils/apiError');
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
  const existingClient = await findClientByEmail(payload.email);

  if (existingClient) {
    throw new ApiError(409, 'Ya existe un cliente registrado con ese email.');
  }

  const client = await createClient({
    ...payload,
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

  if (payload.email && payload.email !== currentClient.email) {
    const existingClient = await findClientByEmail(payload.email);

    if (existingClient && existingClient.id !== clientId) {
      throw new ApiError(409, 'Ya existe un cliente registrado con ese email.');
    }
  }

  const updatedClient = await updateClientById(clientId, payload, authenticatedUserId);

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
