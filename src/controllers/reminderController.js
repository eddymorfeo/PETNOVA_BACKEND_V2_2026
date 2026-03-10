const {
  validateCreateReminder,
  validateUpdateReminder,
} = require('../schemas/reminderSchemas');

const {
  createNewReminder,
  listReminders,
  getReminderDetail,
  updateReminder,
  deleteReminder,
} = require('../services/reminderService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateReminder(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const reminder = await createNewReminder(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Recordatorio creado correctamente.',
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const reminders = await listReminders();

    return res.status(200).json({
      success: true,
      message: 'Recordatorios obtenidos correctamente.',
      data: reminders,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const reminder = await getReminderDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Recordatorio obtenido correctamente.',
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateReminder(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const reminder = await updateReminder(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Recordatorio actualizado correctamente.',
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const reminder = await deleteReminder(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Recordatorio eliminado correctamente.',
      data: reminder,
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