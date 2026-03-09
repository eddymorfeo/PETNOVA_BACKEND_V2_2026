const express = require('express');
const veterinarianController = require('../controllers/veterinarianController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', veterinarianController.create);
router.get('/', veterinarianController.findAll);
router.get('/:id', veterinarianController.findOne);
router.patch('/:id', veterinarianController.update);
router.delete('/:id', veterinarianController.remove);

module.exports = router;