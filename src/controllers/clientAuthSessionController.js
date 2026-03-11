const {
  validateCreateClientAuthSession,
  validateUpdateClientAuthSession,
} = require('../schemas/clientAuthSessionSchemas');

const {
  createNewClientAuthSession,
  listClientAuthSessions,
  getClientAuthSessionDetail,
  updateClientAuthSession,
  deleteClientAuthSession,
} = require('../services/clientAuthSessionService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateClientAuthSession(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const session = await createNewClientAuthSession(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Sesión de cliente creada correctamente.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const sessions = await listClientAuthSessions();

    return res.status(200).json({
      success: true,
      message: 'Sesiones de cliente obtenidas correctamente.',
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const session = await getClientAuthSessionDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Sesión de cliente obtenida correctamente.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateClientAuthSession(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const session = await updateClientAuthSession(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Sesión de cliente actualizada correctamente.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const session = await deleteClientAuthSession(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Sesión de cliente revocada correctamente.',
      data: session,
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