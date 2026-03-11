const ApiError = require('../utils/apiError');
const { findAppointmentById } = require('../models/appointmentModel');
const { findUserById } = require('../models/userModel');
const { findClientById } = require('../models/clientModel');
const {
  createAppointmentEvent,
  findAppointmentEventById,
  getAllAppointmentEvents,
  updateAppointmentEventById,
  deleteAppointmentEventById,
} = require('../models/appointmentEventModel');

const validateChangedBy = async (changedByType, changedById) => {
  if (!changedByType && !changedById) {
    return;
  }

  if (!changedByType || !changedById) {
    throw new ApiError(400, 'changedByType y changedById deben enviarse juntos.');
  }

  if (changedByType === 'USER') {
    const user = await findUserById(changedById);

    if (!user) {
      throw new ApiError(404, 'El usuario asociado no existe.');
    }

    return;
  }

  if (changedByType === 'CLIENT') {
    const client = await findClientById(changedById);

    if (!client) {
      throw new ApiError(404, 'El cliente asociado no existe.');
    }

    return;
  }

  if (changedByType === 'SYSTEM') {
    return;
  }

  throw new ApiError(400, 'changedByType debe ser USER, CLIENT o SYSTEM.');
};

const createNewAppointmentEvent = async (payload, authenticatedUserId) => {
  const appointment = await findAppointmentById(payload.appointmentId);

  if (!appointment) {
    throw new ApiError(404, 'La cita asociada no existe.');
  }

  await validateChangedBy(payload.changedByType, payload.changedById);

  return createAppointmentEvent({
    appointmentId: payload.appointmentId,
    fromStatus: payload.fromStatus,
    toStatus: payload.toStatus,
    changedByType: payload.changedByType,
    changedById: payload.changedById,
    note: payload.note,
    createdBy: authenticatedUserId,
  });
};

const listAppointmentEvents = async () => {
  return getAllAppointmentEvents();
};

const getAppointmentEventDetail = async (appointmentEventId) => {
  const event = await findAppointmentEventById(appointmentEventId);

  if (!event) {
    throw new ApiError(404, 'Evento de cita no encontrado.');
  }

  return event;
};

const updateAppointmentEvent = async (appointmentEventId, payload) => {
  const currentEvent = await findAppointmentEventById(appointmentEventId);

  if (!currentEvent) {
    throw new ApiError(404, 'Evento de cita no encontrado.');
  }

  const changedByType = payload.changedByType ?? currentEvent.changed_by_type;
  const changedById = payload.changedById ?? currentEvent.changed_by_id;

  await validateChangedBy(changedByType, changedById);

  return updateAppointmentEventById(appointmentEventId, payload);
};

const deleteAppointmentEvent = async (appointmentEventId) => {
  const currentEvent = await findAppointmentEventById(appointmentEventId);

  if (!currentEvent) {
    throw new ApiError(404, 'Evento de cita no encontrado.');
  }

  return deleteAppointmentEventById(appointmentEventId);
};

module.exports = {
  createNewAppointmentEvent,
  listAppointmentEvents,
  getAppointmentEventDetail,
  updateAppointmentEvent,
  deleteAppointmentEvent,
};