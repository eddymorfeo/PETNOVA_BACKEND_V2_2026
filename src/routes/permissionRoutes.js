const express = require('express');
const permissionController = require('../controllers/permissionController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', permissionController.create);
router.get('/', permissionController.findAll);
router.get('/:id', permissionController.findOne);
router.patch('/:id', permissionController.update);
router.delete('/:id', permissionController.remove);

module.exports = router;