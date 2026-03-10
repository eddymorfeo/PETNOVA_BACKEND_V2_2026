const ApiError = require('../utils/apiError');
const { findConsultationById } = require('../models/consultationModel');
const {
  createConsultationNote,
  findConsultationNoteById,
  getAllConsultationNotes,
  updateConsultationNoteById,
  deleteConsultationNoteById,
} = require('../models/consultationNoteModel');

const createNewConsultationNote = async (payload, authenticatedUserId) => {
  const consultation = await findConsultationById(payload.consultationId);

  if (!consultation) {
    throw new ApiError(404, 'La consulta asociada no existe.');
  }

  return createConsultationNote({
    consultationId: payload.consultationId,
    note: payload.note,
    createdBy: authenticatedUserId,
  });
};

const listConsultationNotes = async () => {
  return getAllConsultationNotes();
};

const getConsultationNoteDetail = async (consultationNoteId) => {
  const consultationNote = await findConsultationNoteById(consultationNoteId);

  if (!consultationNote) {
    throw new ApiError(404, 'Nota de consulta no encontrada.');
  }

  return consultationNote;
};

const updateConsultationNote = async (consultationNoteId, payload, authenticatedUserId) => {
  const currentConsultationNote = await findConsultationNoteById(consultationNoteId);

  if (!currentConsultationNote) {
    throw new ApiError(404, 'Nota de consulta no encontrada.');
  }

  return updateConsultationNoteById(
    consultationNoteId,
    payload.note,
    authenticatedUserId
  );
};

const deleteConsultationNote = async (consultationNoteId) => {
  const currentConsultationNote = await findConsultationNoteById(consultationNoteId);

  if (!currentConsultationNote) {
    throw new ApiError(404, 'Nota de consulta no encontrada.');
  }

  return deleteConsultationNoteById(consultationNoteId);
};

module.exports = {
  createNewConsultationNote,
  listConsultationNotes,
  getConsultationNoteDetail,
  updateConsultationNote,
  deleteConsultationNote,
};