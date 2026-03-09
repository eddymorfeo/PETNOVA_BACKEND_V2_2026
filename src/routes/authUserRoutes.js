const express = require('express');
const authUserController = require('../controllers/authUserController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.post('/login', authUserController.login);
router.get('/me', requireAuth, authUserController.me);

module.exports = router;