const validateCreateVeterinarian = (body) => {
  const { userId, licenseNumber, specialtyId } = body;

  if (!userId) {
    return {
      success: false,
      message: 'userId es obligatorio.',
    };
  }

  if (typeof userId !== 'string') {
    return {
      success: false,
      message: 'userId debe ser texto.',
    };
  }

  if (licenseNumber !== undefined && typeof licenseNumber !== 'string') {
    return {
      success: false,
      message: 'licenseNumber debe ser texto.',
    };
  }

  if (specialtyId !== undefined && typeof specialtyId !== 'string') {
    return {
      success: false,
      message: 'specialtyId debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateVeterinarian = (body) => {
  const { userId, licenseNumber, specialtyId, isActive } = body;

  if (
    userId === undefined &&
    licenseNumber === undefined &&
    specialtyId === undefined &&
    isActive === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (userId !== undefined && typeof userId !== 'string') {
    return {
      success: false,
      message: 'userId debe ser texto.',
    };
  }

  if (licenseNumber !== undefined && typeof licenseNumber !== 'string') {
    return {
      success: false,
      message: 'licenseNumber debe ser texto.',
    };
  }

  if (specialtyId !== undefined && typeof specialtyId !== 'string') {
    return {
      success: false,
      message: 'specialtyId debe ser texto.',
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
  validateCreateVeterinarian,
  validateUpdateVeterinarian,
};