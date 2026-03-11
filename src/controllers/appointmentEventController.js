const {
  validateCreateAppointmentEvent,
  validateUpdateAppointmentEvent,
} = require('../schemas/appointmentEventSchemas');

const {
  createNewAppointmentEvent,
  listAppointmentEvents,
  getAppointmentEventDetail,
  updateAppointmentEvent,
  deleteAppointmentEvent,
} = require('../services/appointmentEventService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateAppointmentEvent(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const event = await createNewAppointmentEvent(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Evento de cita creado correctamente.',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const events = await listAppointmentEvents();

    return res.status(200).json({
      success: true,
      message: 'Eventos de cita obtenidos correctamente.',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const event = await getAppointmentEventDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Evento de cita obtenido correctamente.',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateAppointmentEvent(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const event = await updateAppointmentEvent(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Evento de cita actualizado correctamente.',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const event = await deleteAppointmentEvent(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Evento de cita eliminado correctamente.',
      data: event,
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