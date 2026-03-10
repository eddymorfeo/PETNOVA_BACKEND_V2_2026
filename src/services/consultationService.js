const ApiError = require('../utils/apiError');
const { findAppointmentById, updateAppointmentById } = require('../models/appointmentModel');
const { findPetById } = require('../models/petModel');
const { findClientById } = require('../models/clientModel');
const { findVeterinarianById } = require('../models/veterinarianModel');
const {
  createConsultation,
  findConsultationById,
  findConsultationByAppointmentId,
  getAllConsultations,
  updateConsultationById,
  deleteConsultationById,
} = require('../models/consultationModel');

const validateConsultationRelations = async ({
  appointmentId,
  petId,
  clientId,
  veterinarianId,
}) => {
  if (appointmentId !== undefined) {
    const appointment = await findAppointmentById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, 'La cita asociada no existe.');
    }
  }

  if (petId !== undefined) {
    const pet = await findPetById(petId);
    if (!pet) {
      throw new ApiError(404, 'La mascota asociada no existe.');
    }
  }

  if (clientId !== undefined) {
    const client = await findClientById(clientId);
    if (!client) {
      throw new ApiError(404, 'El cliente asociado no existe.');
    }
  }

  if (veterinarianId !== undefined) {
    const veterinarian = await findVeterinarianById(veterinarianId);
    if (!veterinarian) {
      throw new ApiError(404, 'El veterinario asociado no existe.');
    }
  }
};

const validateNumericFields = (payload) => {
  if (payload.weightKg !== undefined && payload.weightKg < 0) {
    throw new ApiError(400, 'weightKg no puede ser negativo.');
  }

  if (payload.temperatureC !== undefined && payload.temperatureC < 0) {
    throw new ApiError(400, 'temperatureC no puede ser negativo.');
  }
};

const createNewConsultation = async (payload, authenticatedUserId) => {
  await validateConsultationRelations({
    appointmentId: payload.appointmentId,
    petId: payload.petId,
    clientId: payload.clientId,
    veterinarianId: payload.veterinarianId,
  });

  validateNumericFields(payload);

  const existingConsultation = await findConsultationByAppointmentId(payload.appointmentId);

  if (existingConsultation) {
    throw new ApiError(409, 'La cita ya tiene una consulta registrada.');
  }

  const createdConsultation = await createConsultation({
    ...payload,
    createdBy: authenticatedUserId,
  });

  await updateAppointmentById(
    payload.appointmentId,
    { status: 'COMPLETED' },
    authenticatedUserId
  );

  return createdConsultation;
};

const listConsultations = async () => {
  return getAllConsultations();
};

const getConsultationDetail = async (consultationId) => {
  const consultation = await findConsultationById(consultationId);

  if (!consultation) {
    throw new ApiError(404, 'Consulta no encontrada.');
  }

  return consultation;
};

const updateConsultation = async (consultationId, payload, authenticatedUserId) => {
  const currentConsultation = await findConsultationById(consultationId);

  if (!currentConsultation) {
    throw new ApiError(404, 'Consulta no encontrada.');
  }

  await validateConsultationRelations({
    appointmentId: payload.appointmentId,
    petId: payload.petId,
    clientId: payload.clientId,
    veterinarianId: payload.veterinarianId,
  });

  validateNumericFields(payload);

  if (
    payload.appointmentId &&
    payload.appointmentId !== currentConsultation.appointment_id
  ) {
    const existingConsultation = await findConsultationByAppointmentId(payload.appointmentId);

    if (existingConsultation && existingConsultation.id !== consultationId) {
      throw new ApiError(409, 'La cita ya tiene una consulta registrada.');
    }
  }

  return updateConsultationById(consultationId, payload, authenticatedUserId);
};

const deleteConsultation = async (consultationId, authenticatedUserId) => {
  const currentConsultation = await findConsultationById(consultationId);

  if (!currentConsultation) {
    throw new ApiError(404, 'Consulta no encontrada.');
  }

  const deletedConsultation = await deleteConsultationById(consultationId);

  await updateAppointmentById(
    currentConsultation.appointment_id,
    { status: 'IN_PROGRESS' },
    authenticatedUserId
  );

  return deletedConsultation;
};

module.exports = {
  createNewConsultation,
  listConsultations,
  getConsultationDetail,
  updateConsultation,
  deleteConsultation,
};