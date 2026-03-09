const {
  validateCreateUserRole,
  validateDeleteUserRole,
} = require('../schemas/userRoleSchemas');

const {
  assignRoleToUser,
  listUserRoles,
  listRolesByUser,
  removeRoleFromUser,
} = require('../services/userRoleService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateUserRole(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const assignment = await assignRoleToUser(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Rol asignado correctamente.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const assignments = await listUserRoles();

    return res.status(200).json({
      success: true,
      message: 'Asignaciones de roles obtenidas correctamente.',
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

const findByUser = async (req, res, next) => {
  try {
    const assignments = await listRolesByUser(req.params.userId);

    return res.status(200).json({
      success: true,
      message: 'Roles del usuario obtenidos correctamente.',
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const validation = validateDeleteUserRole(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const assignment = await removeRoleFromUser(req.body);

    return res.status(200).json({
      success: true,
      message: 'Rol removido correctamente del usuario.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findByUser,
  remove,
};