const pool = require("../db/db");
const ApiError = require("../utils/apiError");

const assertClientAuth = (auth) => {
  if (!auth || auth.type !== "client") {
    throw new ApiError(
      403,
      "Este endpoint está disponible solo para clientes autenticados."
    );
  }
};

const findOwnedPet = async (petId, clientId) => {
  const query = `
    SELECT
      p.id,
      p.client_id,
      p.name,
      p.species_id,
      p.breed_id,
      p.sex,
      p.birth_date,
      p.color,
      p.microchip,
      p.is_sterilized,
      p.allergies,
      p.notes,
      p.is_active,
      p.created_at,
      p.updated_at,
      s.name AS species_name,
      b.name AS breed_name
    FROM pets p
    LEFT JOIN species s ON s.id = p.species_id
    LEFT JOIN breeds b ON b.id = p.breed_id
    WHERE p.id = $1
      AND p.client_id = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [petId, clientId]);
  return result.rows[0] || null;
};

const listClientMedicalRecordPets = async (auth) => {
  assertClientAuth(auth);

  const query = `
    SELECT
      p.id,
      p.name,
      p.sex,
      p.birth_date,
      p.color,
      p.is_active,
      s.name AS species_name,
      b.name AS breed_name,
      COUNT(DISTINCT c.id) AS consultations_count,
      MAX(c.created_at) AS last_consultation_date
    FROM pets p
    LEFT JOIN species s ON s.id = p.species_id
    LEFT JOIN breeds b ON b.id = p.breed_id
    LEFT JOIN consultations c ON c.pet_id = p.id
    WHERE p.client_id = $1
    GROUP BY
      p.id,
      p.name,
      p.sex,
      p.birth_date,
      p.color,
      p.is_active,
      s.name,
      b.name
    ORDER BY p.name ASC
  `;

  const result = await pool.query(query, [auth.sub]);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    sex: row.sex,
    birthDate: row.birth_date,
    color: row.color,
    isActive: row.is_active,
    speciesName: row.species_name,
    breedName: row.breed_name,
    consultationsCount: Number(row.consultations_count || 0),
    lastConsultationDate: row.last_consultation_date,
  }));
};

const getClientPetMedicalRecord = async (petId, auth) => {
  assertClientAuth(auth);

  const pet = await findOwnedPet(petId, auth.sub);

  if (!pet) {
    throw new ApiError(404, "Mascota no encontrada o sin acceso.");
  }

  const consultationsQuery = `
    SELECT
      c.id,
      c.appointment_id,
      c.pet_id,
      c.client_id,
      c.veterinarian_id,
      c.chief_complaint,
      c.anamnesis,
      c.physical_exam,
      c.assessment,
      c.plan,
      c.weight_kg,
      c.temperature_c,
      c.diagnosis,
      c.summary,
      c.created_at,
      c.updated_at,
      u.full_name AS veterinarian_name
    FROM consultations c
    LEFT JOIN veterinarians v ON v.id = c.veterinarian_id
    LEFT JOIN users u ON u.id = v.user_id
    WHERE c.pet_id = $1
      AND c.client_id = $2
    ORDER BY c.created_at DESC
  `;

  const consultationsResult = await pool.query(consultationsQuery, [
    petId,
    auth.sub,
  ]);

  const consultations = consultationsResult.rows;
  const consultationIds = consultations.map((consultation) => consultation.id);

  if (!consultationIds.length) {
    return {
      pet: {
        id: pet.id,
        name: pet.name,
        speciesName: pet.species_name,
        breedName: pet.breed_name,
        sex: pet.sex,
        birthDate: pet.birth_date,
        color: pet.color,
        microchip: pet.microchip,
        allergies: pet.allergies,
        notes: pet.notes,
      },
      summary: {
        totalConsultations: 0,
        lastConsultationDate: null,
      },
      consultations: [],
    };
  }

  const notesQuery = `
    SELECT
      id,
      consultation_id,
      note,
      created_at,
      updated_at
    FROM consultation_notes
    WHERE consultation_id = ANY($1::uuid[])
    ORDER BY created_at ASC
  `;

  const treatmentsQuery = `
    SELECT
      id,
      consultation_id,
      description,
      created_at,
      updated_at
    FROM treatments
    WHERE consultation_id = ANY($1::uuid[])
    ORDER BY created_at ASC
  `;

  const prescriptionsQuery = `
    SELECT
      id,
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_at,
      updated_at
    FROM prescriptions
    WHERE consultation_id = ANY($1::uuid[])
    ORDER BY created_at ASC
  `;

  const attachmentsQuery = `
    SELECT
      id,
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_at,
      updated_at
    FROM attachments
    WHERE consultation_id = ANY($1::uuid[])
    ORDER BY created_at ASC
  `;

  const [
    notesResult,
    treatmentsResult,
    prescriptionsResult,
    attachmentsResult,
  ] = await Promise.all([
    pool.query(notesQuery, [consultationIds]),
    pool.query(treatmentsQuery, [consultationIds]),
    pool.query(prescriptionsQuery, [consultationIds]),
    pool.query(attachmentsQuery, [consultationIds]),
  ]);

  const notesByConsultationId = new Map();
  const treatmentsByConsultationId = new Map();
  const prescriptionsByConsultationId = new Map();
  const attachmentsByConsultationId = new Map();

  for (const item of notesResult.rows) {
    const currentItems = notesByConsultationId.get(item.consultation_id) ?? [];
    currentItems.push({
      id: item.id,
      note: item.note,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    });
    notesByConsultationId.set(item.consultation_id, currentItems);
  }

  for (const item of treatmentsResult.rows) {
    const currentItems =
      treatmentsByConsultationId.get(item.consultation_id) ?? [];
    currentItems.push({
      id: item.id,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    });
    treatmentsByConsultationId.set(item.consultation_id, currentItems);
  }

  for (const item of prescriptionsResult.rows) {
    const currentItems =
      prescriptionsByConsultationId.get(item.consultation_id) ?? [];
    currentItems.push({
      id: item.id,
      medicationName: item.medication_name,
      dose: item.dose,
      frequency: item.frequency,
      duration: item.duration,
      notes: item.notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    });
    prescriptionsByConsultationId.set(item.consultation_id, currentItems);
  }

  for (const item of attachmentsResult.rows) {
    const currentItems =
      attachmentsByConsultationId.get(item.consultation_id) ?? [];
    currentItems.push({
      id: item.id,
      fileName: item.file_name,
      mimeType: item.mime_type,
      storageKey: item.storage_key,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    });
    attachmentsByConsultationId.set(item.consultation_id, currentItems);
  }

  return {
    pet: {
      id: pet.id,
      name: pet.name,
      speciesName: pet.species_name,
      breedName: pet.breed_name,
      sex: pet.sex,
      birthDate: pet.birth_date,
      color: pet.color,
      microchip: pet.microchip,
      allergies: pet.allergies,
      notes: pet.notes,
    },
    summary: {
      totalConsultations: consultations.length,
      lastConsultationDate: consultations[0]?.created_at ?? null,
    },
    consultations: consultations.map((consultation) => ({
      id: consultation.id,
      appointmentId: consultation.appointment_id,
      consultationDate: consultation.created_at,
      veterinarianName: consultation.veterinarian_name,
      chiefComplaint: consultation.chief_complaint,
      anamnesis: consultation.anamnesis,
      physicalExam: consultation.physical_exam,
      assessment: consultation.assessment,
      plan: consultation.plan,
      diagnosis: consultation.diagnosis,
      summary: consultation.summary,
      weightKg: consultation.weight_kg,
      temperatureC: consultation.temperature_c,
      createdAt: consultation.created_at,
      updatedAt: consultation.updated_at,
      consultationNotes: notesByConsultationId.get(consultation.id) ?? [],
      treatments: treatmentsByConsultationId.get(consultation.id) ?? [],
      prescriptions:
        prescriptionsByConsultationId.get(consultation.id) ?? [],
      attachments: attachmentsByConsultationId.get(consultation.id) ?? [],
    })),
  };
};

module.exports = {
  listClientMedicalRecordPets,
  getClientPetMedicalRecord,
};