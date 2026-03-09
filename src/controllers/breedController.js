const {
  validateCreateBreed,
  validateUpdateBreed,
} = require('../schemas/breedSchemas');

const {
  createNewBreed,
  listBreeds,
  getBreedDetail,
  updateBreed,
  deleteBreed,
} = require('../services/breedService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateBreed(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const breed = await createNewBreed(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Raza creada correctamente.',
      data: breed,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const breeds = await listBreeds();

    return res.status(200).json({
      success: true,
      message: 'Razas obtenidas correctamente.',
      data: breeds,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const breed = await getBreedDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Raza obtenida correctamente.',
      data: breed,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateBreed(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const breed = await updateBreed(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Raza actualizada correctamente.',
      data: breed,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const breed = await deleteBreed(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Raza desactivada correctamente.',
      data: breed,
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