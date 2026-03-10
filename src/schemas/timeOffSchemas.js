const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreateTimeOff = (body) => {
  const { veterinarianId, startsAt, endsAt, reason } = body;

  if (!veterinarianId || !startsAt || !endsAt) {
    return {
      success: false,
      message: 'veterinarianId, startsAt y endsAt son obligatorios.',
    };
  }

  if (typeof veterinarianId !== 'string') {
    return {
      success: false,
      message: 'veterinarianId debe ser texto.',
    };
  }

  if (!isValidDateTimeString(startsAt) || !isValidDateTimeString(endsAt)) {
    return {
      success: false,
      message: 'startsAt y endsAt deben ser fechas válidas.',
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

const validateUpdateTimeOff = (body) => {
  const { veterinarianId, startsAt, endsAt, reason } = body;

  if (
    veterinarianId === undefined &&
    startsAt === undefined &&
    endsAt === undefined &&
    reason === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (veterinarianId !== undefined && typeof veterinarianId !== 'string') {
    return {
      success: false,
      message: 'veterinarianId debe ser texto.',
    };
  }

  if (startsAt !== undefined && !isValidDateTimeString(startsAt)) {
    return {
      success: false,
      message: 'startsAt debe ser una fecha válida.',
    };
  }

  if (endsAt !== undefined && !isValidDateTimeString(endsAt)) {
    return {
      success: false,
      message: 'endsAt debe ser una fecha válida.',
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

module.exports = {
  validateCreateTimeOff,
  validateUpdateTimeOff,
};