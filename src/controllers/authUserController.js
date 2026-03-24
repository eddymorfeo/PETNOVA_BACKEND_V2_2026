const { validateUserLogin } = require('../schemas/authUserSchemas');
const {
  loginUser,
  getAuthenticatedSession,
} = require('../services/authUserService');

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
    const session = await getAuthenticatedSession(userId);

    return res.status(200).json({
      success: true,
      message: 'Sesión autenticada obtenida correctamente.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const session = async (req, res, next) => {
  try {
    const userId = req.auth.sub;
    const authenticatedSession = await getAuthenticatedSession(userId);

    return res.status(200).json({
      success: true,
      message: 'Sesión administrativa obtenida correctamente.',
      data: authenticatedSession,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me,
  session,
};