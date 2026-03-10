const {
  validateCreateTreatment,
  validateUpdateTreatment,
} = require('../schemas/treatmentSchemas');

const {
  createNewTreatment,
  listTreatments,
  getTreatmentDetail,
  updateTreatment,
  deleteTreatment,
} = require('../services/treatmentService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateTreatment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const treatment = await createNewTreatment(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Tratamiento creado correctamente.',
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const treatments = await listTreatments();

    return res.status(200).json({
      success: true,
      message: 'Tratamientos obtenidos correctamente.',
      data: treatments,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const treatment = await getTreatmentDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Tratamiento obtenido correctamente.',
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateTreatment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const treatment = await updateTreatment(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Tratamiento actualizado correctamente.',
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const treatment = await deleteTreatment(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Tratamiento eliminado correctamente.',
      data: treatment,
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