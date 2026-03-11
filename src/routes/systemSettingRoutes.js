const express = require('express');
const systemSettingController = require('../controllers/systemSettingController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', systemSettingController.findAll);
router.get('/:id', systemSettingController.findOne);
router.patch('/:id', systemSettingController.update);

module.exports = router;