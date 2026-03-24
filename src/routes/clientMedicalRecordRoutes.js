const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const clientMedicalRecordController = require("../controllers/clientMedicalRecordController");

const router = express.Router();

router.use(requireAuth);

router.get("/pets", clientMedicalRecordController.findMyPetsWithMedicalRecords);
router.get("/pets/:petId", clientMedicalRecordController.findMyPetMedicalRecord);

module.exports = router;