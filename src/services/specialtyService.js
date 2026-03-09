const ApiError = require('../utils/apiError');
const {
  createSpecialty,
  findSpecialtyById,
  findSpecialtyByCode,
  getAllSpecialties,
  updateSpecialtyById,
  softDeleteSpecialtyById,
} = require('../models/specialtyModel');

const createNewSpecialty = async (payload, authenticatedUserId) => {
  const existingSpecialty = await findSpecialtyByCode(payload.code);

  if (existingSpecialty) {
    throw new ApiError(409, 'Ya existe una especialidad registrada con ese código.');
  }

  return createSpecialty({
    ...payload,
    createdBy: authenticatedUserId,
  });
};

const listSpecialties = async () => {
  return getAllSpecialties();
};

const getSpecialtyDetail = async (specialtyId) => {
  const specialty = await findSpecialtyById(specialtyId);

  if (!specialty) {
    throw new ApiError(404, 'Especialidad no encontrada.');
  }

  return specialty;
};

const updateSpecialty = async (specialtyId, payload, authenticatedUserId) => {
  const currentSpecialty = await findSpecialtyById(specialtyId);

  if (!currentSpecialty) {
    throw new ApiError(404, 'Especialidad no encontrada.');
  }

  if (payload.code && payload.code !== currentSpecialty.code) {
    const existingSpecialty = await findSpecialtyByCode(payload.code);

    if (existingSpecialty && existingSpecialty.id !== specialtyId) {
      throw new ApiError(409, 'Ya existe una especialidad registrada con ese código.');
    }
  }

  return updateSpecialtyById(specialtyId, payload, authenticatedUserId);
};

const deleteSpecialty = async (specialtyId, authenticatedUserId) => {
  const currentSpecialty = await findSpecialtyById(specialtyId);

  if (!currentSpecialty) {
    throw new ApiError(404, 'Especialidad no encontrada.');
  }

  return softDeleteSpecialtyById(specialtyId, authenticatedUserId);
};

module.exports = {
  createNewSpecialty,
  listSpecialties,
  getSpecialtyDetail,
  updateSpecialty,
  deleteSpecialty,
};