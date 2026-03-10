const {
  validateCreatePrescription,
  validateUpdatePrescription,
} = require('../schemas/prescriptionSchemas');

const {
  createNewPrescription,
  listPrescriptions,
  getPrescriptionDetail,
  updatePrescription,
  deletePrescription,
} = require('../services/prescriptionService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreatePrescription(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const prescription = await createNewPrescription(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Prescripción creada correctamente.',
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const prescriptions = await listPrescriptions();

    return res.status(200).json({
      success: true,
      message: 'Prescripciones obtenidas correctamente.',
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const prescription = await getPrescriptionDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Prescripción obtenida correctamente.',
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdatePrescription(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const prescription = await updatePrescription(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Prescripción actualizada correctamente.',
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const prescription = await deletePrescription(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Prescripción eliminada correctamente.',
      data: prescription,
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