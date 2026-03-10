const {
  validateCreatePermission,
  validateUpdatePermission,
} = require('../schemas/permissionSchemas');

const {
  createNewPermission,
  listPermissions,
  getPermissionDetail,
  updatePermission,
  deletePermission,
} = require('../services/permissionService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreatePermission(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const permission = await createNewPermission(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Permiso creado correctamente.',
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const permissions = await listPermissions();

    return res.status(200).json({
      success: true,
      message: 'Permisos obtenidos correctamente.',
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const permission = await getPermissionDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Permiso obtenido correctamente.',
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdatePermission(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const permission = await updatePermission(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Permiso actualizado correctamente.',
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const permission = await deletePermission(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Permiso desactivado correctamente.',
      data: permission,
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