const express = require('express');
const medicationAdministeredController = require('../controllers/medicationAdministeredController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', medicationAdministeredController.create);
router.get('/', medicationAdministeredController.findAll);
router.get('/:id', medicationAdministeredController.findOne);
router.patch('/:id', medicationAdministeredController.update);
router.delete('/:id', medicationAdministeredController.remove);

module.exports = router;