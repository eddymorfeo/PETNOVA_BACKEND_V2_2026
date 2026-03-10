const ApiError = require('../utils/apiError');
const { findConsultationById } = require('../models/consultationModel');
const {
  createAttachment,
  findAttachmentById,
  getAllAttachments,
  updateAttachmentById,
  deleteAttachmentById,
} = require('../models/attachmentModel');

const createNewAttachment = async (payload, authenticatedUserId) => {
  const consultation = await findConsultationById(payload.consultationId);

  if (!consultation) {
    throw new ApiError(404, 'La consulta asociada no existe.');
  }

  return createAttachment({
    consultationId: payload.consultationId,
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    storageKey: payload.storageKey,
    createdBy: authenticatedUserId,
  });
};

const listAttachments = async () => {
  return getAllAttachments();
};

const getAttachmentDetail = async (attachmentId) => {
  const attachment = await findAttachmentById(attachmentId);

  if (!attachment) {
    throw new ApiError(404, 'Adjunto no encontrado.');
  }

  return attachment;
};

const updateAttachment = async (attachmentId, payload, authenticatedUserId) => {
  const currentAttachment = await findAttachmentById(attachmentId);

  if (!currentAttachment) {
    throw new ApiError(404, 'Adjunto no encontrado.');
  }

  return updateAttachmentById(attachmentId, payload, authenticatedUserId);
};

const deleteAttachment = async (attachmentId) => {
  const currentAttachment = await findAttachmentById(attachmentId);

  if (!currentAttachment) {
    throw new ApiError(404, 'Adjunto no encontrado.');
  }

  return deleteAttachmentById(attachmentId);
};

module.exports = {
  createNewAttachment,
  listAttachments,
  getAttachmentDetail,
  updateAttachment,
  deleteAttachment,
};