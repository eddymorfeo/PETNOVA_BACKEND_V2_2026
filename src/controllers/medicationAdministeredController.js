const {
  validateCreateMedicationAdministered,
  validateUpdateMedicationAdministered,
} = require('../schemas/medicationAdministeredSchemas');

const {
  createNewMedicationAdministered,
  listMedicationsAdministered,
  getMedicationAdministeredDetail,
  updateMedicationAdministered,
  deleteMedicationAdministered,
} = require('../services/medicationAdministeredService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateMedicationAdministered(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const medicationAdministered = await createNewMedicationAdministered(
      req.body,
      req.auth.sub
    );

    return res.status(201).json({
      success: true,
      message: 'Medicamento administrado creado correctamente.',
      data: medicationAdministered,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const medicationsAdministered = await listMedicationsAdministered();

    return res.status(200).json({
      success: true,
      message: 'Medicamentos administrados obtenidos correctamente.',
      data: medicationsAdministered,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const medicationAdministered = await getMedicationAdministeredDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Medicamento administrado obtenido correctamente.',
      data: medicationAdministered,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateMedicationAdministered(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const medicationAdministered = await updateMedicationAdministered(
      req.params.id,
      req.body,
      req.auth.sub
    );

    return res.status(200).json({
      success: true,
      message: 'Medicamento administrado actualizado correctamente.',
      data: medicationAdministered,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const medicationAdministered = await deleteMedicationAdministered(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Medicamento administrado eliminado correctamente.',
      data: medicationAdministered,
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