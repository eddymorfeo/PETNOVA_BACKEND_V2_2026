const {
  validateCreateTimeOff,
  validateUpdateTimeOff,
} = require('../schemas/timeOffSchemas');

const {
  createNewTimeOff,
  listTimeOff,
  getTimeOffDetail,
  updateTimeOff,
  removeTimeOff,
} = require('../services/timeOffService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateTimeOff(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const timeOff = await createNewTimeOff(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Bloqueo creado correctamente.',
      data: timeOff,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const timeOff = await listTimeOff();

    return res.status(200).json({
      success: true,
      message: 'Bloqueos obtenidos correctamente.',
      data: timeOff,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const timeOff = await getTimeOffDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Bloqueo obtenido correctamente.',
      data: timeOff,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateTimeOff(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const timeOff = await updateTimeOff(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Bloqueo actualizado correctamente.',
      data: timeOff,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const timeOff = await removeTimeOff(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Bloqueo eliminado correctamente.',
      data: timeOff,
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