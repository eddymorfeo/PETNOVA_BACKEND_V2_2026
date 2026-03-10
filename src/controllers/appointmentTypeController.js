const {
  validateCreateAppointmentType,
  validateUpdateAppointmentType,
} = require('../schemas/appointmentTypeSchemas');

const {
  createNewAppointmentType,
  listAppointmentTypes,
  getAppointmentTypeDetail,
  updateAppointmentType,
  deleteAppointmentType,
} = require('../services/appointmentTypeService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateAppointmentType(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const appointmentType = await createNewAppointmentType(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Tipo de cita creado correctamente.',
      data: appointmentType,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const appointmentTypes = await listAppointmentTypes();

    return res.status(200).json({
      success: true,
      message: 'Tipos de cita obtenidos correctamente.',
      data: appointmentTypes,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const appointmentType = await getAppointmentTypeDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Tipo de cita obtenido correctamente.',
      data: appointmentType,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateAppointmentType(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const appointmentType = await updateAppointmentType(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Tipo de cita actualizado correctamente.',
      data: appointmentType,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const appointmentType = await deleteAppointmentType(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Tipo de cita desactivado correctamente.',
      data: appointmentType,
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