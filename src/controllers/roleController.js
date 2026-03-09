const {
  validateCreateRole,
  validateUpdateRole,
} = require('../schemas/roleSchemas');

const {
  createNewRole,
  listRoles,
  getRoleDetail,
  updateRole,
  deleteRole,
} = require('../services/roleService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateRole(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const role = await createNewRole(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Rol creado correctamente.',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const roles = await listRoles();

    return res.status(200).json({
      success: true,
      message: 'Roles obtenidos correctamente.',
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const role = await getRoleDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Rol obtenido correctamente.',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateRole(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const role = await updateRole(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Rol actualizado correctamente.',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const role = await deleteRole(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Rol desactivado correctamente.',
      data: role,
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