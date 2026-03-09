const validateCreateUser = (body) => {
  const { username, email, password, fullName, phone } = body;

  if (!username || !email || !password || !fullName) {
    return {
      success: false,
      message: 'username, email, password y fullName son obligatorios.',
    };
  }

  if (
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof fullName !== 'string'
  ) {
    return {
      success: false,
      message: 'username, email, password y fullName deben ser texto.',
    };
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return {
      success: false,
      message: 'phone debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateUser = (body) => {
  const { username, email, password, fullName, phone, isActive } = body;

  if (
    username === undefined &&
    email === undefined &&
    password === undefined &&
    fullName === undefined &&
    phone === undefined &&
    isActive === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (username !== undefined && typeof username !== 'string') {
    return { success: false, message: 'username debe ser texto.' };
  }

  if (email !== undefined && typeof email !== 'string') {
    return { success: false, message: 'email debe ser texto.' };
  }

  if (password !== undefined && typeof password !== 'string') {
    return { success: false, message: 'password debe ser texto.' };
  }

  if (fullName !== undefined && typeof fullName !== 'string') {
    return { success: false, message: 'fullName debe ser texto.' };
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return { success: false, message: 'phone debe ser texto.' };
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return { success: false, message: 'isActive debe ser boolean.' };
  }

  return { success: true };
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};