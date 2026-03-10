const ApiError = require('../utils/apiError');
const { findVeterinarianById } = require('../models/veterinarianModel');
const { findAppointmentTypeById } = require('../models/appointmentTypeModel');
const { findClientById } = require('../models/clientModel');
const { findPetById } = require('../models/petModel');
const {
  createAppointment,
  findAppointmentById,
  getAllAppointments,
  updateAppointmentById,
  cancelAppointmentById,
} = require('../models/appointmentModel');

const validateAppointmentRange = (startsAt, endsAt) => {
  const starts = new Date(startsAt);
  const ends = new Date(endsAt);

  if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) {
    throw new ApiError(400, 'Las fechas ingresadas no son válidas.');
  }

  if (starts >= ends) {
    throw new ApiError(400, 'startsAt debe ser menor que endsAt.');
  }
};

const validateAppointmentRelations = async ({
  veterinarianId,
  appointmentTypeId,
  clientId,
  petId,
}) => {
  if (veterinarianId !== undefined) {
    const veterinarian = await findVeterinarianById(veterinarianId);
    if (!veterinarian) {
      throw new ApiError(404, 'El veterinario asociado no existe.');
    }
  }

  if (appointmentTypeId !== undefined) {
    const appointmentType = await findAppointmentTypeById(appointmentTypeId);
    if (!appointmentType) {
      throw new ApiError(404, 'El tipo de cita asociado no existe.');
    }
  }

  if (clientId !== undefined) {
    const client = await findClientById(clientId);
    if (!client) {
      throw new ApiError(404, 'El cliente asociado no existe.');
    }
  }

  if (petId !== undefined) {
    const pet = await findPetById(petId);
    if (!pet) {
      throw new ApiError(404, 'La mascota asociada no existe.');
    }
  }
};

const createNewAppointment = async (payload, authenticatedUserId) => {
  await validateAppointmentRelations({
    veterinarianId: payload.veterinarianId,
    appointmentTypeId: payload.appointmentTypeId,
    clientId: payload.clientId,
    petId: payload.petId,
  });

  validateAppointmentRange(payload.startsAt, payload.endsAt);

  return createAppointment({
    ...payload,
    status: payload.status || 'SCHEDULED',
    bookedByUserId: authenticatedUserId,
    createdBy: authenticatedUserId,
  });
};

const listAppointments = async () => {
  return getAllAppointments();
};

const getAppointmentDetail = async (appointmentId) => {
  const appointment = await findAppointmentById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, 'Cita no encontrada.');
  }

  return appointment;
};

const updateAppointment = async (appointmentId, payload, authenticatedUserId) => {
  const currentAppointment = await findAppointmentById(appointmentId);

  if (!currentAppointment) {
    throw new ApiError(404, 'Cita no encontrada.');
  }

  await validateAppointmentRelations({
    veterinarianId: payload.veterinarianId,
    appointmentTypeId: payload.appointmentTypeId,
    clientId: payload.clientId,
    petId: payload.petId,
  });

  const mergedStartsAt = payload.startsAt ?? currentAppointment.starts_at;
  const mergedEndsAt = payload.endsAt ?? currentAppointment.ends_at;

  validateAppointmentRange(mergedStartsAt, mergedEndsAt);

  return updateAppointmentById(appointmentId, payload, authenticatedUserId);
};

const deleteAppointment = async (appointmentId, cancelReason, authenticatedUserId) => {
  const currentAppointment = await findAppointmentById(appointmentId);

  if (!currentAppointment) {
    throw new ApiError(404, 'Cita no encontrada.');
  }

  return cancelAppointmentById(appointmentId, cancelReason, authenticatedUserId);
};

module.exports = {
  createNewAppointment,
  listAppointments,
  getAppointmentDetail,
  updateAppointment,
  deleteAppointment,
};