const {
  validateUpdateSystemSetting,
} = require('../schemas/systemSettingSchemas');

const {
  listSystemSettings,
  getSystemSettingDetail,
  updateSystemSetting,
} = require('../services/systemSettingService');

const findAll = async (req, res, next) => {
  try {
    const systemSettings = await listSystemSettings();

    return res.status(200).json({
      success: true,
      message: 'Configuraciones del sistema obtenidas correctamente.',
      data: systemSettings,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const systemSetting = await getSystemSettingDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Configuración del sistema obtenida correctamente.',
      data: systemSetting,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateSystemSetting(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const systemSetting = await updateSystemSetting(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Configuración del sistema actualizada correctamente.',
      data: systemSetting,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  findOne,
  update,
};