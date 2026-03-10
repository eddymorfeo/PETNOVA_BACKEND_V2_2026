const {
  validateCreateRolePermission,
  validateDeleteRolePermission,
} = require('../schemas/rolePermissionSchemas');

const {
  assignPermissionToRole,
  listRolePermissions,
  listPermissionsByRole,
  removePermissionFromRole,
} = require('../services/rolePermissionService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateRolePermission(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const assignment = await assignPermissionToRole(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Permiso asignado correctamente al rol.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const assignments = await listRolePermissions();

    return res.status(200).json({
      success: true,
      message: 'Asignaciones de permisos obtenidas correctamente.',
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

const findByRole = async (req, res, next) => {
  try {
    const assignments = await listPermissionsByRole(req.params.roleId);

    return res.status(200).json({
      success: true,
      message: 'Permisos del rol obtenidos correctamente.',
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const validation = validateDeleteRolePermission(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const assignment = await removePermissionFromRole(req.body);

    return res.status(200).json({
      success: true,
      message: 'Permiso removido correctamente del rol.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findByRole,
  remove,
};