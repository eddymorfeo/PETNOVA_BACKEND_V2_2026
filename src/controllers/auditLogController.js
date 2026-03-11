const {
  validateCreateAuditLog,
} = require('../schemas/auditLogSchemas');

const {
  createNewAuditLog,
  listAuditLogs,
  getAuditLogDetail,
} = require('../services/auditLogService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateAuditLog(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const auditLog = await createNewAuditLog(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Registro de auditoría creado correctamente.',
      data: auditLog,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const auditLogs = await listAuditLogs();

    return res.status(200).json({
      success: true,
      message: 'Registros de auditoría obtenidos correctamente.',
      data: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const auditLog = await getAuditLogDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Registro de auditoría obtenido correctamente.',
      data: auditLog,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
};