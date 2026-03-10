const express = require('express');
const appointmentCheckinController = require('../controllers/appointmentCheckinController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', appointmentCheckinController.create);
router.get('/', appointmentCheckinController.findAll);
router.get('/:id', appointmentCheckinController.findOne);
router.patch('/:id', appointmentCheckinController.update);
router.delete('/:id', appointmentCheckinController.remove);

module.exports = router;