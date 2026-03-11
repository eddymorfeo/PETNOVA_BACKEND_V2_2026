const ApiError = require('../utils/apiError');
const {
  createEmailOutbox,
  findEmailOutboxById,
  getAllEmailOutbox,
  updateEmailOutboxById,
  deleteEmailOutboxById,
} = require('../models/emailOutboxModel');

const validateEmailOutboxDates = (scheduledFor, sentAt) => {
  if (scheduledFor !== undefined && scheduledFor !== null) {
    const scheduledDate = new Date(scheduledFor);

    if (Number.isNaN(scheduledDate.getTime())) {
      throw new ApiError(400, 'scheduledFor debe ser una fecha válida.');
    }
  }

  if (sentAt !== undefined && sentAt !== null) {
    const sentDate = new Date(sentAt);

    if (Number.isNaN(sentDate.getTime())) {
      throw new ApiError(400, 'sentAt debe ser una fecha válida.');
    }
  }
};

const createNewEmailOutbox = async (payload, authenticatedUserId) => {
  validateEmailOutboxDates(payload.scheduledFor, payload.sentAt);

  return createEmailOutbox({
    toEmail: payload.toEmail,
    template: payload.template,
    payload: payload.payload,
    status: payload.status,
    lastError: payload.lastError,
    scheduledFor: payload.scheduledFor,
    sentAt: payload.sentAt,
    createdBy: authenticatedUserId,
  });
};

const listEmailOutbox = async () => {
  return getAllEmailOutbox();
};

const getEmailOutboxDetail = async (emailOutboxId) => {
  const email = await findEmailOutboxById(emailOutboxId);

  if (!email) {
    throw new ApiError(404, 'Registro de email_outbox no encontrado.');
  }

  return email;
};

const updateEmailOutbox = async (emailOutboxId, payload, authenticatedUserId) => {
  const currentEmail = await findEmailOutboxById(emailOutboxId);

  if (!currentEmail) {
    throw new ApiError(404, 'Registro de email_outbox no encontrado.');
  }

  validateEmailOutboxDates(
    payload.scheduledFor ?? currentEmail.scheduled_for,
    payload.sentAt ?? currentEmail.sent_at
  );

  return updateEmailOutboxById(emailOutboxId, payload, authenticatedUserId);
};

const deleteEmailOutbox = async (emailOutboxId) => {
  const currentEmail = await findEmailOutboxById(emailOutboxId);

  if (!currentEmail) {
    throw new ApiError(404, 'Registro de email_outbox no encontrado.');
  }

  return deleteEmailOutboxById(emailOutboxId);
};

module.exports = {
  createNewEmailOutbox,
  listEmailOutbox,
  getEmailOutboxDetail,
  updateEmailOutbox,
  deleteEmailOutbox,
};