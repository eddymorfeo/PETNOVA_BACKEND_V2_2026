const ApiError = require('../utils/apiError');
const { findSpeciesById } = require('../models/speciesModel');
const {
  createVaccineCatalog,
  findVaccineCatalogById,
  findVaccineCatalogByCode,
  findVaccineCatalogByNameAndSpeciesId,
  getAllVaccinesCatalog,
  updateVaccineCatalogById,
  softDeleteVaccineCatalogById,
} = require('../models/vaccineCatalogModel');

const createNewVaccineCatalog = async (payload, authenticatedUserId) => {
  const species = await findSpeciesById(payload.speciesId);

  if (!species) {
    throw new ApiError(404, 'La especie asociada no existe.');
  }

  const existingVaccineByCode = await findVaccineCatalogByCode(payload.code);

  if (existingVaccineByCode) {
    throw new ApiError(409, 'Ya existe una vacuna registrada con ese código.');
  }

  const existingVaccineByNameAndSpecies = await findVaccineCatalogByNameAndSpeciesId(
    payload.name,
    payload.speciesId
  );

  if (existingVaccineByNameAndSpecies) {
    throw new ApiError(409, 'Ya existe una vacuna con ese nombre para la especie indicada.');
  }

  return createVaccineCatalog({
    code: payload.code,
    name: payload.name,
    description: payload.description,
    speciesId: payload.speciesId,
    createdBy: authenticatedUserId,
  });
};

const listVaccinesCatalog = async () => {
  return getAllVaccinesCatalog();
};

const getVaccineCatalogDetail = async (vaccineCatalogId) => {
  const vaccine = await findVaccineCatalogById(vaccineCatalogId);

  if (!vaccine) {
    throw new ApiError(404, 'Vacuna no encontrada.');
  }

  return vaccine;
};

const updateVaccineCatalog = async (vaccineCatalogId, payload, authenticatedUserId) => {
  const currentVaccine = await findVaccineCatalogById(vaccineCatalogId);

  if (!currentVaccine) {
    throw new ApiError(404, 'Vacuna no encontrada.');
  }

  const targetSpeciesId = payload.speciesId || currentVaccine.species_id;
  const targetName = payload.name || currentVaccine.name;

  if (payload.speciesId) {
    const species = await findSpeciesById(payload.speciesId);

    if (!species) {
      throw new ApiError(404, 'La especie asociada no existe.');
    }
  }

  if (payload.code && payload.code !== currentVaccine.code) {
    const existingVaccineByCode = await findVaccineCatalogByCode(payload.code);

    if (existingVaccineByCode && existingVaccineByCode.id !== vaccineCatalogId) {
      throw new ApiError(409, 'Ya existe una vacuna registrada con ese código.');
    }
  }

  const existingVaccineByNameAndSpecies = await findVaccineCatalogByNameAndSpeciesId(
    targetName,
    targetSpeciesId
  );

  if (existingVaccineByNameAndSpecies && existingVaccineByNameAndSpecies.id !== vaccineCatalogId) {
    throw new ApiError(409, 'Ya existe una vacuna con ese nombre para la especie indicada.');
  }

  return updateVaccineCatalogById(vaccineCatalogId, payload, authenticatedUserId);
};

const deleteVaccineCatalog = async (vaccineCatalogId, authenticatedUserId) => {
  const currentVaccine = await findVaccineCatalogById(vaccineCatalogId);

  if (!currentVaccine) {
    throw new ApiError(404, 'Vacuna no encontrada.');
  }

  return softDeleteVaccineCatalogById(vaccineCatalogId, authenticatedUserId);
};

module.exports = {
  createNewVaccineCatalog,
  listVaccinesCatalog,
  getVaccineCatalogDetail,
  updateVaccineCatalog,
  deleteVaccineCatalog,
};