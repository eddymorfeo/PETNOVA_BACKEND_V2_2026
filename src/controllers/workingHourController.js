const {
  validateCreateWorkingHour,
  validateUpdateWorkingHour,
} = require('../schemas/workingHourSchemas');

const {
  createNewWorkingHour,
  listWorkingHours,
  getWorkingHourDetail,
  updateWorkingHour,
  deleteWorkingHour,
} = require('../services/workingHourService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateWorkingHour(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const workingHour = await createNewWorkingHour(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Horario creado correctamente.',
      data: workingHour,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const workingHours = await listWorkingHours();

    return res.status(200).json({
      success: true,
      message: 'Horarios obtenidos correctamente.',
      data: workingHours,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const workingHour = await getWorkingHourDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Horario obtenido correctamente.',
      data: workingHour,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateWorkingHour(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const workingHour = await updateWorkingHour(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Horario actualizado correctamente.',
      data: workingHour,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const workingHour = await deleteWorkingHour(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Horario desactivado correctamente.',
      data: workingHour,
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