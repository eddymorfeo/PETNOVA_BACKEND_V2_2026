const express = require('express');
const auditLogController = require('../controllers/auditLogController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', auditLogController.create);
router.get('/', auditLogController.findAll);
router.get('/:id', auditLogController.findOne);

module.exports = router;