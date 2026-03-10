const ApiError = require('../utils/apiError');
const {
  createAppointmentType,
  findAppointmentTypeById,
  findAppointmentTypeByCode,
  getAllAppointmentTypes,
  updateAppointmentTypeById,
  softDeleteAppointmentTypeById,
} = require('../models/appointmentTypeModel');

const validateAppointmentTypeData = (payload) => {
  if (
    payload.defaultDurationMinutes !== undefined &&
    payload.defaultDurationMinutes <= 0
  ) {
    throw new ApiError(400, 'defaultDurationMinutes debe ser mayor a 0.');
  }
};

const createNewAppointmentType = async (payload, authenticatedUserId) => {
  const existingAppointmentType = await findAppointmentTypeByCode(payload.code);

  if (existingAppointmentType) {
    throw new ApiError(409, 'Ya existe un tipo de cita registrado con ese código.');
  }

  validateAppointmentTypeData(payload);

  return createAppointmentType({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listAppointmentTypes = async () => {
  return getAllAppointmentTypes();
};

const getAppointmentTypeDetail = async (appointmentTypeId) => {
  const appointmentType = await findAppointmentTypeById(appointmentTypeId);

  if (!appointmentType) {
    throw new ApiError(404, 'Tipo de cita no encontrado.');
  }

  return appointmentType;
};

const updateAppointmentType = async (appointmentTypeId, payload, authenticatedUserId) => {
  const currentAppointmentType = await findAppointmentTypeById(appointmentTypeId);

  if (!currentAppointmentType) {
    throw new ApiError(404, 'Tipo de cita no encontrado.');
  }

  if (payload.code && payload.code !== currentAppointmentType.code) {
    const existingAppointmentType = await findAppointmentTypeByCode(payload.code);

    if (existingAppointmentType && existingAppointmentType.id !== appointmentTypeId) {
      throw new ApiError(409, 'Ya existe un tipo de cita registrado con ese código.');
    }
  }

  validateAppointmentTypeData(payload);

  return updateAppointmentTypeById(appointmentTypeId, payload, authenticatedUserId);
};

const deleteAppointmentType = async (appointmentTypeId, authenticatedUserId) => {
  const currentAppointmentType = await findAppointmentTypeById(appointmentTypeId);

  if (!currentAppointmentType) {
    throw new ApiError(404, 'Tipo de cita no encontrado.');
  }

  return softDeleteAppointmentTypeById(appointmentTypeId, authenticatedUserId);
};

module.exports = {
  createNewAppointmentType,
  listAppointmentTypes,
  getAppointmentTypeDetail,
  updateAppointmentType,
  deleteAppointmentType,
};