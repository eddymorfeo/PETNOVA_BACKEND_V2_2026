const express = require('express');
const consultationController = require('../controllers/consultationController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', consultationController.create);
router.get('/', consultationController.findAll);
router.get('/:id', consultationController.findOne);
router.patch('/:id', consultationController.update);
router.delete('/:id', consultationController.remove);

module.exports = router;