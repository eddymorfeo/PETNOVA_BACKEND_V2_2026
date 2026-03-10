const {
  validateCreateVaccineCatalog,
  validateUpdateVaccineCatalog,
} = require('../schemas/vaccineCatalogSchemas');

const {
  createNewVaccineCatalog,
  listVaccinesCatalog,
  getVaccineCatalogDetail,
  updateVaccineCatalog,
  deleteVaccineCatalog,
} = require('../services/vaccineCatalogService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateVaccineCatalog(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const vaccine = await createNewVaccineCatalog(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Vacuna creada correctamente.',
      data: vaccine,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const vaccines = await listVaccinesCatalog();

    return res.status(200).json({
      success: true,
      message: 'Vacunas obtenidas correctamente.',
      data: vaccines,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const vaccine = await getVaccineCatalogDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Vacuna obtenida correctamente.',
      data: vaccine,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateVaccineCatalog(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const vaccine = await updateVaccineCatalog(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Vacuna actualizada correctamente.',
      data: vaccine,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const vaccine = await deleteVaccineCatalog(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Vacuna desactivada correctamente.',
      data: vaccine,
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