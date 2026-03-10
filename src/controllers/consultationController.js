const {
  validateCreateConsultation,
  validateUpdateConsultation,
} = require('../schemas/consultationSchemas');

const {
  createNewConsultation,
  listConsultations,
  getConsultationDetail,
  updateConsultation,
  deleteConsultation,
} = require('../services/consultationService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateConsultation(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const consultation = await createNewConsultation(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Consulta creada correctamente.',
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const consultations = await listConsultations();

    return res.status(200).json({
      success: true,
      message: 'Consultas obtenidas correctamente.',
      data: consultations,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const consultation = await getConsultationDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Consulta obtenida correctamente.',
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateConsultation(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const consultation = await updateConsultation(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Consulta actualizada correctamente.',
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const consultation = await deleteConsultation(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Consulta eliminada correctamente.',
      data: consultation,
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