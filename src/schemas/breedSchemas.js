const validateCreateBreed = (body) => {
  const { speciesId, name } = body;

  if (!speciesId || !name) {
    return {
      success: false,
      message: 'speciesId y name son obligatorios.',
    };
  }

  if (typeof speciesId !== 'string' || typeof name !== 'string') {
    return {
      success: false,
      message: 'speciesId y name deben ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateBreed = (body) => {
  const { speciesId, name, isActive } = body;

  if (speciesId === undefined && name === undefined && isActive === undefined) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (speciesId !== undefined && typeof speciesId !== 'string') {
    return {
      success: false,
      message: 'speciesId debe ser texto.',
    };
  }

  if (name !== undefined && typeof name !== 'string') {
    return {
      success: false,
      message: 'name debe ser texto.',
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
  validateCreateBreed,
  validateUpdateBreed,
};