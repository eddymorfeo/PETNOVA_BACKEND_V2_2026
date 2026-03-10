const pool = require('../db/db');

const createConsultation = async ({
  appointmentId,
  petId,
  clientId,
  veterinarianId,
  chiefComplaint,
  anamnesis,
  physicalExam,
  assessment,
  plan,
  weightKg,
  temperatureC,
  diagnosis,
  summary,
  createdBy,
}) => {
  const query = `
    INSERT INTO consultations (
      appointment_id,
      pet_id,
      client_id,
      veterinarian_id,
      chief_complaint,
      anamnesis,
      physical_exam,
      assessment,
      plan,
      weight_kg,
      temperature_c,
      diagnosis,
      summary,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $14, NOW(), NOW()
    )
    RETURNING
      id,
      appointment_id,
      pet_id,
      client_id,
      veterinarian_id,
      chief_complaint,
      anamnesis,
      physical_exam,
      assessment,
      plan,
      weight_kg,
      temperature_c,
      diagnosis,
      summary,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [
    appointmentId,
    petId,
    clientId,
    veterinarianId,
    chiefComplaint || null,
    anamnesis || null,
    physicalExam || null,
    assessment || null,
    plan || null,
    weightKg ?? null,
    temperatureC ?? null,
    diagnosis || null,
    summary || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findConsultationById = async (consultationId) => {
  const query = `
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
      c.created_by,
      c.updated_by,
      c.created_at,
      c.updated_at,
      p.name AS pet_name,
      cl.full_name AS client_name,
      u.full_name AS veterinarian_name
    FROM consultations c
    INNER JOIN pets p ON p.id = c.pet_id
    INNER JOIN clients cl ON cl.id = c.client_id
    INNER JOIN veterinarians v ON v.id = c.veterinarian_id
    INNER JOIN users u ON u.id = v.user_id
    WHERE c.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [consultationId]);
  return result.rows[0] || null;
};

const findConsultationByAppointmentId = async (appointmentId) => {
  const query = `
    SELECT
      id,
      appointment_id,
      pet_id,
      client_id,
      veterinarian_id,
      chief_complaint,
      anamnesis,
      physical_exam,
      assessment,
      plan,
      weight_kg,
      temperature_c,
      diagnosis,
      summary,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM consultations
    WHERE appointment_id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [appointmentId]);
  return result.rows[0] || null;
};

const getAllConsultations = async () => {
  const query = `
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
      c.created_by,
      c.updated_by,
      c.created_at,
      c.updated_at,
      p.name AS pet_name,
      cl.full_name AS client_name,
      u.full_name AS veterinarian_name
    FROM consultations c
    INNER JOIN pets p ON p.id = c.pet_id
    INNER JOIN clients cl ON cl.id = c.client_id
    INNER JOIN veterinarians v ON v.id = c.veterinarian_id
    INNER JOIN users u ON u.id = v.user_id
    ORDER BY c.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateConsultationById = async (consultationId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.appointmentId !== undefined) {
    fields.push(`appointment_id = $${index++}`);
    values.push(data.appointmentId);
  }

  if (data.petId !== undefined) {
    fields.push(`pet_id = $${index++}`);
    values.push(data.petId);
  }

  if (data.clientId !== undefined) {
    fields.push(`client_id = $${index++}`);
    values.push(data.clientId);
  }

  if (data.veterinarianId !== undefined) {
    fields.push(`veterinarian_id = $${index++}`);
    values.push(data.veterinarianId);
  }

  if (data.chiefComplaint !== undefined) {
    fields.push(`chief_complaint = $${index++}`);
    values.push(data.chiefComplaint);
  }

  if (data.anamnesis !== undefined) {
    fields.push(`anamnesis = $${index++}`);
    values.push(data.anamnesis);
  }

  if (data.physicalExam !== undefined) {
    fields.push(`physical_exam = $${index++}`);
    values.push(data.physicalExam);
  }

  if (data.assessment !== undefined) {
    fields.push(`assessment = $${index++}`);
    values.push(data.assessment);
  }

  if (data.plan !== undefined) {
    fields.push(`plan = $${index++}`);
    values.push(data.plan);
  }

  if (data.weightKg !== undefined) {
    fields.push(`weight_kg = $${index++}`);
    values.push(data.weightKg);
  }

  if (data.temperatureC !== undefined) {
    fields.push(`temperature_c = $${index++}`);
    values.push(data.temperatureC);
  }

  if (data.diagnosis !== undefined) {
    fields.push(`diagnosis = $${index++}`);
    values.push(data.diagnosis);
  }

  if (data.summary !== undefined) {
    fields.push(`summary = $${index++}`);
    values.push(data.summary);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(consultationId);

  const query = `
    UPDATE consultations
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      appointment_id,
      pet_id,
      client_id,
      veterinarian_id,
      chief_complaint,
      anamnesis,
      physical_exam,
      assessment,
      plan,
      weight_kg,
      temperature_c,
      diagnosis,
      summary,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteConsultationById = async (consultationId) => {
  const query = `
    DELETE FROM consultations
    WHERE id = $1
    RETURNING
      id,
      appointment_id,
      pet_id,
      client_id,
      veterinarian_id,
      chief_complaint,
      anamnesis,
      physical_exam,
      assessment,
      plan,
      weight_kg,
      temperature_c,
      diagnosis,
      summary,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [consultationId]);
  return result.rows[0] || null;
};

module.exports = {
  createConsultation,
  findConsultationById,
  findConsultationByAppointmentId,
  getAllConsultations,
  updateConsultationById,
  deleteConsultationById,
};