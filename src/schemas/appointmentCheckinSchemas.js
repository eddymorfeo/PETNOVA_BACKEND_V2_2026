const validateCreateAppointmentCheckin = (body) => {
  const { appointmentId, notes } = body;

  if (!appointmentId) {
    return {
      success: false,
      message: 'appointmentId es obligatorio.',
    };
  }

  if (typeof appointmentId !== 'string') {
    return {
      success: false,
      message: 'appointmentId debe ser texto.',
    };
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return {
      success: false,
      message: 'notes debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateAppointmentCheckin = (body) => {
  const { notes } = body;

  if (notes === undefined) {
    return {
      success: false,
      message: 'Debes enviar al menos el campo notes para actualizar.',
    };
  }

  if (typeof notes !== 'string') {
    return {
      success: false,
      message: 'notes debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateAppointmentCheckin,
  validateUpdateAppointmentCheckin,
};