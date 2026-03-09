const express = require('express');
const authUserRoutes = require('./authUserRoutes');
const router = express.Router();
const clientRoutes = require('./clientRoutes');
const speciesRoutes = require('./speciesRoutes');
const breedRoutes = require('./breedRoutes');
const petRoutes = require('./petRoutes');
const veterinarianRoutes = require('./veterinarianRoutes');
const specialtyRoutes = require('./specialtyRoutes');
const userRoutes = require('./userRoutes');

//Ruta sin autenticación JWT
router.use('/auth/users', authUserRoutes);

//Rutas con autenticacion de JWT
router.use('/clients', clientRoutes);
router.use('/species', speciesRoutes);
router.use('/breeds', breedRoutes);
router.use('/pets', petRoutes);
router.use('/veterinarians', veterinarianRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/users', userRoutes);

module.exports = router;