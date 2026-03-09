const { validateUserLogin } = require('../schemas/authUserSchemas');
const { loginUser, getAuthenticatedUser  } = require('../services/authUserService');

const login = async (req, res, next) => {
  try {
    const validation = validateUserLogin(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const data = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const userId = req.auth.sub;

    const user = await getAuthenticatedUser(userId);

    return res.status(200).json({
      success: true,
      message: 'Usuario autenticado obtenido correctamente.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me
};