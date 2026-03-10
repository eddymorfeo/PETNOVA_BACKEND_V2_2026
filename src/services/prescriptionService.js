const ApiError = require('../utils/apiError');
const { findConsultationById } = require('../models/consultationModel');
const {
  createPrescription,
  findPrescriptionById,
  getAllPrescriptions,
  updatePrescriptionById,
  deletePrescriptionById,
} = require('../models/prescriptionModel');

const createNewPrescription = async (payload, authenticatedUserId) => {
  const consultation = await findConsultationById(payload.consultationId);

  if (!consultation) {
    throw new ApiError(404, 'La consulta asociada no existe.');
  }

  return createPrescription({
    consultationId: payload.consultationId,
    medicationName: payload.medicationName,
    dose: payload.dose,
    frequency: payload.frequency,
    duration: payload.duration,
    notes: payload.notes,
    createdBy: authenticatedUserId,
  });
};

const listPrescriptions = async () => {
  return getAllPrescriptions();
};

const getPrescriptionDetail = async (prescriptionId) => {
  const prescription = await findPrescriptionById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, 'Prescripción no encontrada.');
  }

  return prescription;
};

const updatePrescription = async (prescriptionId, payload, authenticatedUserId) => {
  const currentPrescription = await findPrescriptionById(prescriptionId);

  if (!currentPrescription) {
    throw new ApiError(404, 'Prescripción no encontrada.');
  }

  return updatePrescriptionById(prescriptionId, payload, authenticatedUserId);
};

const deletePrescription = async (prescriptionId) => {
  const currentPrescription = await findPrescriptionById(prescriptionId);

  if (!currentPrescription) {
    throw new ApiError(404, 'Prescripción no encontrada.');
  }

  return deletePrescriptionById(prescriptionId);
};

module.exports = {
  createNewPrescription,
  listPrescriptions,
  getPrescriptionDetail,
  updatePrescription,
  deletePrescription,
};