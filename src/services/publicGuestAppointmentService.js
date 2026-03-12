const ApiError = require('../utils/apiError');

const { getAllAppointmentTypes } = require('../models/appointmentTypeModel');
const { getAllVeterinarians } = require('../models/veterinarianModel');
const { createAppointment } = require('../models/appointmentModel');
const { createGuestBooking } = require('../models/guestBookingModel');
const {
  enqueueGuestAppointmentConfirmationEmail,
} = require('./email/emailNotificationService');
const { createAppointmentEvent } = require('../models/appointmentEventModel');

function buildStartsAt(date, time) {
  return new Date(`${date}T${time}:00`);
}

function buildEndsAt(startsAt, minutes = 30) {
  return new Date(startsAt.getTime() + minutes * 60000);
}

async function listPublicAppointmentTypes() {
  return getAllAppointmentTypes();
}

async function listPublicVeterinarians() {
  return getAllVeterinarians();
}

async function listPublicAvailableTimes({ veterinarianId, appointmentDate }) {
  if (!veterinarianId || !appointmentDate) {
    throw new ApiError(
      400,
      'veterinarianId y appointmentDate son obligatorios.'
    );
  }

  return [
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:30', label: '11:30' },
    { value: '16:00', label: '16:00' },
  ];
}

async function createPublicGuestAppointment(payload) {
  const startsAt = buildStartsAt(
    payload.appointment.appointmentDate,
    payload.appointment.appointmentTime
  );

  const endsAt = buildEndsAt(startsAt, 30);

  const availableTimes = await listPublicAvailableTimes({
    veterinarianId: payload.appointment.veterinarianId,
    appointmentDate: payload.appointment.appointmentDate,
  });

  const selectedTime = availableTimes.find(
    (item) => item.value === payload.appointment.appointmentTime
  );

  if (!selectedTime) {
    throw new ApiError(409, 'El horario seleccionado ya no está disponible.');
  }

  const appointmentTypes = await getAllAppointmentTypes();
  const veterinarians = await getAllVeterinarians();

  const selectedAppointmentType = appointmentTypes.find(
    (item) => item.id === payload.appointment.appointmentTypeId
  );

  const selectedVeterinarian = veterinarians.find(
    (item) => item.id === payload.appointment.veterinarianId
  );

  const appointment = await createAppointment({
    veterinarianId: payload.appointment.veterinarianId,
    appointmentTypeId: payload.appointment.appointmentTypeId,
    clientId: null,
    petId: null,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: 'SCHEDULED',
    reason: payload.appointment.reason,
    bookedSource: 'guest_portal',
    bookedByUserId: null,
    createdBy: null,
  });

  const guestBooking = await createGuestBooking({
    appointmentId: appointment.id,
    contactEmail: payload.contactEmail,
    contactName: payload.contactName,
    contactPhone: payload.contactPhone,
    invitationSentAt: null,
    convertedClientId: null,
    createdBy: null,
  });

  if (createAppointmentEvent) {
    await createAppointmentEvent({
      appointmentId: appointment.id,
      fromStatus: null,
      toStatus: 'SCHEDULED',
      changedByType: 'SYSTEM',
      changedById: null,
      note: 'Reserva pública creada desde landing.',
      createdBy: null,
    });
  }

  await enqueueGuestAppointmentConfirmationEmail({
    toEmail: payload.contactEmail,
    contactName: payload.contactName,
    petName: payload.pet.name,
    appointmentTypeName:
      selectedAppointmentType?.name || 'Consulta veterinaria',
    veterinarianName:
      selectedVeterinarian?.full_name ||
      selectedVeterinarian?.username ||
      'Profesional asignado',
    appointmentDate: payload.appointment.appointmentDate,
    appointmentTime: payload.appointment.appointmentTime,
    reason: payload.appointment.reason,
    createdBy: null,
  });

  return {
    appointmentId: appointment.id,
    guestBookingId: guestBooking.id,
    status: 'SCHEDULED',
  };
}

module.exports = {
  createPublicGuestAppointment,
  listPublicAppointmentTypes,
  listPublicVeterinarians,
  listPublicAvailableTimes,
};