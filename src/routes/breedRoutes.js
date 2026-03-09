const express = require('express');
const breedController = require('../controllers/breedController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', breedController.create);
router.get('/', breedController.findAll);
router.get('/:id', breedController.findOne);
router.patch('/:id', breedController.update);
router.delete('/:id', breedController.remove);

module.exports = router;