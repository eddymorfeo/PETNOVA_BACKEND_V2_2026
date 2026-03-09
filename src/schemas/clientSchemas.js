const validateCreateClient = (body) => {
  const { fullName, email, phone, documentId, address } = body;

  if (!fullName || !email) {
    return {
      success: false,
      message: 'fullName y email son obligatorios.',
    };
  }

  if (typeof fullName !== 'string' || typeof email !== 'string') {
    return {
      success: false,
      message: 'fullName y email deben ser texto.',
    };
  }

  if (phone && typeof phone !== 'string') {
    return {
      success: false,
      message: 'phone debe ser texto.',
    };
  }

  if (documentId && typeof documentId !== 'string') {
    return {
      success: false,
      message: 'documentId debe ser texto.',
    };
  }

  if (address && typeof address !== 'string') {
    return {
      success: false,
      message: 'address debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateClient = (body) => {
  const { fullName, email, phone, documentId, address, isActive } = body;

  if (
    fullName === undefined &&
    email === undefined &&
    phone === undefined &&
    documentId === undefined &&
    address === undefined &&
    isActive === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (fullName !== undefined && typeof fullName !== 'string') {
    return {
      success: false,
      message: 'fullName debe ser texto.',
    };
  }

  if (email !== undefined && typeof email !== 'string') {
    return {
      success: false,
      message: 'email debe ser texto.',
    };
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return {
      success: false,
      message: 'phone debe ser texto.',
    };
  }

  if (documentId !== undefined && typeof documentId !== 'string') {
    return {
      success: false,
      message: 'documentId debe ser texto.',
    };
  }

  if (address !== undefined && typeof address !== 'string') {
    return {
      success: false,
      message: 'address debe ser texto.',
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
  validateCreateClient,
  validateUpdateClient,
};