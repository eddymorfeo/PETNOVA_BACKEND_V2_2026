const ApiError = require('../utils/apiError');
const { findConsultationById } = require('../models/consultationModel');
const {
  createMedicationAdministered,
  findMedicationAdministeredById,
  getAllMedicationsAdministered,
  updateMedicationAdministeredById,
  deleteMedicationAdministeredById,
} = require('../models/medicationAdministeredModel');

const createNewMedicationAdministered = async (payload, authenticatedUserId) => {
  const consultation = await findConsultationById(payload.consultationId);

  if (!consultation) {
    throw new ApiError(404, 'La consulta asociada no existe.');
  }

  return createMedicationAdministered({
    consultationId: payload.consultationId,
    name: payload.name,
    dose: payload.dose,
    route: payload.route,
    notes: payload.notes,
    createdBy: authenticatedUserId,
  });
};

const listMedicationsAdministered = async () => {
  return getAllMedicationsAdministered();
};

const getMedicationAdministeredDetail = async (medicationAdministeredId) => {
  const medicationAdministered = await findMedicationAdministeredById(medicationAdministeredId);

  if (!medicationAdministered) {
    throw new ApiError(404, 'Medicamento administrado no encontrado.');
  }

  return medicationAdministered;
};

const updateMedicationAdministered = async (
  medicationAdministeredId,
  payload,
  authenticatedUserId
) => {
  const currentMedicationAdministered = await findMedicationAdministeredById(
    medicationAdministeredId
  );

  if (!currentMedicationAdministered) {
    throw new ApiError(404, 'Medicamento administrado no encontrado.');
  }

  return updateMedicationAdministeredById(
    medicationAdministeredId,
    payload,
    authenticatedUserId
  );
};

const deleteMedicationAdministered = async (medicationAdministeredId) => {
  const currentMedicationAdministered = await findMedicationAdministeredById(
    medicationAdministeredId
  );

  if (!currentMedicationAdministered) {
    throw new ApiError(404, 'Medicamento administrado no encontrado.');
  }

  return deleteMedicationAdministeredById(medicationAdministeredId);
};

module.exports = {
  createNewMedicationAdministered,
  listMedicationsAdministered,
  getMedicationAdministeredDetail,
  updateMedicationAdministered,
  deleteMedicationAdministered,
};