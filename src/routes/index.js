const express = require('express');
const authUserRoutes = require('./authUserRoutes');
const clientRoutes = require('./clientRoutes');
const speciesRoutes = require('./speciesRoutes');
const breedRoutes = require('./breedRoutes');
const petRoutes = require('./petRoutes');
const router = express.Router();

//Ruta sin autenticación JWT
router.use('/auth/users', authUserRoutes);

//Rutas con autenticacion de JWT
router.use('/clients', clientRoutes);
router.use('/species', speciesRoutes);
router.use('/breeds', breedRoutes);
router.use('/pets', petRoutes);

module.exports = router;