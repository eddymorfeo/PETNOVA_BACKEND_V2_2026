const ApiError = require('../utils/apiError');
const { findUserById } = require('../models/userModel');
const { findSpecialtyById } = require('../models/specialtyModel');
const {
  createVeterinarian,
  findVeterinarianById,
  findVeterinarianByUserId,
  getAllVeterinarians,
  updateVeterinarianById,
  softDeleteVeterinarianById,
} = require('../models/veterinarianModel');

const createNewVeterinarian = async (payload, authenticatedUserId) => {
  const user = await findUserById(payload.userId);

  if (!user) {
    throw new ApiError(404, 'El usuario asociado no existe.');
  }

  const existingVeterinarian = await findVeterinarianByUserId(payload.userId);

  if (existingVeterinarian) {
    throw new ApiError(409, 'Ya existe un veterinario asociado a ese usuario.');
  }

  if (payload.specialtyId) {
    const specialty = await findSpecialtyById(payload.specialtyId);

    if (!specialty) {
      throw new ApiError(404, 'La especialidad asociada no existe.');
    }
  }

  return createVeterinarian({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listVeterinarians = async () => {
  return getAllVeterinarians();
};

const getVeterinarianDetail = async (veterinarianId) => {
  const veterinarian = await findVeterinarianById(veterinarianId);

  if (!veterinarian) {
    throw new ApiError(404, 'Veterinario no encontrado.');
  }

  return veterinarian;
};

const updateVeterinarian = async (veterinarianId, payload, authenticatedUserId) => {
  const currentVeterinarian = await findVeterinarianById(veterinarianId);

  if (!currentVeterinarian) {
    throw new ApiError(404, 'Veterinario no encontrado.');
  }

  if (payload.userId && payload.userId !== currentVeterinarian.user_id) {
    const user = await findUserById(payload.userId);

    if (!user) {
      throw new ApiError(404, 'El usuario asociado no existe.');
    }

    const existingVeterinarian = await findVeterinarianByUserId(payload.userId);

    if (existingVeterinarian && existingVeterinarian.id !== veterinarianId) {
      throw new ApiError(409, 'Ya existe un veterinario asociado a ese usuario.');
    }
  }

  if (payload.specialtyId) {
    const specialty = await findSpecialtyById(payload.specialtyId);

    if (!specialty) {
      throw new ApiError(404, 'La especialidad asociada no existe.');
    }
  }

  return updateVeterinarianById(veterinarianId, payload, authenticatedUserId);
};

const deleteVeterinarian = async (veterinarianId, authenticatedUserId) => {
  const currentVeterinarian = await findVeterinarianById(veterinarianId);

  if (!currentVeterinarian) {
    throw new ApiError(404, 'Veterinario no encontrado.');
  }

  return softDeleteVeterinarianById(veterinarianId, authenticatedUserId);
};

module.exports = {
  createNewVeterinarian,
  listVeterinarians,
  getVeterinarianDetail,
  updateVeterinarian,
  deleteVeterinarian,
};