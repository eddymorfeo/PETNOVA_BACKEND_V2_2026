const ApiError = require('../utils/apiError');
const { findAppointmentById } = require('../models/appointmentModel');
const {
  createAppointmentCheckin,
  findAppointmentCheckinById,
  findAppointmentCheckinByAppointmentId,
  getAllAppointmentCheckins,
  updateAppointmentCheckinById,
  deleteAppointmentCheckinById,
} = require('../models/appointmentCheckinModel');
const { updateAppointmentById } = require('../models/appointmentModel');

const createNewAppointmentCheckin = async (payload, authenticatedUserId) => {
  const appointment = await findAppointmentById(payload.appointmentId);

  if (!appointment) {
    throw new ApiError(404, 'La cita asociada no existe.');
  }

  const existingCheckin = await findAppointmentCheckinByAppointmentId(payload.appointmentId);

  if (existingCheckin) {
    throw new ApiError(409, 'La cita ya tiene un check-in registrado.');
  }

  const createdCheckin = await createAppointmentCheckin({
    appointmentId: payload.appointmentId,
    checkedInBy: authenticatedUserId,
    notes: payload.notes,
    createdBy: authenticatedUserId,
  });

  await updateAppointmentById(
    payload.appointmentId,
    { status: 'CHECKED_IN' },
    authenticatedUserId
  );

  return createdCheckin;
};

const listAppointmentCheckins = async () => {
  return getAllAppointmentCheckins();
};

const getAppointmentCheckinDetail = async (checkinId) => {
  const checkin = await findAppointmentCheckinById(checkinId);

  if (!checkin) {
    throw new ApiError(404, 'Check-in no encontrado.');
  }

  return checkin;
};

const updateAppointmentCheckin = async (checkinId, payload, authenticatedUserId) => {
  const currentCheckin = await findAppointmentCheckinById(checkinId);

  if (!currentCheckin) {
    throw new ApiError(404, 'Check-in no encontrado.');
  }

  return updateAppointmentCheckinById(checkinId, payload.notes, authenticatedUserId);
};

const deleteAppointmentCheckin = async (checkinId, authenticatedUserId) => {
  const currentCheckin = await findAppointmentCheckinById(checkinId);

  if (!currentCheckin) {
    throw new ApiError(404, 'Check-in no encontrado.');
  }

  const deletedCheckin = await deleteAppointmentCheckinById(checkinId);

  await updateAppointmentById(
    currentCheckin.appointment_id,
    { status: 'SCHEDULED' },
    authenticatedUserId
  );

  return deletedCheckin;
};

module.exports = {
  createNewAppointmentCheckin,
  listAppointmentCheckins,
  getAppointmentCheckinDetail,
  updateAppointmentCheckin,
  deleteAppointmentCheckin,
};