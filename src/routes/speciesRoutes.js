const express = require('express');
const speciesController = require('../controllers/speciesController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', speciesController.create);
router.get('/', speciesController.findAll);
router.get('/:id', speciesController.findOne);
router.patch('/:id', speciesController.update);
router.delete('/:id', speciesController.remove);

module.exports = router;