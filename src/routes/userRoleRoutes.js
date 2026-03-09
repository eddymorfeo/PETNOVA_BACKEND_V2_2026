const express = require('express');
const userRoleController = require('../controllers/userRoleController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', userRoleController.create);
router.get('/', userRoleController.findAll);
router.get('/:userId', userRoleController.findByUser);
router.delete('/', userRoleController.remove);

module.exports = router;