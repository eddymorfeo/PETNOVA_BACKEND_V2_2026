const express = require('express');
const roleController = require('../controllers/roleController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', roleController.create);
router.get('/', roleController.findAll);
router.get('/:id', roleController.findOne);
router.patch('/:id', roleController.update);
router.delete('/:id', roleController.remove);

module.exports = router;