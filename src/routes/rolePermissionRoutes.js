const express = require('express');
const rolePermissionController = require('../controllers/rolePermissionController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', rolePermissionController.create);
router.get('/', rolePermissionController.findAll);
router.get('/:roleId', rolePermissionController.findByRole);
router.delete('/', rolePermissionController.remove);

module.exports = router;