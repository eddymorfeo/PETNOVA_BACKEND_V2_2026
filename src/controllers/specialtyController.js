const {
  validateCreateSpecialty,
  validateUpdateSpecialty,
} = require('../schemas/specialtySchemas');

const {
  createNewSpecialty,
  listSpecialties,
  getSpecialtyDetail,
  updateSpecialty,
  deleteSpecialty,
} = require('../services/specialtyService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateSpecialty(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const specialty = await createNewSpecialty(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Especialidad creada correctamente.',
      data: specialty,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const specialties = await listSpecialties();

    return res.status(200).json({
      success: true,
      message: 'Especialidades obtenidas correctamente.',
      data: specialties,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const specialty = await getSpecialtyDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Especialidad obtenida correctamente.',
      data: specialty,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateSpecialty(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const specialty = await updateSpecialty(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Especialidad actualizada correctamente.',
      data: specialty,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const specialty = await deleteSpecialty(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Especialidad desactivada correctamente.',
      data: specialty,
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