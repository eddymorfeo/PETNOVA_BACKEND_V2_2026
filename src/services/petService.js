const ApiError = require('../utils/apiError');
const { findClientById } = require('../models/clientModel');
const { findSpeciesById } = require('../models/speciesModel');
const { findBreedById } = require('../models/breedModel');
const {
  createPet,
  findPetById,
  getAllPets,
  getPetsByClientId,
  updatePetById,
  softDeletePetById,
} = require('../models/petModel');

const validatePetRelations = async ({ clientId, speciesId, breedId }) => {
  if (clientId !== undefined) {
    const client = await findClientById(clientId);

    if (!client) {
      throw new ApiError(404, 'El cliente asociado no existe.');
    }
  }

  if (speciesId !== undefined) {
    const species = await findSpeciesById(speciesId);

    if (!species) {
      throw new ApiError(404, 'La especie asociada no existe.');
    }
  }

  if (breedId !== undefined && breedId !== null) {
    const breed = await findBreedById(breedId);

    if (!breed) {
      throw new ApiError(404, 'La raza asociada no existe.');
    }
  }
};

const validatePetOwnershipForClient = (pet, authenticatedClientId) => {
  if (!authenticatedClientId) {
    return;
  }

  if (pet.client_id !== authenticatedClientId) {
    throw new ApiError(
      403,
      'No tienes permiso para acceder o modificar esta mascota.'
    );
  }
};

const createNewPet = async (
  payload,
  authenticatedUserId,
  authenticatedClientId = null
) => {
  if (
    authenticatedClientId &&
    payload.clientId &&
    payload.clientId !== authenticatedClientId
  ) {
    throw new ApiError(
      403,
      'No tienes permiso para registrar mascotas para otro cliente.'
    );
  }

  await validatePetRelations({
    clientId: payload.clientId,
    speciesId: payload.speciesId,
    breedId: payload.breedId,
  });

  return createPet({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listPets = async () => {
  return getAllPets();
};

const getPetDetail = async (petId, authenticatedClientId = null) => {
  const pet = await findPetById(petId);

  if (!pet) {
    throw new ApiError(404, 'Mascota no encontrada.');
  }

  validatePetOwnershipForClient(pet, authenticatedClientId);

  return pet;
};

const updatePet = async (
  petId,
  payload,
  authenticatedUserId,
  authenticatedClientId = null
) => {
  const currentPet = await findPetById(petId);

  if (!currentPet) {
    throw new ApiError(404, 'Mascota no encontrada.');
  }

  validatePetOwnershipForClient(currentPet, authenticatedClientId);

  if (
    authenticatedClientId &&
    payload.clientId &&
    payload.clientId !== authenticatedClientId
  ) {
    throw new ApiError(
      403,
      'No tienes permiso para reasignar esta mascota a otro cliente.'
    );
  }

  await validatePetRelations({
    clientId: payload.clientId,
    speciesId: payload.speciesId,
    breedId: payload.breedId,
  });

  return updatePetById(petId, payload, authenticatedUserId);
};

const deletePet = async (
  petId,
  authenticatedUserId,
  authenticatedClientId = null
) => {
  const currentPet = await findPetById(petId);

  if (!currentPet) {
    throw new ApiError(404, 'Mascota no encontrada.');
  }

  validatePetOwnershipForClient(currentPet, authenticatedClientId);

  return softDeletePetById(petId, authenticatedUserId);
};

const listPetsByClient = async (clientId, authenticatedClientId = null) => {
  const client = await findClientById(clientId);

  if (!client) {
    throw new ApiError(404, 'El cliente asociado no existe.');
  }

  if (authenticatedClientId && clientId !== authenticatedClientId) {
    throw new ApiError(
      403,
      'No tienes permiso para consultar mascotas de otro cliente.'
    );
  }

  return getPetsByClientId(clientId);
};

module.exports = {
  createNewPet,
  listPets,
  getPetDetail,
  updatePet,
  deletePet,
  listPetsByClient,
};