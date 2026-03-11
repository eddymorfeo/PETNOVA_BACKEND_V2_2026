const ApiError = require('../utils/apiError');
const { findAppointmentById } = require('../models/appointmentModel');
const { findClientById } = require('../models/clientModel');
const {
  createGuestBooking,
  findGuestBookingById,
  getAllGuestBookings,
  updateGuestBookingById,
  deleteGuestBookingById,
} = require('../models/guestBookingModel');

const validateGuestBookingDates = (invitationSentAt) => {
  if (invitationSentAt !== undefined && invitationSentAt !== null) {
    const invitationDate = new Date(invitationSentAt);

    if (Number.isNaN(invitationDate.getTime())) {
      throw new ApiError(400, 'invitationSentAt debe ser una fecha válida.');
    }
  }
};

const createNewGuestBooking = async (payload, authenticatedUserId) => {
  const appointment = await findAppointmentById(payload.appointmentId);

  if (!appointment) {
    throw new ApiError(404, 'La cita asociada no existe.');
  }

  if (payload.convertedClientId) {
    const client = await findClientById(payload.convertedClientId);

    if (!client) {
      throw new ApiError(404, 'El cliente convertido no existe.');
    }
  }

  validateGuestBookingDates(payload.invitationSentAt);

  return createGuestBooking({
    appointmentId: payload.appointmentId,
    contactEmail: payload.contactEmail,
    contactName: payload.contactName,
    contactPhone: payload.contactPhone,
    invitationSentAt: payload.invitationSentAt,
    convertedClientId: payload.convertedClientId,
    createdBy: authenticatedUserId,
  });
};

const listGuestBookings = async () => {
  return getAllGuestBookings();
};

const getGuestBookingDetail = async (guestBookingId) => {
  const guestBooking = await findGuestBookingById(guestBookingId);

  if (!guestBooking) {
    throw new ApiError(404, 'Reserva invitada no encontrada.');
  }

  return guestBooking;
};

const updateGuestBooking = async (guestBookingId, payload, authenticatedUserId) => {
  const currentGuestBooking = await findGuestBookingById(guestBookingId);

  if (!currentGuestBooking) {
    throw new ApiError(404, 'Reserva invitada no encontrada.');
  }

  if (payload.convertedClientId) {
    const client = await findClientById(payload.convertedClientId);

    if (!client) {
      throw new ApiError(404, 'El cliente convertido no existe.');
    }
  }

  validateGuestBookingDates(payload.invitationSentAt);

  return updateGuestBookingById(guestBookingId, payload, authenticatedUserId);
};

const deleteGuestBooking = async (guestBookingId) => {
  const currentGuestBooking = await findGuestBookingById(guestBookingId);

  if (!currentGuestBooking) {
    throw new ApiError(404, 'Reserva invitada no encontrada.');
  }

  return deleteGuestBookingById(guestBookingId);
};

module.exports = {
  createNewGuestBooking,
  listGuestBookings,
  getGuestBookingDetail,
  updateGuestBooking,
  deleteGuestBooking,
};