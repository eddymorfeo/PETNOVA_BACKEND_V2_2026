const express = require('express');
const appointmentTypeController = require('../controllers/appointmentTypeController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', appointmentTypeController.create);
router.get('/', appointmentTypeController.findAll);
router.get('/:id', appointmentTypeController.findOne);
router.patch('/:id', appointmentTypeController.update);
router.delete('/:id', appointmentTypeController.remove);

module.exports = router;