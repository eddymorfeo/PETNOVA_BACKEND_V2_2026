const validateCreateSpecies = (body) => {
  const { code, name } = body;

  if (!code || !name) {
    return {
      success: false,
      message: 'code y name son obligatorios.',
    };
  }

  if (typeof code !== 'string' || typeof name !== 'string') {
    return {
      success: false,
      message: 'code y name deben ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateSpecies = (body) => {
  const { code, name, isActive } = body;

  if (code === undefined && name === undefined && isActive === undefined) {
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

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return {
      success: false,
      message: 'isActive debe ser boolean.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateSpecies,
  validateUpdateSpecies,
};