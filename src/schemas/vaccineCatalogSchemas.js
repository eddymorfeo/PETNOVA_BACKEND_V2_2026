const validateCreateVaccineCatalog = (body) => {
  const { code, name, description, speciesId } = body;

  if (!code || !name || !speciesId) {
    return {
      success: false,
      message: 'code, name y speciesId son obligatorios.',
    };
  }

  if (typeof code !== 'string') {
    return {
      success: false,
      message: 'code debe ser texto.',
    };
  }

  if (typeof name !== 'string') {
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

  if (typeof speciesId !== 'string') {
    return {
      success: false,
      message: 'speciesId debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateVaccineCatalog = (body) => {
  const { code, name, description, speciesId, isActive } = body;

  if (
    code === undefined &&
    name === undefined &&
    description === undefined &&
    speciesId === undefined &&
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

  if (speciesId !== undefined && typeof speciesId !== 'string') {
    return {
      success: false,
      message: 'speciesId debe ser texto.',
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
  validateCreateVaccineCatalog,
  validateUpdateVaccineCatalog,
};