const {
  validateCreateSpecies,
  validateUpdateSpecies,
} = require('../schemas/speciesSchemas');

const {
  createNewSpecies,
  listSpecies,
  getSpeciesDetail,
  updateSpecies,
  deleteSpecies,
} = require('../services/speciesService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateSpecies(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const species = await createNewSpecies(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Especie creada correctamente.',
      data: species,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const species = await listSpecies();

    return res.status(200).json({
      success: true,
      message: 'Especies obtenidas correctamente.',
      data: species,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const species = await getSpeciesDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Especie obtenida correctamente.',
      data: species,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateSpecies(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const species = await updateSpecies(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Especie actualizada correctamente.',
      data: species,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const species = await deleteSpecies(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Especie desactivada correctamente.',
      data: species,
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