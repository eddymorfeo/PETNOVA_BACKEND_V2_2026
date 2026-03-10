const validateCreateMedicationAdministered = (body) => {
  const { consultationId, name, dose, route, notes } = body;

  if (!consultationId || !name) {
    return {
      success: false,
      message: 'consultationId y name son obligatorios.',
    };
  }

  if (typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  if (typeof name !== 'string') {
    return {
      success: false,
      message: 'name debe ser texto.',
    };
  }

  if (dose !== undefined && typeof dose !== 'string') {
    return {
      success: false,
      message: 'dose debe ser texto.',
    };
  }

  if (route !== undefined && typeof route !== 'string') {
    return {
      success: false,
      message: 'route debe ser texto.',
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

const validateUpdateMedicationAdministered = (body) => {
  const { name, dose, route, notes } = body;

  if (
    name === undefined &&
    dose === undefined &&
    route === undefined &&
    notes === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (name !== undefined && typeof name !== 'string') {
    return {
      success: false,
      message: 'name debe ser texto.',
    };
  }

  if (dose !== undefined && typeof dose !== 'string') {
    return {
      success: false,
      message: 'dose debe ser texto.',
    };
  }

  if (route !== undefined && typeof route !== 'string') {
    return {
      success: false,
      message: 'route debe ser texto.',
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
  validateCreateMedicationAdministered,
  validateUpdateMedicationAdministered,
};