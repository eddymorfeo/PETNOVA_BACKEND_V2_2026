const express = require('express');
const specialtyController = require('../controllers/specialtyController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', specialtyController.create);
router.get('/', specialtyController.findAll);
router.get('/:id', specialtyController.findOne);
router.patch('/:id', specialtyController.update);
router.delete('/:id', specialtyController.remove);

module.exports = router;