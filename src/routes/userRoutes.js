const express = require('express');
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', userController.create);
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.patch('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;