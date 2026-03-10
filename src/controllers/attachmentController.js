const {
  validateCreateAttachment,
  validateUpdateAttachment,
} = require('../schemas/attachmentSchemas');

const {
  createNewAttachment,
  listAttachments,
  getAttachmentDetail,
  updateAttachment,
  deleteAttachment,
} = require('../services/attachmentService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateAttachment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const attachment = await createNewAttachment(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Adjunto creado correctamente.',
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const attachments = await listAttachments();

    return res.status(200).json({
      success: true,
      message: 'Adjuntos obtenidos correctamente.',
      data: attachments,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const attachment = await getAttachmentDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Adjunto obtenido correctamente.',
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateAttachment(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const attachment = await updateAttachment(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Adjunto actualizado correctamente.',
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const attachment = await deleteAttachment(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Adjunto eliminado correctamente.',
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};