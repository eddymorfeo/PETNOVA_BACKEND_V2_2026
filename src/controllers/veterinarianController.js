const {
  validateCreateVeterinarian,
  validateUpdateVeterinarian,
} = require('../schemas/veterinarianSchemas');

const {
  createNewVeterinarian,
  listVeterinarians,
  getVeterinarianDetail,
  updateVeterinarian,
  deleteVeterinarian,
} = require('../services/veterinarianService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateVeterinarian(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const veterinarian = await createNewVeterinarian(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Veterinario creado correctamente.',
      data: veterinarian,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const veterinarians = await listVeterinarians();

    return res.status(200).json({
      success: true,
      message: 'Veterinarios obtenidos correctamente.',
      data: veterinarians,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const veterinarian = await getVeterinarianDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Veterinario obtenido correctamente.',
      data: veterinarian,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateVeterinarian(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const veterinarian = await updateVeterinarian(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Veterinario actualizado correctamente.',
      data: veterinarian,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const veterinarian = await deleteVeterinarian(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Veterinario desactivado correctamente.',
      data: veterinarian,
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