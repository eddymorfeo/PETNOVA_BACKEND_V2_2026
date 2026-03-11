const {
  validateCreateEmailOutbox,
  validateUpdateEmailOutbox,
} = require('../schemas/emailOutboxSchemas');

const {
  createNewEmailOutbox,
  listEmailOutbox,
  getEmailOutboxDetail,
  updateEmailOutbox,
  deleteEmailOutbox,
} = require('../services/emailOutboxService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateEmailOutbox(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const email = await createNewEmailOutbox(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Registro de email_outbox creado correctamente.',
      data: email,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const emails = await listEmailOutbox();

    return res.status(200).json({
      success: true,
      message: 'Registros de email_outbox obtenidos correctamente.',
      data: emails,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const email = await getEmailOutboxDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Registro de email_outbox obtenido correctamente.',
      data: email,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateEmailOutbox(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const email = await updateEmailOutbox(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Registro de email_outbox actualizado correctamente.',
      data: email,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const email = await deleteEmailOutbox(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Registro de email_outbox eliminado correctamente.',
      data: email,
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