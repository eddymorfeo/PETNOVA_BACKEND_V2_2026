const express = require('express');
const emailOutboxController = require('../controllers/emailOutboxController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', emailOutboxController.create);
router.get('/', emailOutboxController.findAll);
router.get('/:id', emailOutboxController.findOne);
router.patch('/:id', emailOutboxController.update);
router.delete('/:id', emailOutboxController.remove);

module.exports = router;