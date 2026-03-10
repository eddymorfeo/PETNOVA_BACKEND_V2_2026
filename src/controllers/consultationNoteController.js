const {
  validateCreateConsultationNote,
  validateUpdateConsultationNote,
} = require('../schemas/consultationNoteSchemas');

const {
  createNewConsultationNote,
  listConsultationNotes,
  getConsultationNoteDetail,
  updateConsultationNote,
  deleteConsultationNote,
} = require('../services/consultationNoteService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateConsultationNote(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const consultationNote = await createNewConsultationNote(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Nota de consulta creada correctamente.',
      data: consultationNote,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const consultationNotes = await listConsultationNotes();

    return res.status(200).json({
      success: true,
      message: 'Notas de consulta obtenidas correctamente.',
      data: consultationNotes,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const consultationNote = await getConsultationNoteDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Nota de consulta obtenida correctamente.',
      data: consultationNote,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateConsultationNote(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const consultationNote = await updateConsultationNote(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Nota de consulta actualizada correctamente.',
      data: consultationNote,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const consultationNote = await deleteConsultationNote(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Nota de consulta eliminada correctamente.',
      data: consultationNote,
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