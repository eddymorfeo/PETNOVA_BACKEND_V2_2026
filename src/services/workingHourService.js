const ApiError = require('../utils/apiError');
const { findVeterinarianById } = require('../models/veterinarianModel');
const {
  createWorkingHour,
  findWorkingHourById,
  getAllWorkingHours,
  updateWorkingHourById,
  softDeleteWorkingHourById,
} = require('../models/workingHourModel');

const validateWorkingHourData = (payload) => {
  if (payload.weekday !== undefined) {
    if (payload.weekday < 0 || payload.weekday > 6) {
      throw new ApiError(400, 'weekday debe estar entre 0 y 6.');
    }
  }

  if (payload.slotMinutes !== undefined) {
    if (payload.slotMinutes <= 0) {
      throw new ApiError(400, 'slotMinutes debe ser mayor a 0.');
    }
  }

  if (payload.startTime && payload.endTime) {
    if (payload.startTime >= payload.endTime) {
      throw new ApiError(400, 'startTime debe ser menor que endTime.');
    }
  }
};

const createNewWorkingHour = async (payload, authenticatedUserId) => {
  const veterinarian = await findVeterinarianById(payload.veterinarianId);

  if (!veterinarian) {
    throw new ApiError(404, 'El veterinario asociado no existe.');
  }

  validateWorkingHourData(payload);

  return createWorkingHour({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listWorkingHours = async () => {
  return getAllWorkingHours();
};

const getWorkingHourDetail = async (workingHourId) => {
  const workingHour = await findWorkingHourById(workingHourId);

  if (!workingHour) {
    throw new ApiError(404, 'Horario no encontrado.');
  }

  return workingHour;
};

const updateWorkingHour = async (workingHourId, payload, authenticatedUserId) => {
  const currentWorkingHour = await findWorkingHourById(workingHourId);

  if (!currentWorkingHour) {
    throw new ApiError(404, 'Horario no encontrado.');
  }

  if (payload.veterinarianId) {
    const veterinarian = await findVeterinarianById(payload.veterinarianId);

    if (!veterinarian) {
      throw new ApiError(404, 'El veterinario asociado no existe.');
    }
  }

  const mergedData = {
    veterinarianId: payload.veterinarianId ?? currentWorkingHour.veterinarian_id,
    weekday: payload.weekday ?? currentWorkingHour.weekday,
    startTime: payload.startTime ?? currentWorkingHour.start_time,
    endTime: payload.endTime ?? currentWorkingHour.end_time,
    slotMinutes: payload.slotMinutes ?? currentWorkingHour.slot_minutes,
  };

  validateWorkingHourData(mergedData);

  return updateWorkingHourById(workingHourId, payload, authenticatedUserId);
};

const deleteWorkingHour = async (workingHourId, authenticatedUserId) => {
  const currentWorkingHour = await findWorkingHourById(workingHourId);

  if (!currentWorkingHour) {
    throw new ApiError(404, 'Horario no encontrado.');
  }

  return softDeleteWorkingHourById(workingHourId, authenticatedUserId);
};

module.exports = {
  createNewWorkingHour,
  listWorkingHours,
  getWorkingHourDetail,
  updateWorkingHour,
  deleteWorkingHour,
};