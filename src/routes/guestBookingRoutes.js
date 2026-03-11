const express = require('express');
const guestBookingController = require('../controllers/guestBookingController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', guestBookingController.create);
router.get('/', guestBookingController.findAll);
router.get('/:id', guestBookingController.findOne);
router.patch('/:id', guestBookingController.update);
router.delete('/:id', guestBookingController.remove);

module.exports = router;