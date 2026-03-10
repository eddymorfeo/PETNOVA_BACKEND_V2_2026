const {
  validateCreatePetVaccination,
  validateUpdatePetVaccination,
} = require('../schemas/petVaccinationSchemas');

const {
  createNewPetVaccination,
  listPetVaccinations,
  getPetVaccinationDetail,
  updatePetVaccination,
  deletePetVaccination,
} = require('../services/petVaccinationService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreatePetVaccination(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const petVaccination = await createNewPetVaccination(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Vacunación registrada correctamente.',
      data: petVaccination,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const petVaccinations = await listPetVaccinations();

    return res.status(200).json({
      success: true,
      message: 'Vacunaciones obtenidas correctamente.',
      data: petVaccinations,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const petVaccination = await getPetVaccinationDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Vacunación obtenida correctamente.',
      data: petVaccination,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdatePetVaccination(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const petVaccination = await updatePetVaccination(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Vacunación actualizada correctamente.',
      data: petVaccination,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const petVaccination = await deletePetVaccination(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Vacunación eliminada correctamente.',
      data: petVaccination,
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