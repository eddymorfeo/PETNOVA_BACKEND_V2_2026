const express = require('express');
const passwordResetTokenController = require('../controllers/passwordResetTokenController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', passwordResetTokenController.create);
router.get('/', passwordResetTokenController.findAll);
router.get('/:id', passwordResetTokenController.findOne);
router.patch('/:id', passwordResetTokenController.update);
router.delete('/:id', passwordResetTokenController.remove);

module.exports = router;