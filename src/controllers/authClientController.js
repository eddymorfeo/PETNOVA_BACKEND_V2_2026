const {
  validateClientRegister,
  validateClientLogin,
  validateClientForgotPassword,
  validateClientResetPassword,
} = require('../schemas/authClientSchemas');

const {
  registerClient,
  loginClient,
  getAuthenticatedClient,
  requestClientPasswordReset,
  resetClientPassword,
} = require('../services/authClientService');

const register = async (req, res, next) => {
  try {
    const validation = validateClientRegister(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const data = await registerClient(req.body);

    return res.status(201).json({
      success: true,
      message: 'Cuenta creada correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validation = validateClientLogin(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const data = await loginClient(req.body);

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
    const clientId = req.auth.sub;
    const data = await getAuthenticatedClient(clientId);

    return res.status(200).json({
      success: true,
      message: 'Cliente autenticado obtenido correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const validation = validateClientForgotPassword(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const data = await requestClientPasswordReset(req.body);

    return res.status(200).json({
      success: true,
      message:
        'Si el correo existe en el sistema, se enviará un enlace para restablecer la contraseña.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const validation = validateClientResetPassword(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const data = await resetClientPassword(req.body);

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
};