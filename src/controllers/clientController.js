const {
  validateCreateClient,
  validateUpdateClient,
} = require('../schemas/clientSchemas');

const {
  createNewClient,
  listClients,
  getClientDetail,
  updateClient,
  deleteClient,
} = require('../services/clientService');

const create = async (req, res, next) => {
  try {
    const validation = validateCreateClient(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const authenticatedUserId = req.auth.sub;

    const client = await createNewClient(req.body, authenticatedUserId);

    return res.status(201).json({
      success: true,
      message: 'Cliente creado correctamente.',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const clients = await listClients();

    return res.status(200).json({
      success: true,
      message: 'Clientes obtenidos correctamente.',
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const client = await getClientDetail(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Cliente obtenido correctamente.',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validation = validateUpdateClient(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const authenticatedUserId = req.auth.sub;

    const client = await updateClient(req.params.id, req.body, authenticatedUserId);

    return res.status(200).json({
      success: true,
      message: 'Cliente actualizado correctamente.',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const authenticatedUserId = req.auth.sub;

    const client = await deleteClient(req.params.id, authenticatedUserId);

    return res.status(200).json({
      success: true,
      message: 'Cliente desactivado correctamente.',
      data: client,
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