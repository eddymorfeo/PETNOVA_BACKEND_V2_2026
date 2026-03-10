const pool = require('../db/db');

const createPrescription = async ({
  consultationId,
  medicationName,
  dose,
  frequency,
  duration,
  notes,
  createdBy,
}) => {
  const query = `
    INSERT INTO prescriptions (
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7, NOW(), NOW())
    RETURNING
      id,
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    consultationId,
    medicationName,
    dose,
    frequency,
    duration,
    notes || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findPrescriptionById = async (prescriptionId) => {
  const query = `
    SELECT
      id,
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM prescriptions
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [prescriptionId]);
  return result.rows[0] || null;
};

const getAllPrescriptions = async () => {
  const query = `
    SELECT
      id,
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM prescriptions
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updatePrescriptionById = async (prescriptionId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.medicationName !== undefined) {
    fields.push(`medication_name = $${index++}`);
    values.push(data.medicationName);
  }

  if (data.dose !== undefined) {
    fields.push(`dose = $${index++}`);
    values.push(data.dose);
  }

  if (data.frequency !== undefined) {
    fields.push(`frequency = $${index++}`);
    values.push(data.frequency);
  }

  if (data.duration !== undefined) {
    fields.push(`duration = $${index++}`);
    values.push(data.duration);
  }

  if (data.notes !== undefined) {
    fields.push(`notes = $${index++}`);
    values.push(data.notes);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(prescriptionId);

  const query = `
    UPDATE prescriptions
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deletePrescriptionById = async (prescriptionId) => {
  const query = `
    DELETE FROM prescriptions
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      medication_name,
      dose,
      frequency,
      duration,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [prescriptionId]);
  return result.rows[0] || null;
};

module.exports = {
  createPrescription,
  findPrescriptionById,
  getAllPrescriptions,
  updatePrescriptionById,
  deletePrescriptionById,
};