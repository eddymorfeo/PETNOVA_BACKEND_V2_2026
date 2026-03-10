const ApiError = require('../utils/apiError');
const { findVeterinarianById } = require('../models/veterinarianModel');
const {
  createTimeOff,
  findTimeOffById,
  getAllTimeOff,
  updateTimeOffById,
  deleteTimeOffById,
} = require('../models/timeOffModel');

const validateTimeRange = (startsAt, endsAt) => {
  const starts = new Date(startsAt);
  const ends = new Date(endsAt);

  if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) {
    throw new ApiError(400, 'Las fechas ingresadas no son válidas.');
  }

  if (starts >= ends) {
    throw new ApiError(400, 'startsAt debe ser menor que endsAt.');
  }
};

const createNewTimeOff = async (payload, authenticatedUserId) => {
  const veterinarian = await findVeterinarianById(payload.veterinarianId);

  if (!veterinarian) {
    throw new ApiError(404, 'El veterinario asociado no existe.');
  }

  validateTimeRange(payload.startsAt, payload.endsAt);

  return createTimeOff({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listTimeOff = async () => {
  return getAllTimeOff();
};

const getTimeOffDetail = async (timeOffId) => {
  const timeOff = await findTimeOffById(timeOffId);

  if (!timeOff) {
    throw new ApiError(404, 'Bloqueo no encontrado.');
  }

  return timeOff;
};

const updateTimeOff = async (timeOffId, payload, authenticatedUserId) => {
  const currentTimeOff = await findTimeOffById(timeOffId);

  if (!currentTimeOff) {
    throw new ApiError(404, 'Bloqueo no encontrado.');
  }

  if (payload.veterinarianId) {
    const veterinarian = await findVeterinarianById(payload.veterinarianId);

    if (!veterinarian) {
      throw new ApiError(404, 'El veterinario asociado no existe.');
    }
  }

  const mergedStartsAt = payload.startsAt ?? currentTimeOff.starts_at;
  const mergedEndsAt = payload.endsAt ?? currentTimeOff.ends_at;

  validateTimeRange(mergedStartsAt, mergedEndsAt);

  return updateTimeOffById(timeOffId, payload, authenticatedUserId);
};

const removeTimeOff = async (timeOffId) => {
  const currentTimeOff = await findTimeOffById(timeOffId);

  if (!currentTimeOff) {
    throw new ApiError(404, 'Bloqueo no encontrado.');
  }

  return deleteTimeOffById(timeOffId);
};

module.exports = {
  createNewTimeOff,
  listTimeOff,
  getTimeOffDetail,
  updateTimeOff,
  removeTimeOff,
};