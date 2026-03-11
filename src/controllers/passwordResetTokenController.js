const {
  validateCreatePasswordResetToken,
  validateUpdatePasswordResetToken,
} = require('../schemas/passwordResetTokenSchemas');

const {
  createNewPasswordResetToken,
  listPasswordResetTokens,
  getPasswordResetTokenDetail,
  updatePasswordResetToken,
  deletePasswordResetToken,
} = require('../services/passwordResetTokenService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreatePasswordResetToken(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const token = await createNewPasswordResetToken(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Token de recuperación creado correctamente.',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const tokens = await listPasswordResetTokens();

    return res.status(200).json({
      success: true,
      message: 'Tokens de recuperación obtenidos correctamente.',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const token = await getPasswordResetTokenDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Token de recuperación obtenido correctamente.',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdatePasswordResetToken(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const token = await updatePasswordResetToken(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Token de recuperación actualizado correctamente.',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const token = await deletePasswordResetToken(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Token de recuperación eliminado correctamente.',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};