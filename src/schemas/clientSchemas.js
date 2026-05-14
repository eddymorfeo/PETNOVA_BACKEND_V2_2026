const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isOptionalText = (value) =>
  value === undefined || value === null || typeof value === 'string';

const validateCreateClient = (body) => {
  const { fullName, email, password, phone, documentId, address } = body;

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

  if (
    password !== undefined &&
    password !== null &&
    (!isNonEmptyString(password) || password.length < 8)
  ) {
    return {
      success: false,
      message: 'password debe tener al menos 8 caracteres.',
    };
  }

  if (!isOptionalText(phone)) {
    return {
      success: false,
      message: 'phone debe ser texto.',
    };
  }

  if (!isOptionalText(documentId)) {
    return {
      success: false,
      message: 'documentId debe ser texto.',
    };
  }

  if (!isOptionalText(address)) {
    return {
      success: false,
      message: 'address debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateClient = (body) => {
  const { fullName, email, password, phone, documentId, address, isActive } = body;

  if (
    fullName === undefined &&
    email === undefined &&
    password === undefined &&
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

  if (
    password !== undefined &&
    password !== null &&
    (!isNonEmptyString(password) || password.length < 8)
  ) {
    return {
      success: false,
      message: 'password debe tener al menos 8 caracteres.',
    };
  }

  if (!isOptionalText(phone)) {
    return {
      success: false,
      message: 'phone debe ser texto.',
    };
  }

  if (!isOptionalText(documentId)) {
    return {
      success: false,
      message: 'documentId debe ser texto.',
    };
  }

  if (!isOptionalText(address)) {
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
