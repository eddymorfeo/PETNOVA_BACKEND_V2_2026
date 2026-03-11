const validateCreateAppointmentEvent = (body) => {
  const {
    appointmentId,
    fromStatus,
    toStatus,
    changedByType,
    changedById,
    note,
  } = body;

  if (!appointmentId || !toStatus) {
    return {
      success: false,
      message: 'appointmentId y toStatus son obligatorios.',
    };
  }

  if (typeof appointmentId !== 'string') {
    return {
      success: false,
      message: 'appointmentId debe ser texto.',
    };
  }

  if (fromStatus !== undefined && typeof fromStatus !== 'string') {
    return {
      success: false,
      message: 'fromStatus debe ser texto.',
    };
  }

  if (typeof toStatus !== 'string') {
    return {
      success: false,
      message: 'toStatus debe ser texto.',
    };
  }

  if (changedByType !== undefined && typeof changedByType !== 'string') {
    return {
      success: false,
      message: 'changedByType debe ser texto.',
    };
  }

  if (changedById !== undefined && typeof changedById !== 'string') {
    return {
      success: false,
      message: 'changedById debe ser texto.',
    };
  }

  if (note !== undefined && typeof note !== 'string') {
    return {
      success: false,
      message: 'note debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateAppointmentEvent = (body) => {
  const {
    fromStatus,
    toStatus,
    changedByType,
    changedById,
    note,
  } = body;

  if (
    fromStatus === undefined &&
    toStatus === undefined &&
    changedByType === undefined &&
    changedById === undefined &&
    note === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (fromStatus !== undefined && typeof fromStatus !== 'string') {
    return {
      success: false,
      message: 'fromStatus debe ser texto.',
    };
  }

  if (toStatus !== undefined && typeof toStatus !== 'string') {
    return {
      success: false,
      message: 'toStatus debe ser texto.',
    };
  }

  if (changedByType !== undefined && typeof changedByType !== 'string') {
    return {
      success: false,
      message: 'changedByType debe ser texto.',
    };
  }

  if (changedById !== undefined && typeof changedById !== 'string') {
    return {
      success: false,
      message: 'changedById debe ser texto.',
    };
  }

  if (note !== undefined && typeof note !== 'string') {
    return {
      success: false,
      message: 'note debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateAppointmentEvent,
  validateUpdateAppointmentEvent,
};