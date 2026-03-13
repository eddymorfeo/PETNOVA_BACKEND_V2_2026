const express = require('express');
const petController = require('../controllers/petController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', petController.create);
router.get('/', petController.findAll);
router.get('/client/:clientId', petController.findByClient);
router.get('/:id', petController.findOne);
router.patch('/:id', petController.update);
router.delete('/:id', petController.remove);

module.exports = router;