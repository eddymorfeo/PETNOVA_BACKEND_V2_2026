const express = require('express');
const petVaccinationController = require('../controllers/petVaccinationController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', petVaccinationController.create);
router.get('/', petVaccinationController.findAll);
router.get('/:id', petVaccinationController.findOne);
router.patch('/:id', petVaccinationController.update);
router.delete('/:id', petVaccinationController.remove);

module.exports = router;