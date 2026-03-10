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
const roleRoutes = require('./roleRoutes');
const userRoleRoutes = require('./userRoleRoutes');
const workingHourRoutes = require('./workingHourRoutes');
const timeOffRoutes = require('./timeOffRoutes');
const appointmentTypeRoutes = require('./appointmentTypeRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const appointmentCheckinRoutes = require('./appointmentCheckinRoutes');

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
router.use('/roles', roleRoutes);
router.use('/user-roles', userRoleRoutes);
router.use('/working-hours', workingHourRoutes);
router.use('/time-off', timeOffRoutes);
router.use('/appointment-types', appointmentTypeRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/appointment-checkins', appointmentCheckinRoutes);

module.exports = router;