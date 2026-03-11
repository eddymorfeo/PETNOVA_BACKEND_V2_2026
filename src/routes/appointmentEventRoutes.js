const express = require('express');
const appointmentEventController = require('../controllers/appointmentEventController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', appointmentEventController.create);
router.get('/', appointmentEventController.findAll);
router.get('/:id', appointmentEventController.findOne);
router.patch('/:id', appointmentEventController.update);
router.delete('/:id', appointmentEventController.remove);

module.exports = router;