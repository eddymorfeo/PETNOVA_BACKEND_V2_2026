const {
  validateCreateUser,
  validateUpdateUser,
} = require('../schemas/userSchemas');

const {
  createNewUser,
  listUsers,
  getUserDetail,
  updateUser,
  deleteUser,
} = require('../services/userService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateUser(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const user = await createNewUser(req.body, req.auth.sub);

    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const users = await listUsers();

    return res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos correctamente.',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const user = await getUserDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Usuario obtenido correctamente.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateUser(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const user = await updateUser(req.params.id, req.body, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id, req.auth.sub);

    return res.status(200).json({
      success: true,
      message: 'Usuario desactivado correctamente.',
      data: user,
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