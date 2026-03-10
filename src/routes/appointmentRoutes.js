const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', appointmentController.create);
router.get('/', appointmentController.findAll);
router.get('/:id', appointmentController.findOne);
router.patch('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

module.exports = router;