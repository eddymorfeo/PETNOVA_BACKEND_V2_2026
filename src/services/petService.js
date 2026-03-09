const ApiError = require('../utils/apiError');
const { findClientById } = require('../models/clientModel');
const { findSpeciesById } = require('../models/speciesModel');
const { findBreedById } = require('../models/breedModel');
const {
  createPet,
  findPetById,
  getAllPets,
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

const createNewPet = async (payload, authenticatedUserId) => {
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

const getPetDetail = async (petId) => {
  const pet = await findPetById(petId);

  if (!pet) {
    throw new ApiError(404, 'Mascota no encontrada.');
  }

  return pet;
};

const updatePet = async (petId, payload, authenticatedUserId) => {
  const currentPet = await findPetById(petId);

  if (!currentPet) {
    throw new ApiError(404, 'Mascota no encontrada.');
  }

  await validatePetRelations({
    clientId: payload.clientId,
    speciesId: payload.speciesId,
    breedId: payload.breedId,
  });

  return updatePetById(petId, payload, authenticatedUserId);
};

const deletePet = async (petId, authenticatedUserId) => {
  const currentPet = await findPetById(petId);

  if (!currentPet) {
    throw new ApiError(404, 'Mascota no encontrada.');
  }

  return softDeletePetById(petId, authenticatedUserId);
};

module.exports = {
  createNewPet,
  listPets,
  getPetDetail,
  updatePet,
  deletePet,
};