const ApiError = require('../utils/apiError');
const {
  createSpecies,
  findSpeciesById,
  findSpeciesByCode,
  getAllSpecies,
  updateSpeciesById,
  softDeleteSpeciesById,
} = require('../models/speciesModel');

const createNewSpecies = async (payload, authenticatedUserId) => {
  const existingSpecies = await findSpeciesByCode(payload.code);

  if (existingSpecies) {
    throw new ApiError(409, 'Ya existe una especie registrada con ese código.');
  }

  return createSpecies({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listSpecies = async () => {
  return getAllSpecies();
};

const getSpeciesDetail = async (speciesId) => {
  const species = await findSpeciesById(speciesId);

  if (!species) {
    throw new ApiError(404, 'Especie no encontrada.');
  }

  return species;
};

const updateSpecies = async (speciesId, payload, authenticatedUserId) => {
  const currentSpecies = await findSpeciesById(speciesId);

  if (!currentSpecies) {
    throw new ApiError(404, 'Especie no encontrada.');
  }

  if (payload.code && payload.code !== currentSpecies.code) {
    const existingSpecies = await findSpeciesByCode(payload.code);

    if (existingSpecies && existingSpecies.id !== speciesId) {
      throw new ApiError(409, 'Ya existe una especie registrada con ese código.');
    }
  }

  return updateSpeciesById(speciesId, payload, authenticatedUserId);
};

const deleteSpecies = async (speciesId, authenticatedUserId) => {
  const currentSpecies = await findSpeciesById(speciesId);

  if (!currentSpecies) {
    throw new ApiError(404, 'Especie no encontrada.');
  }

  return softDeleteSpeciesById(speciesId, authenticatedUserId);
};

module.exports = {
  createNewSpecies,
  listSpecies,
  getSpeciesDetail,
  updateSpecies,
  deleteSpecies,
};