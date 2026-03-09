const ApiError = require('../utils/apiError');
const { findSpeciesById } = require('../models/speciesModel');
const {
  createBreed,
  findBreedById,
  findBreedBySpeciesIdAndName,
  getAllBreeds,
  updateBreedById,
  softDeleteBreedById,
} = require('../models/breedModel');

const createNewBreed = async (payload, authenticatedUserId) => {
  const species = await findSpeciesById(payload.speciesId);

  if (!species) {
    throw new ApiError(404, 'La especie asociada no existe.');
  }

  const existingBreed = await findBreedBySpeciesIdAndName(payload.speciesId, payload.name);

  if (existingBreed) {
    throw new ApiError(409, 'Ya existe una raza con ese nombre para la especie indicada.');
  }

  return createBreed({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listBreeds = async () => {
  return getAllBreeds();
};

const getBreedDetail = async (breedId) => {
  const breed = await findBreedById(breedId);

  if (!breed) {
    throw new ApiError(404, 'Raza no encontrada.');
  }

  return breed;
};

const updateBreed = async (breedId, payload, authenticatedUserId) => {
  const currentBreed = await findBreedById(breedId);

  if (!currentBreed) {
    throw new ApiError(404, 'Raza no encontrada.');
  }

  const targetSpeciesId = payload.speciesId || currentBreed.species_id;
  const targetName = payload.name || currentBreed.name;

  const species = await findSpeciesById(targetSpeciesId);

  if (!species) {
    throw new ApiError(404, 'La especie asociada no existe.');
  }

  const existingBreed = await findBreedBySpeciesIdAndName(targetSpeciesId, targetName);

  if (existingBreed && existingBreed.id !== breedId) {
    throw new ApiError(409, 'Ya existe una raza con ese nombre para la especie indicada.');
  }

  return updateBreedById(breedId, payload, authenticatedUserId);
};

const deleteBreed = async (breedId, authenticatedUserId) => {
  const currentBreed = await findBreedById(breedId);

  if (!currentBreed) {
    throw new ApiError(404, 'Raza no encontrada.');
  }

  return softDeleteBreedById(breedId, authenticatedUserId);
};

module.exports = {
  createNewBreed,
  listBreeds,
  getBreedDetail,
  updateBreed,
  deleteBreed,
};