const { createEmailOutbox } = require('../../models/emailOutboxModel');

const enqueueEmail = async ({
  toEmail,
  template,
  payload,
  scheduledFor = null,
  createdBy = null,
}) => {
  return createEmailOutbox({
    toEmail,
    template,
    payload,
    scheduledFor,
    createdBy,
  });
};

const enqueueGuestAppointmentConfirmationEmail = async ({
  toEmail,
  contactName,
  petName,
  appointmentTypeName,
  veterinarianName,
  appointmentDate,
  appointmentTime,
  reason,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'guest_appointment_confirmation',
    payload: {
      contactName,
      petName,
      appointmentTypeName,
      veterinarianName,
      appointmentDate,
      appointmentTime,
      reason,
    },
    createdBy,
  });
};

const enqueueAccountCreatedEmail = async ({
  toEmail,
  fullName,
  email,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'account_created',
    payload: {
      fullName,
      email,
    },
    createdBy,
  });
};

const enqueuePasswordResetEmail = async ({
  toEmail,
  token,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'password_reset',
    payload: {
      token,
    },
    createdBy,
  });
};

const enqueuePetCreatedEmail = async ({
  toEmail,
  petName,
  species,
  breed,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'pet_created',
    payload: {
      petName,
      species,
      breed,
    },
    createdBy,
  });
};

const enqueueUserProfileUpdatedEmail = async ({
  toEmail,
  fullName,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'user_profile_updated',
    payload: {
      fullName,
    },
    createdBy,
  });
};

const enqueueAppointmentCreatedEmail = async ({
  toEmail,
  petName,
  appointmentDate,
  appointmentTime,
  veterinarianName,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'appointment_created',
    payload: {
      petName,
      appointmentDate,
      appointmentTime,
      veterinarianName,
    },
    createdBy,
  });
};

const enqueueAppointmentRescheduledEmail = async ({
  toEmail,
  appointmentDate,
  appointmentTime,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'appointment_rescheduled',
    payload: {
      appointmentDate,
      appointmentTime,
    },
    createdBy,
  });
};

const enqueueAppointmentCancelledEmail = async ({
  toEmail,
  cancelReason,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'appointment_cancelled',
    payload: {
      cancelReason,
    },
    createdBy,
  });
};

const enqueueAppointmentReminderEmail = async ({
  toEmail,
  petName,
  appointmentDate,
  appointmentTime,
  scheduledFor,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'appointment_reminder',
    payload: {
      petName,
      appointmentDate,
      appointmentTime,
    },
    scheduledFor,
    createdBy,
  });
};

const enqueuePasswordChangedEmail = async ({
  toEmail,
  fullName,
  createdBy = null,
}) => {
  return enqueueEmail({
    toEmail,
    template: 'password_changed',
    payload: {
      fullName,
    },
    createdBy,
  });
};

module.exports = {
  enqueueEmail,
  enqueueGuestAppointmentConfirmationEmail,
  enqueueAccountCreatedEmail,
  enqueuePasswordResetEmail,
  enqueuePetCreatedEmail,
  enqueueUserProfileUpdatedEmail,
  enqueueAppointmentCreatedEmail,
  enqueueAppointmentRescheduledEmail,
  enqueueAppointmentCancelledEmail,
  enqueueAppointmentReminderEmail,
  enqueuePasswordChangedEmail,
};