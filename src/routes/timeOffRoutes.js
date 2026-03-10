const express = require('express');
const timeOffController = require('../controllers/timeOffController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', timeOffController.create);
router.get('/', timeOffController.findAll);
router.get('/:id', timeOffController.findOne);
router.patch('/:id', timeOffController.update);
router.delete('/:id', timeOffController.remove);

module.exports = router;