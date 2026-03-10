const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', prescriptionController.create);
router.get('/', prescriptionController.findAll);
router.get('/:id', prescriptionController.findOne);
router.patch('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.remove);

module.exports = router;