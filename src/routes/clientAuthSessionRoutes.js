const express = require('express');
const clientAuthSessionController = require('../controllers/clientAuthSessionController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', clientAuthSessionController.create);
router.get('/', clientAuthSessionController.findAll);
router.get('/:id', clientAuthSessionController.findOne);
router.patch('/:id', clientAuthSessionController.update);
router.delete('/:id', clientAuthSessionController.remove);

module.exports = router;