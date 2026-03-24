const {
  listClientMedicalRecordPets,
  getClientPetMedicalRecord,
} = require("../services/clientMedicalRecordService");

const findMyPetsWithMedicalRecords = async (req, res, next) => {
  try {
    const pets = await listClientMedicalRecordPets(req.auth);

    return res.status(200).json({
      success: true,
      message: "Mascotas con ficha clínica obtenidas correctamente.",
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

const findMyPetMedicalRecord = async (req, res, next) => {
  try {
    const medicalRecord = await getClientPetMedicalRecord(req.params.petId, req.auth);

    return res.status(200).json({
      success: true,
      message: "Ficha clínica obtenida correctamente.",
      data: medicalRecord,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findMyPetsWithMedicalRecords,
  findMyPetMedicalRecord,
};