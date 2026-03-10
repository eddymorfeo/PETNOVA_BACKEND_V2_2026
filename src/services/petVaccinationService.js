const ApiError = require('../utils/apiError');
const { findPetById } = require('../models/petModel');
const { findConsultationById } = require('../models/consultationModel');
const { findVaccineCatalogById } = require('../models/vaccineCatalogModel');
const {
  createPetVaccination,
  findPetVaccinationById,
  getAllPetVaccinations,
  updatePetVaccinationById,
  deletePetVaccinationById,
} = require('../models/petVaccinationModel');

const validateVaccinationDates = (appliedAt, nextDueAt) => {
  const applied = new Date(appliedAt);

  if (Number.isNaN(applied.getTime())) {
    throw new ApiError(400, 'appliedAt debe ser una fecha válida.');
  }

  if (nextDueAt !== undefined && nextDueAt !== null) {
    const nextDue = new Date(nextDueAt);

    if (Number.isNaN(nextDue.getTime())) {
      throw new ApiError(400, 'nextDueAt debe ser una fecha válida.');
    }

    if (nextDue < applied) {
      throw new ApiError(400, 'nextDueAt no puede ser menor que appliedAt.');
    }
  }
};

const createNewPetVaccination = async (payload, authenticatedUserId) => {
  const pet = await findPetById(payload.petId);

  if (!pet) {
    throw new ApiError(404, 'La mascota asociada no existe.');
  }

  const vaccine = await findVaccineCatalogById(payload.vaccineId);

  if (!vaccine) {
    throw new ApiError(404, 'La vacuna asociada no existe.');
  }

  if (payload.consultationId) {
    const consultation = await findConsultationById(payload.consultationId);

    if (!consultation) {
      throw new ApiError(404, 'La consulta asociada no existe.');
    }
  }

  validateVaccinationDates(payload.appliedAt, payload.nextDueAt);

  return createPetVaccination({
    petId: payload.petId,
    vaccineId: payload.vaccineId,
    appliedAt: payload.appliedAt,
    nextDueAt: payload.nextDueAt,
    consultationId: payload.consultationId,
    createdBy: authenticatedUserId,
  });
};

const listPetVaccinations = async () => {
  return getAllPetVaccinations();
};

const getPetVaccinationDetail = async (petVaccinationId) => {
  const petVaccination = await findPetVaccinationById(petVaccinationId);

  if (!petVaccination) {
    throw new ApiError(404, 'Vacunación no encontrada.');
  }

  return petVaccination;
};

const updatePetVaccination = async (petVaccinationId, payload, authenticatedUserId) => {
  const currentPetVaccination = await findPetVaccinationById(petVaccinationId);

  if (!currentPetVaccination) {
    throw new ApiError(404, 'Vacunación no encontrada.');
  }

  if (payload.vaccineId) {
    const vaccine = await findVaccineCatalogById(payload.vaccineId);

    if (!vaccine) {
      throw new ApiError(404, 'La vacuna asociada no existe.');
    }
  }

  if (payload.consultationId) {
    const consultation = await findConsultationById(payload.consultationId);

    if (!consultation) {
      throw new ApiError(404, 'La consulta asociada no existe.');
    }
  }

  const mergedAppliedAt = payload.appliedAt ?? currentPetVaccination.applied_at;
  const mergedNextDueAt = payload.nextDueAt ?? currentPetVaccination.next_due_at;

  validateVaccinationDates(mergedAppliedAt, mergedNextDueAt);

  return updatePetVaccinationById(petVaccinationId, payload, authenticatedUserId);
};

const deletePetVaccination = async (petVaccinationId) => {
  const currentPetVaccination = await findPetVaccinationById(petVaccinationId);

  if (!currentPetVaccination) {
    throw new ApiError(404, 'Vacunación no encontrada.');
  }

  return deletePetVaccinationById(petVaccinationId);
};

module.exports = {
  createNewPetVaccination,
  listPetVaccinations,
  getPetVaccinationDetail,
  updatePetVaccination,
  deletePetVaccination,
};