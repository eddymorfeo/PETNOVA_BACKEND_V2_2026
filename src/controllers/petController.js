const {
  validateCreatePet,
  validateUpdatePet,
} = require('../schemas/petSchemas');

const {
  createNewPet,
  listPets,
  getPetDetail,
  updatePet,
  deletePet,
  listPetsByClient,
} = require('../services/petService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreatePet(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const authenticatedUserId =
      req.auth?.type === 'client' ? null : req.auth?.sub ?? null;

    const authenticatedClientId =
      req.auth?.type === 'client' ? req.auth?.sub ?? null : null;

    const pet = await createNewPet(
      req.body,
      authenticatedUserId,
      authenticatedClientId
    );

    return res.status(201).json({
      success: true,
      message: 'Mascota creada correctamente.',
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const pets = await listPets();

    return res.status(200).json({
      success: true,
      message: 'Mascotas obtenidas correctamente.',
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const authenticatedClientId =
      req.auth?.type === 'client' ? req.auth?.sub ?? null : null;

    const pet = await getPetDetail(req.params.id, authenticatedClientId);

    return res.status(200).json({
      success: true,
      message: 'Mascota obtenida correctamente.',
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdatePet(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const authenticatedUserId =
      req.auth?.type === 'client' ? null : req.auth?.sub ?? null;

    const authenticatedClientId =
      req.auth?.type === 'client' ? req.auth?.sub ?? null : null;

    const pet = await updatePet(
      req.params.id,
      req.body,
      authenticatedUserId,
      authenticatedClientId
    );

    return res.status(200).json({
      success: true,
      message: 'Mascota actualizada correctamente.',
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const authenticatedUserId =
      req.auth?.type === 'client' ? null : req.auth?.sub ?? null;

    const authenticatedClientId =
      req.auth?.type === 'client' ? req.auth?.sub ?? null : null;

    const pet = await deletePet(
      req.params.id,
      authenticatedUserId,
      authenticatedClientId
    );

    return res.status(200).json({
      success: true,
      message: 'Mascota desactivada correctamente.',
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

const findByClient = async (req, res, next) => {
  try {
    const authenticatedClientId =
      req.auth?.type === 'client' ? req.auth?.sub ?? null : null;

    const pets = await listPetsByClient(
      req.params.clientId,
      authenticatedClientId
    );

    return res.status(200).json({
      success: true,
      message: 'Mascotas del cliente obtenidas correctamente.',
      data: pets,
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
  findByClient,
};