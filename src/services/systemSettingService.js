const ApiError = require('../utils/apiError');
const {
  getAllSystemSettings,
  findSystemSettingById,
  updateSystemSettingById,
} = require('../models/systemSettingModel');

const validateSystemSettingValues = (payload) => {
  if (
    payload.appointmentSlotMinutes !== undefined &&
    payload.appointmentSlotMinutes <= 0
  ) {
    throw new ApiError(400, 'appointmentSlotMinutes debe ser mayor a 0.');
  }

  if (
    payload.clientCancelHoursLimit !== undefined &&
    payload.clientCancelHoursLimit < 0
  ) {
    throw new ApiError(400, 'clientCancelHoursLimit no puede ser negativo.');
  }

  if (
    payload.clientRescheduleHoursLimit !== undefined &&
    payload.clientRescheduleHoursLimit < 0
  ) {
    throw new ApiError(400, 'clientRescheduleHoursLimit no puede ser negativo.');
  }

  if (
    payload.reminderHoursBefore !== undefined &&
    payload.reminderHoursBefore < 0
  ) {
    throw new ApiError(400, 'reminderHoursBefore no puede ser negativo.');
  }
};

const listSystemSettings = async () => {
  return getAllSystemSettings();
};

const getSystemSettingDetail = async (systemSettingId) => {
  const systemSetting = await findSystemSettingById(systemSettingId);

  if (!systemSetting) {
    throw new ApiError(404, 'Configuración del sistema no encontrada.');
  }

  return systemSetting;
};

const updateSystemSetting = async (systemSettingId, payload, authenticatedUserId) => {
  const currentSystemSetting = await findSystemSettingById(systemSettingId);

  if (!currentSystemSetting) {
    throw new ApiError(404, 'Configuración del sistema no encontrada.');
  }

  validateSystemSettingValues(payload);

  return updateSystemSettingById(systemSettingId, payload, authenticatedUserId);
};

module.exports = {
  listSystemSettings,
  getSystemSettingDetail,
  updateSystemSetting,
};