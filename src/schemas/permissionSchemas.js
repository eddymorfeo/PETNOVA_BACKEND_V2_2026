const validateCreatePermission = (body) => {
  const { code, name, description, module } = body;

  if (!code || !name || !module) {
    return {
      success: false,
      message: 'code, name y module son obligatorios.',
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

  if (typeof module !== 'string') {
    return {
      success: false,
      message: 'module debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdatePermission = (body) => {
  const { code, name, description, module, isActive } = body;

  if (
    code === undefined &&
    name === undefined &&
    description === undefined &&
    module === undefined &&
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

  if (module !== undefined && typeof module !== 'string') {
    return {
      success: false,
      message: 'module debe ser texto.',
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
  validateCreatePermission,
  validateUpdatePermission,
};