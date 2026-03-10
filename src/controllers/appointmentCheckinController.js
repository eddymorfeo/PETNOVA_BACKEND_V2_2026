const {
  validateCreateAppointmentCheckin,
  validateUpdateAppointmentCheckin,
} = require('../schemas/appointmentCheckinSchemas');

const {
  createNewAppointmentCheckin,
  listAppointmentCheckins,
  getAppointmentCheckinDetail,
  updateAppointmentCheckin,
  deleteAppointmentCheckin,
} = require('../services/appointmentCheckinService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateAppointmentCheckin(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const checkin = await createNewAppointmentCheckin(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Check-in registrado correctamente.',
      data: checkin,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const checkins = await listAppointmentCheckins();

    return res.status(200).json({
      success: true,
      message: 'Check-ins obtenidos correctamente.',
      data: checkins,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const checkin = await getAppointmentCheckinDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Check-in obtenido correctamente.',
      data: checkin,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateAppointmentCheckin(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const checkin = await updateAppointmentCheckin(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Check-in actualizado correctamente.',
      data: checkin,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const checkin = await deleteAppointmentCheckin(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Check-in eliminado correctamente.',
      data: checkin,
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