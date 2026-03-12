const {
  validateCreatePublicGuestAppointment,
} = require('../schemas/publicGuestAppointmentSchemas');

const {
  createPublicGuestAppointment,
  listPublicAppointmentTypes,
  listPublicVeterinarians,
  listPublicAvailableTimes,
} = require('../services/publicGuestAppointmentService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreatePublicGuestAppointment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const result = await createPublicGuestAppointment(req.body);

    return res.status(201).json({
      success: true,
      message: 'Reserva pública creada correctamente.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const listAppointmentTypes = async (req, res, next) => {
  try {
    const data = await listPublicAppointmentTypes();

    return res.status(200).json({
      success: true,
      message: 'Tipos de cita obtenidos correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const listVeterinarians = async (req, res, next) => {
  try {
    const data = await listPublicVeterinarians();

    return res.status(200).json({
      success: true,
      message: 'Veterinarios obtenidos correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const listAvailableTimes = async (req, res, next) => {
  try {
    const { veterinarianId, appointmentDate } = req.query;

    const data = await listPublicAvailableTimes({
      veterinarianId,
      appointmentDate,
    });

    return res.status(200).json({
      success: true,
      message: 'Horarios disponibles obtenidos correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  listAppointmentTypes,
  listVeterinarians,
  listAvailableTimes,
};