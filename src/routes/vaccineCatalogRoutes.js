const express = require('express');
const vaccineCatalogController = require('../controllers/vaccineCatalogController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', vaccineCatalogController.create);
router.get('/', vaccineCatalogController.findAll);
router.get('/:id', vaccineCatalogController.findOne);
router.patch('/:id', vaccineCatalogController.update);
router.delete('/:id', vaccineCatalogController.remove);

module.exports = router;