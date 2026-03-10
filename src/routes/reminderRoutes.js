const express = require('express');
const reminderController = require('../controllers/reminderController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', reminderController.create);
router.get('/', reminderController.findAll);
router.get('/:id', reminderController.findOne);
router.patch('/:id', reminderController.update);
router.delete('/:id', reminderController.remove);

module.exports = router;