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
const {
  enqueueAppointmentCreatedEmail,
  enqueueAppointmentRescheduledEmail,
  enqueueAppointmentUpdatedEmail,
  enqueueAppointmentCancelledEmail,
} = require('./email/emailNotificationService');

const APPOINTMENT_NOTIFICATION_TIME_ZONE =
  process.env.APP_TIMEZONE || 'America/Santiago';

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

const assertClientOwnership = (appointment, auth) => {
  if (auth?.type !== 'client') {
    return;
  }

  if (!appointment || appointment.client_id !== auth.sub) {
    throw new ApiError(403, 'No tienes permiso para acceder a esta cita.');
  }
};

const formatAppointmentDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es-CL', {
    timeZone: APPOINTMENT_NOTIFICATION_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const formatAppointmentTime = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es-CL', {
    timeZone: APPOINTMENT_NOTIFICATION_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const getAppointmentNotificationEmail = (appointment) => {
  return appointment?.client_email || appointment?.guest_contact_email || null;
};

const buildAppointmentNotificationPayload = (appointment) => {
  if (!appointment) {
    return null;
  }

  return {
    toEmail: getAppointmentNotificationEmail(appointment),
    petName: appointment.pet_name || 'No informada',
    appointmentDate: formatAppointmentDate(appointment.starts_at),
    appointmentTime: formatAppointmentTime(appointment.starts_at),
    veterinarianName: appointment.veterinarian_name || 'Profesional asignado',
  };
};

const valuesChanged = (left, right) => {
  if (left === undefined || right === undefined) {
    return false;
  }

  return String(left) !== String(right);
};

const appointmentDateTimeChanged = (currentAppointment, updatedAppointment) => {
  if (!currentAppointment || !updatedAppointment) {
    return false;
  }

  return (
    valuesChanged(currentAppointment.starts_at, updatedAppointment.starts_at) ||
    valuesChanged(currentAppointment.ends_at, updatedAppointment.ends_at) ||
    valuesChanged(currentAppointment.veterinarian_id, updatedAppointment.veterinarian_id)
  );
};

const notifyAppointmentCreated = async (appointment, createdBy) => {
  const payload = buildAppointmentNotificationPayload(appointment);

  if (!payload?.toEmail) {
    return;
  }

  await enqueueAppointmentCreatedEmail({
    ...payload,
    createdBy,
  });
};

const notifyAppointmentUpdated = async ({
  currentAppointment,
  updatedAppointment,
  cancelReason,
  updatedBy,
}) => {
  const payload = buildAppointmentNotificationPayload(updatedAppointment);

  if (!payload?.toEmail) {
    return;
  }

  if (
    updatedAppointment.status === 'CANCELLED' &&
    currentAppointment.status !== 'CANCELLED'
  ) {
    await enqueueAppointmentCancelledEmail({
      toEmail: payload.toEmail,
      cancelReason: cancelReason || updatedAppointment.cancel_reason,
      createdBy: updatedBy,
    });
    return;
  }

  if (appointmentDateTimeChanged(currentAppointment, updatedAppointment)) {
    await enqueueAppointmentRescheduledEmail({
      ...payload,
      createdBy: updatedBy,
    });
    return;
  }

  await enqueueAppointmentUpdatedEmail({
    ...payload,
    createdBy: updatedBy,
  });
};

const notifyAppointmentCancelled = async ({
  updatedAppointment,
  cancelReason,
  updatedBy,
}) => {
  const payload = buildAppointmentNotificationPayload(updatedAppointment);

  if (!payload?.toEmail) {
    return;
  }

  await enqueueAppointmentCancelledEmail({
    toEmail: payload.toEmail,
    cancelReason: cancelReason || updatedAppointment.cancel_reason,
    createdBy: updatedBy,
  });
};

const resolveCreateContext = async (payload, auth) => {
  const isClient = auth?.type === 'client';
  const authenticatedUserId = !isClient ? auth?.sub ?? null : null;
  const resolvedClientId = isClient ? auth.sub : payload.clientId;

  if (!resolvedClientId) {
    throw new ApiError(400, 'clientId es obligatorio.');
  }

  const pet = payload.petId ? await findPetById(payload.petId) : null;

  if (payload.petId && !pet) {
    throw new ApiError(404, 'La mascota asociada no existe.');
  }

  if (isClient && payload.clientId && payload.clientId !== auth.sub) {
    throw new ApiError(403, 'No puedes registrar citas para otro cliente.');
  }

  if (isClient && pet && pet.client_id !== auth.sub) {
    throw new ApiError(403, 'No puedes registrar citas para una mascota de otro cliente.');
  }

  await validateAppointmentRelations({
    veterinarianId: payload.veterinarianId,
    appointmentTypeId: payload.appointmentTypeId,
    clientId: resolvedClientId,
    petId: payload.petId,
  });

  return {
    authenticatedUserId,
    resolvedClientId,
  };
};

const createNewAppointment = async (payload, auth) => {
  const { authenticatedUserId, resolvedClientId } = await resolveCreateContext(
    payload,
    auth,
  );

  validateAppointmentRange(payload.startsAt, payload.endsAt);

  const appointment = await createAppointment({
    ...payload,
    clientId: resolvedClientId,
    status: payload.status || 'SCHEDULED',
    bookedByUserId: authenticatedUserId,
    createdBy: authenticatedUserId,
  });

  const detailedAppointment = await findAppointmentById(appointment.id);

  await notifyAppointmentCreated(
    detailedAppointment || appointment,
    authenticatedUserId,
  );

  return detailedAppointment || appointment;
};

const listAppointments = async (auth = null) => {
  const appointments = await getAllAppointments();

  if (auth?.type === 'client') {
    return appointments.filter((appointment) => appointment.client_id === auth.sub);
  }

  return appointments;
};

const listMyAppointments = async (auth) => {
  if (auth?.type !== 'client') {
    throw new ApiError(403, 'Este endpoint está disponible solo para clientes autenticados.');
  }

  return listAppointments(auth);
};

const getAppointmentDetail = async (appointmentId, auth = null) => {
  const appointment = await findAppointmentById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, 'Cita no encontrada.');
  }

  assertClientOwnership(appointment, auth);

  return appointment;
};

const updateAppointment = async (appointmentId, payload, auth) => {
  const currentAppointment = await findAppointmentById(appointmentId);

  if (!currentAppointment) {
    throw new ApiError(404, 'Cita no encontrada.');
  }

  assertClientOwnership(currentAppointment, auth);

  if (auth?.type === 'client') {
    if (payload.clientId && payload.clientId !== auth.sub) {
      throw new ApiError(403, 'No puedes reasignar la cita a otro cliente.');
    }

    if (payload.petId) {
      const pet = await findPetById(payload.petId);

      if (!pet) {
        throw new ApiError(404, 'La mascota asociada no existe.');
      }

      if (pet.client_id !== auth.sub) {
        throw new ApiError(403, 'No puedes asociar la cita a una mascota de otro cliente.');
      }
    }
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

  const authenticatedUserId = auth?.type === 'client' ? null : auth?.sub ?? null;

  await updateAppointmentById(appointmentId, payload, authenticatedUserId);

  const updatedAppointment = await findAppointmentById(appointmentId);

  await notifyAppointmentUpdated({
    currentAppointment,
    updatedAppointment,
    cancelReason: payload.cancelReason,
    updatedBy: authenticatedUserId,
  });

  return updatedAppointment;
};

const deleteAppointment = async (appointmentId, cancelReason, auth) => {
  const currentAppointment = await findAppointmentById(appointmentId);

  if (!currentAppointment) {
    throw new ApiError(404, 'Cita no encontrada.');
  }

  assertClientOwnership(currentAppointment, auth);

  const authenticatedUserId = auth?.type === 'client' ? null : auth?.sub ?? null;

  await cancelAppointmentById(appointmentId, cancelReason, authenticatedUserId);

  const updatedAppointment = await findAppointmentById(appointmentId);

  await notifyAppointmentCancelled({
    updatedAppointment,
    cancelReason,
    updatedBy: authenticatedUserId,
  });

  return updatedAppointment;
};

module.exports = {
  createNewAppointment,
  listAppointments,
  listMyAppointments,
  getAppointmentDetail,
  updateAppointment,
  deleteAppointment,
};
