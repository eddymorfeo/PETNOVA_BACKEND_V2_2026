const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreateAppointment = (body) => {
  const {
    veterinarianId,
    appointmentTypeId,
    clientId,
    petId,
    startsAt,
    endsAt,
    status,
    reason,
    bookedSource,
  } = body;

  if (!veterinarianId || !appointmentTypeId || !clientId || !petId || !startsAt || !endsAt || !bookedSource) {
    return {
      success: false,
      message: 'veterinarianId, appointmentTypeId, clientId, petId, startsAt, endsAt y bookedSource son obligatorios.',
    };
  }

  if (
    typeof veterinarianId !== 'string' ||
    typeof appointmentTypeId !== 'string' ||
    typeof clientId !== 'string' ||
    typeof petId !== 'string' ||
    typeof bookedSource !== 'string'
  ) {
    return {
      success: false,
      message: 'Los identificadores y bookedSource deben ser texto.',
    };
  }

  if (!isValidDateTimeString(startsAt) || !isValidDateTimeString(endsAt)) {
    return {
      success: false,
      message: 'startsAt y endsAt deben ser fechas válidas.',
    };
  }

  if (status !== undefined && typeof status !== 'string') {
    return {
      success: false,
      message: 'status debe ser texto.',
    };
  }

  if (reason !== undefined && typeof reason !== 'string') {
    return {
      success: false,
      message: 'reason debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateAppointment = (body) => {
  const {
    veterinarianId,
    appointmentTypeId,
    clientId,
    petId,
    startsAt,
    endsAt,
    status,
    reason,
    bookedSource,
    cancelReason,
  } = body;

  if (
    veterinarianId === undefined &&
    appointmentTypeId === undefined &&
    clientId === undefined &&
    petId === undefined &&
    startsAt === undefined &&
    endsAt === undefined &&
    status === undefined &&
    reason === undefined &&
    bookedSource === undefined &&
    cancelReason === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (veterinarianId !== undefined && typeof veterinarianId !== 'string') {
    return { success: false, message: 'veterinarianId debe ser texto.' };
  }

  if (appointmentTypeId !== undefined && typeof appointmentTypeId !== 'string') {
    return { success: false, message: 'appointmentTypeId debe ser texto.' };
  }

  if (clientId !== undefined && typeof clientId !== 'string') {
    return { success: false, message: 'clientId debe ser texto.' };
  }

  if (petId !== undefined && typeof petId !== 'string') {
    return { success: false, message: 'petId debe ser texto.' };
  }

  if (startsAt !== undefined && !isValidDateTimeString(startsAt)) {
    return { success: false, message: 'startsAt debe ser una fecha válida.' };
  }

  if (endsAt !== undefined && !isValidDateTimeString(endsAt)) {
    return { success: false, message: 'endsAt debe ser una fecha válida.' };
  }

  if (status !== undefined && typeof status !== 'string') {
    return { success: false, message: 'status debe ser texto.' };
  }

  if (reason !== undefined && typeof reason !== 'string') {
    return { success: false, message: 'reason debe ser texto.' };
  }

  if (bookedSource !== undefined && typeof bookedSource !== 'string') {
    return { success: false, message: 'bookedSource debe ser texto.' };
  }

  if (cancelReason !== undefined && typeof cancelReason !== 'string') {
    return { success: false, message: 'cancelReason debe ser texto.' };
  }

  return { success: true };
};

const validateDeleteAppointment = (body) => {
  const { cancelReason } = body;

  if (cancelReason !== undefined && typeof cancelReason !== 'string') {
    return {
      success: false,
      message: 'cancelReason debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateDeleteAppointment,
};