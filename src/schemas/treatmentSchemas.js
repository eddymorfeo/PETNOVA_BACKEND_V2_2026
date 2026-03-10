const validateCreateTreatment = (body) => {
  const { consultationId, description } = body;

  if (!consultationId || !description) {
    return {
      success: false,
      message: 'consultationId y description son obligatorios.',
    };
  }

  if (typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  if (typeof description !== 'string') {
    return {
      success: false,
      message: 'description debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateTreatment = (body) => {
  const { description } = body;

  if (description === undefined) {
    return {
      success: false,
      message: 'Debes enviar el campo description para actualizar.',
    };
  }

  if (typeof description !== 'string') {
    return {
      success: false,
      message: 'description debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateTreatment,
  validateUpdateTreatment,
};