const ApiError = require('../utils/apiError');
const { findClientById } = require('../models/clientModel');
const { findPetById } = require('../models/petModel');
const {
  createReminder,
  findReminderById,
  getAllReminders,
  updateReminderById,
  deleteReminderById,
} = require('../models/reminderModel');

const validateReminderDates = (dueAt, sentAt) => {
  const dueDate = new Date(dueAt);

  if (Number.isNaN(dueDate.getTime())) {
    throw new ApiError(400, 'dueAt debe ser una fecha válida.');
  }

  if (sentAt !== undefined && sentAt !== null) {
    const sentDate = new Date(sentAt);

    if (Number.isNaN(sentDate.getTime())) {
      throw new ApiError(400, 'sentAt debe ser una fecha válida.');
    }
  }
};

const createNewReminder = async (payload, authenticatedUserId) => {
  const client = await findClientById(payload.clientId);

  if (!client) {
    throw new ApiError(404, 'El cliente asociado no existe.');
  }

  const pet = await findPetById(payload.petId);

  if (!pet) {
    throw new ApiError(404, 'La mascota asociada no existe.');
  }

  validateReminderDates(payload.dueAt, payload.sentAt);

  return createReminder({
    clientId: payload.clientId,
    petId: payload.petId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    dueAt: payload.dueAt,
    sentAt: payload.sentAt,
    status: payload.status,
    createdBy: authenticatedUserId,
  });
};

const listReminders = async () => {
  return getAllReminders();
};

const getReminderDetail = async (reminderId) => {
  const reminder = await findReminderById(reminderId);

  if (!reminder) {
    throw new ApiError(404, 'Recordatorio no encontrado.');
  }

  return reminder;
};

const updateReminder = async (reminderId, payload, authenticatedUserId) => {
  const currentReminder = await findReminderById(reminderId);

  if (!currentReminder) {
    throw new ApiError(404, 'Recordatorio no encontrado.');
  }

  const mergedDueAt = payload.dueAt ?? currentReminder.due_at;
  const mergedSentAt = payload.sentAt ?? currentReminder.sent_at;

  validateReminderDates(mergedDueAt, mergedSentAt);

  return updateReminderById(reminderId, payload, authenticatedUserId);
};

const deleteReminder = async (reminderId) => {
  const currentReminder = await findReminderById(reminderId);

  if (!currentReminder) {
    throw new ApiError(404, 'Recordatorio no encontrado.');
  }

  return deleteReminderById(reminderId);
};

module.exports = {
  createNewReminder,
  listReminders,
  getReminderDetail,
  updateReminder,
  deleteReminder,
};