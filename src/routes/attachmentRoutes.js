const express = require('express');
const attachmentController = require('../controllers/attachmentController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', attachmentController.create);
router.get('/', attachmentController.findAll);
router.get('/:id', attachmentController.findOne);
router.patch('/:id', attachmentController.update);
router.delete('/:id', attachmentController.remove);

module.exports = router;