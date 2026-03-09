const validateCreateUserRole = (body) => {
  const { userId, roleId } = body;

  if (!userId || !roleId) {
    return {
      success: false,
      message: 'userId y roleId son obligatorios.',
    };
  }

  if (typeof userId !== 'string' || typeof roleId !== 'string') {
    return {
      success: false,
      message: 'userId y roleId deben ser texto.',
    };
  }

  return { success: true };
};

const validateDeleteUserRole = (body) => {
  const { userId, roleId } = body;

  if (!userId || !roleId) {
    return {
      success: false,
      message: 'userId y roleId son obligatorios.',
    };
  }

  if (typeof userId !== 'string' || typeof roleId !== 'string') {
    return {
      success: false,
      message: 'userId y roleId deben ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateUserRole,
  validateDeleteUserRole,
};