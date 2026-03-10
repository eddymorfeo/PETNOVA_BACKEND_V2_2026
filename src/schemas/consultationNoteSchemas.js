const validateCreateConsultationNote = (body) => {
  const { consultationId, note } = body;

  if (!consultationId || !note) {
    return {
      success: false,
      message: 'consultationId y note son obligatorios.',
    };
  }

  if (typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  if (typeof note !== 'string') {
    return {
      success: false,
      message: 'note debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateConsultationNote = (body) => {
  const { note } = body;

  if (note === undefined) {
    return {
      success: false,
      message: 'Debes enviar el campo note para actualizar.',
    };
  }

  if (typeof note !== 'string') {
    return {
      success: false,
      message: 'note debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateConsultationNote,
  validateUpdateConsultationNote,
};