const express = require('express');
const clientController = require('../controllers/clientController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', clientController.create);
router.get('/', clientController.findAll);
router.get('/:id', clientController.findOne);
router.patch('/:id', clientController.update);
router.delete('/:id', clientController.remove);

module.exports = router;