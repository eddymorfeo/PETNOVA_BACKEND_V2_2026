const validateCreateAppointmentType = (body) => {
  const { code, name, description, defaultDurationMinutes } = body;

  if (!code || !name || defaultDurationMinutes === undefined) {
    return {
      success: false,
      message: 'code, name y defaultDurationMinutes son obligatorios.',
    };
  }

  if (typeof code !== 'string' || typeof name !== 'string') {
    return {
      success: false,
      message: 'code y name deben ser texto.',
    };
  }

  if (description !== undefined && typeof description !== 'string') {
    return {
      success: false,
      message: 'description debe ser texto.',
    };
  }

  if (typeof defaultDurationMinutes !== 'number') {
    return {
      success: false,
      message: 'defaultDurationMinutes debe ser numérico.',
    };
  }

  return { success: true };
};

const validateUpdateAppointmentType = (body) => {
  const { code, name, description, defaultDurationMinutes, isActive } = body;

  if (
    code === undefined &&
    name === undefined &&
    description === undefined &&
    defaultDurationMinutes === undefined &&
    isActive === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (code !== undefined && typeof code !== 'string') {
    return {
      success: false,
      message: 'code debe ser texto.',
    };
  }

  if (name !== undefined && typeof name !== 'string') {
    return {
      success: false,
      message: 'name debe ser texto.',
    };
  }

  if (description !== undefined && typeof description !== 'string') {
    return {
      success: false,
      message: 'description debe ser texto.',
    };
  }

  if (defaultDurationMinutes !== undefined && typeof defaultDurationMinutes !== 'number') {
    return {
      success: false,
      message: 'defaultDurationMinutes debe ser numérico.',
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
  validateCreateAppointmentType,
  validateUpdateAppointmentType,
};