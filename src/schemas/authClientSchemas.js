const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (value) =>
  isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validateClientRegister = (body) => {
  const { fullName, email, password, phone, documentId, address } = body;

  if (!isNonEmptyString(fullName)) {
    return { success: false, message: 'fullName es obligatorio.' };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: 'email debe ser válido.' };
  }

  if (!isNonEmptyString(password) || String(password).length < 8) {
    return {
      success: false,
      message: 'password es obligatorio y debe tener al menos 8 caracteres.',
    };
  }

  if (phone !== undefined && phone !== null && typeof phone !== 'string') {
    return { success: false, message: 'phone debe ser texto.' };
  }

  if (
    documentId !== undefined &&
    documentId !== null &&
    typeof documentId !== 'string'
  ) {
    return { success: false, message: 'documentId debe ser texto.' };
  }

  if (address !== undefined && address !== null && typeof address !== 'string') {
    return { success: false, message: 'address debe ser texto.' };
  }

  return { success: true };
};

const validateClientLogin = (body) => {
  const { email, password } = body;

  if (!isValidEmail(email)) {
    return { success: false, message: 'email debe ser válido.' };
  }

  if (!isNonEmptyString(password)) {
    return { success: false, message: 'password es obligatorio.' };
  }

  return { success: true };
};

const validateClientForgotPassword = (body) => {
  const { email } = body;

  if (!isValidEmail(email)) {
    return { success: false, message: 'email debe ser válido.' };
  }

  return { success: true };
};

const validateClientResetPassword = (body) => {
  const { token, password } = body;

  if (!isNonEmptyString(token)) {
    return { success: false, message: 'token es obligatorio.' };
  }

  if (!isNonEmptyString(password) || String(password).length < 8) {
    return {
      success: false,
      message: 'password es obligatorio y debe tener al menos 8 caracteres.',
    };
  }

  return { success: true };
};

module.exports = {
  validateClientRegister,
  validateClientLogin,
  validateClientForgotPassword,
  validateClientResetPassword,
};