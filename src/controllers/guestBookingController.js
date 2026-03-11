const {
  validateCreateGuestBooking,
  validateUpdateGuestBooking,
} = require('../schemas/guestBookingSchemas');

const {
  createNewGuestBooking,
  listGuestBookings,
  getGuestBookingDetail,
  updateGuestBooking,
  deleteGuestBooking,
} = require('../services/guestBookingService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateGuestBooking(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const guestBooking = await createNewGuestBooking(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Reserva invitada creada correctamente.',
      data: guestBooking,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const guestBookings = await listGuestBookings();

    return res.status(200).json({
      success: true,
      message: 'Reservas invitadas obtenidas correctamente.',
      data: guestBookings,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const guestBooking = await getGuestBookingDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Reserva invitada obtenida correctamente.',
      data: guestBooking,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateGuestBooking(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const guestBooking = await updateGuestBooking(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Reserva invitada actualizada correctamente.',
      data: guestBooking,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const guestBooking = await deleteGuestBooking(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Reserva invitada eliminada correctamente.',
      data: guestBooking,
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