const express = require('express');
const consultationNoteController = require('../controllers/consultationNoteController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', consultationNoteController.create);
router.get('/', consultationNoteController.findAll);
router.get('/:id', consultationNoteController.findOne);
router.patch('/:id', consultationNoteController.update);
router.delete('/:id', consultationNoteController.remove);

module.exports = router;