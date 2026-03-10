const isValidTimeString = (value) => {
  return typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value);
};

const validateCreateWorkingHour = (body) => {
  const {
    veterinarianId,
    weekday,
    startTime,
    endTime,
    slotMinutes,
  } = body;

  if (
    !veterinarianId &&
    veterinarianId !== ''
  ) {
    return {
      success: false,
      message: 'veterinarianId es obligatorio.',
    };
  }

  if (
    weekday === undefined ||
    !startTime ||
    !endTime ||
    slotMinutes === undefined
  ) {
    return {
      success: false,
      message: 'weekday, startTime, endTime y slotMinutes son obligatorios.',
    };
  }

  if (typeof veterinarianId !== 'string') {
    return {
      success: false,
      message: 'veterinarianId debe ser texto.',
    };
  }

  if (typeof weekday !== 'number') {
    return {
      success: false,
      message: 'weekday debe ser numérico.',
    };
  }

  if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) {
    return {
      success: false,
      message: 'startTime y endTime deben tener formato HH:mm o HH:mm:ss.',
    };
  }

  if (typeof slotMinutes !== 'number') {
    return {
      success: false,
      message: 'slotMinutes debe ser numérico.',
    };
  }

  return { success: true };
};

const validateUpdateWorkingHour = (body) => {
  const {
    veterinarianId,
    weekday,
    startTime,
    endTime,
    slotMinutes,
    isActive,
  } = body;

  if (
    veterinarianId === undefined &&
    weekday === undefined &&
    startTime === undefined &&
    endTime === undefined &&
    slotMinutes === undefined &&
    isActive === undefined
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

  if (weekday !== undefined && typeof weekday !== 'number') {
    return {
      success: false,
      message: 'weekday debe ser numérico.',
    };
  }

  if (startTime !== undefined && !isValidTimeString(startTime)) {
    return {
      success: false,
      message: 'startTime debe tener formato HH:mm o HH:mm:ss.',
    };
  }

  if (endTime !== undefined && !isValidTimeString(endTime)) {
    return {
      success: false,
      message: 'endTime debe tener formato HH:mm o HH:mm:ss.',
    };
  }

  if (slotMinutes !== undefined && typeof slotMinutes !== 'number') {
    return {
      success: false,
      message: 'slotMinutes debe ser numérico.',
    };
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return {
      success: false,
      message: 'isActive debe ser boolean.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateWorkingHour,
  validateUpdateWorkingHour,
};