const express = require('express');
const workingHourController = require('../controllers/workingHourController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', workingHourController.create);
router.get('/', workingHourController.findAll);
router.get('/:id', workingHourController.findOne);
router.patch('/:id', workingHourController.update);
router.delete('/:id', workingHourController.remove);

module.exports = router;