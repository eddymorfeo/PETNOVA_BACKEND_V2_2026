const ApiError = require('../utils/apiError');
const { findConsultationById } = require('../models/consultationModel');
const {
  createTreatment,
  findTreatmentById,
  getAllTreatments,
  updateTreatmentById,
  deleteTreatmentById,
} = require('../models/treatmentModel');

const createNewTreatment = async (payload, authenticatedUserId) => {
  const consultation = await findConsultationById(payload.consultationId);

  if (!consultation) {
    throw new ApiError(404, 'La consulta asociada no existe.');
  }

  return createTreatment({
    consultationId: payload.consultationId,
    description: payload.description,
    createdBy: authenticatedUserId,
  });
};

const listTreatments = async () => {
  return getAllTreatments();
};

const getTreatmentDetail = async (treatmentId) => {
  const treatment = await findTreatmentById(treatmentId);

  if (!treatment) {
    throw new ApiError(404, 'Tratamiento no encontrado.');
  }

  return treatment;
};

const updateTreatment = async (treatmentId, payload, authenticatedUserId) => {
  const currentTreatment = await findTreatmentById(treatmentId);

  if (!currentTreatment) {
    throw new ApiError(404, 'Tratamiento no encontrado.');
  }

  return updateTreatmentById(
    treatmentId,
    payload.description,
    authenticatedUserId
  );
};

const deleteTreatment = async (treatmentId) => {
  const currentTreatment = await findTreatmentById(treatmentId);

  if (!currentTreatment) {
    throw new ApiError(404, 'Tratamiento no encontrado.');
  }

  return deleteTreatmentById(treatmentId);
};

module.exports = {
  createNewTreatment,
  listTreatments,
  getTreatmentDetail,
  updateTreatment,
  deleteTreatment,
};