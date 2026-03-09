const validateUserLogin = (body) => {
  const { username, password } = body;

  if (!username || !password) {
    return {
      success: false,
      message: 'Username y password son obligatorios.',
    };
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return {
      success: false,
      message: 'Username y password deben ser texto.',
    };
  }

  return {
    success: true,
  };
};

module.exports = {
  validateUserLogin,
};