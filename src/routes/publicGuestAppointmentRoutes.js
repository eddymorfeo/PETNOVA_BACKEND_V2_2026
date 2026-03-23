const express = require('express');
const publicGuestAppointmentController = require('../controllers/publicGuestAppointmentController');

const router = express.Router();

router.get('/appointment-types', publicGuestAppointmentController.listAppointmentTypes);
router.get('/veterinarians', publicGuestAppointmentController.listVeterinarians);
router.get('/species', publicGuestAppointmentController.listSpecies);
router.get('/breeds', publicGuestAppointmentController.listBreeds);
router.get('/available-times', publicGuestAppointmentController.listAvailableTimes);
router.post('/', publicGuestAppointmentController.create);

module.exports = router;
