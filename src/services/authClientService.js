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
  findGuestBookingById,
  updateGuestBookingById,
} = require('../models/guestBookingModel');
const {
  findAppointmentById,
  updateAppointmentById,
} = require('../models/appointmentModel');
const { createPet } = require('../models/petModel');

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

const normalizeEmail = (email) => email.trim().toLowerCase();

const mapClientPublic = (client) => ({
  id: client.id,
  email: client.email,
  fullName: client.full_name,
  phone: client.phone,
  documentId: client.document_id,
  address: client.address,
  isActive: client.is_active,
});

const buildPetNotesFromSnapshot = (petSnapshot) => {
  const notes = [];

  if (petSnapshot.age) {
    notes.push(`Edad informada en reserva publica: ${petSnapshot.age}`);
  }

  if (petSnapshot.weightKg) {
    notes.push(`Peso informado en reserva publica: ${petSnapshot.weightKg} kg`);
  }

  if (petSnapshot.observations) {
    notes.push(`Observaciones de reserva publica: ${petSnapshot.observations}`);
  }

  return notes.length ? notes.join('\n') : null;
};

const createPetFromGuestBooking = async (guestBooking, clientId) => {
  const petSnapshot = guestBooking?.pet_snapshot;

  if (!petSnapshot?.name || !petSnapshot?.speciesId) {
    return null;
  }

  return createPet({
    clientId,
    name: petSnapshot.name,
    speciesId: petSnapshot.speciesId,
    breedId: petSnapshot.breedId || null,
    sex: petSnapshot.sex || null,
    birthDate: null,
    color: null,
    microchip: null,
    isSterilized: null,
    allergies: null,
    notes: buildPetNotesFromSnapshot(petSnapshot),
    createdBy: null,
  });
};

const getInvitationToken = (payload) => {
  if (typeof payload.invitation !== 'string') {
    return null;
  }

  const invitation = payload.invitation.trim();
  return invitation.length ? invitation : null;
};

const resolveGuestBookingInvitation = async (invitationToken, clientEmail) => {
  if (!invitationToken) {
    return null;
  }

  const guestBooking = await findGuestBookingById(invitationToken);

  if (!guestBooking) {
    throw new ApiError(404, 'Invitacion no encontrada.');
  }

  if (normalizeEmail(guestBooking.contact_email) !== clientEmail) {
    throw new ApiError(403, 'La invitacion no corresponde al correo informado.');
  }

  if (guestBooking.converted_client_id) {
    throw new ApiError(409, 'Esta invitacion ya fue utilizada.');
  }

  const appointment = await findAppointmentById(guestBooking.appointment_id);

  if (!appointment) {
    throw new ApiError(404, 'La cita asociada a la invitacion no existe.');
  }

  if (appointment.client_id) {
    throw new ApiError(409, 'La cita ya esta asociada a un cliente.');
  }

  return {
    guestBooking,
    appointment,
  };
};

const associateGuestBookingWithClient = async ({
  guestBooking,
  appointment,
  clientId,
}) => {
  if (!guestBooking || !appointment) {
    return;
  }

  const pet = await createPetFromGuestBooking(guestBooking, clientId);

  await updateAppointmentById(
    appointment.id,
    {
      clientId,
      ...(pet ? { petId: pet.id } : {}),
    },
    null,
  );

  await updateGuestBookingById(
    guestBooking.id,
    { convertedClientId: clientId },
    null,
  );
};

const registerClient = async (payload) => {
  const normalizedEmail = normalizeEmail(payload.email);
  const invitationToken = getInvitationToken(payload);
  const existingClient = await findClientByEmail(normalizedEmail);

  if (existingClient) {
    throw new ApiError(409, 'Ya existe una cuenta asociada a ese correo.');
  }

  const invitation = await resolveGuestBookingInvitation(
    invitationToken,
    normalizedEmail,
  );

  const passwordHash = await hashPassword(payload.password);

  const client = await createClient({
    fullName: payload.fullName,
    email: normalizedEmail,
    phone: payload.phone || null,
    documentId: payload.documentId || null,
    address: payload.address || null,
    passwordHash,
    createdBy: null,
  });

  if (invitation) {
    await associateGuestBookingWithClient({
      ...invitation,
      clientId: client.id,
    });
  }

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
