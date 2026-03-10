const validateCreatePrescription = (body) => {
  const {
    consultationId,
    medicationName,
    dose,
    frequency,
    duration,
    notes,
  } = body;

  if (!consultationId || !medicationName || !dose || !frequency || !duration) {
    return {
      success: false,
      message: 'consultationId, medicationName, dose, frequency y duration son obligatorios.',
    };
  }

  if (typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  if (typeof medicationName !== 'string') {
    return {
      success: false,
      message: 'medicationName debe ser texto.',
    };
  }

  if (typeof dose !== 'string') {
    return {
      success: false,
      message: 'dose debe ser texto.',
    };
  }

  if (typeof frequency !== 'string') {
    return {
      success: false,
      message: 'frequency debe ser texto.',
    };
  }

  if (typeof duration !== 'string') {
    return {
      success: false,
      message: 'duration debe ser texto.',
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

const validateUpdatePrescription = (body) => {
  const {
    medicationName,
    dose,
    frequency,
    duration,
    notes,
  } = body;

  if (
    medicationName === undefined &&
    dose === undefined &&
    frequency === undefined &&
    duration === undefined &&
    notes === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (medicationName !== undefined && typeof medicationName !== 'string') {
    return {
      success: false,
      message: 'medicationName debe ser texto.',
    };
  }

  if (dose !== undefined && typeof dose !== 'string') {
    return {
      success: false,
      message: 'dose debe ser texto.',
    };
  }

  if (frequency !== undefined && typeof frequency !== 'string') {
    return {
      success: false,
      message: 'frequency debe ser texto.',
    };
  }

  if (duration !== undefined && typeof duration !== 'string') {
    return {
      success: false,
      message: 'duration debe ser texto.',
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

module.exports = {
  validateCreatePrescription,
  validateUpdatePrescription,
};