const express = require('express');
const treatmentController = require('../controllers/treatmentController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', treatmentController.create);
router.get('/', treatmentController.findAll);
router.get('/:id', treatmentController.findOne);
router.patch('/:id', treatmentController.update);
router.delete('/:id', treatmentController.remove);

module.exports = router;