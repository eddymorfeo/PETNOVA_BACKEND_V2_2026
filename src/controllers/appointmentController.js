const {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateDeleteAppointment,
} = require('../schemas/appointmentSchemas');
const {
  createNewAppointment,
  listAppointments,
  listMyAppointments,
  getAppointmentDetail,
  updateAppointment,
  deleteAppointment,
} = require('../services/appointmentService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateAppointment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const appointment = await createNewAppointment(req.body, req.auth);

    return res.status(201).json({
      success: true,
      message: 'Cita creada correctamente.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const appointments = await listAppointments(req.auth);

    return res.status(200).json({
      success: true,
      message: 'Citas obtenidas correctamente.',
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const findMine = async (req, res, next) => {
  try {
    const appointments = await listMyAppointments(req.auth);

    return res.status(200).json({
      success: true,
      message: 'Mis citas obtenidas correctamente.',
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const appointment = await getAppointmentDetail(req.params.id, req.auth);

    return res.status(200).json({
      success: true,
      message: 'Cita obtenida correctamente.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateAppointment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const appointment = await updateAppointment(req.params.id, req.body, req.auth);

    return res.status(200).json({
      success: true,
      message: 'Cita actualizada correctamente.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const validation = validateDeleteAppointment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const appointment = await deleteAppointment(
      req.params.id,
      req.body.cancelReason,
      req.auth,
    );

    return res.status(200).json({
      success: true,
      message: 'Cita cancelada correctamente.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findMine,
  findOne,
  update,
  remove,
};
