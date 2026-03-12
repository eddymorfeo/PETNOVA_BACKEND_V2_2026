const express = require('express');
const authClientController = require('../controllers/authClientController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.post('/register', authClientController.register);
router.post('/login', authClientController.login);
router.post('/forgot-password', authClientController.forgotPassword);
router.post('/reset-password', authClientController.resetPassword);
router.get('/me', requireAuth, authClientController.me);

module.exports = router;