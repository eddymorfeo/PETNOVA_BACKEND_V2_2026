const pool = require('../db/db');

const createMedicationAdministered = async ({
  consultationId,
  name,
  dose,
  route,
  notes,
  createdBy,
}) => {
  const query = `
    INSERT INTO medications_administered (
      consultation_id,
      name,
      dose,
      route,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $6, NOW(), NOW())
    RETURNING
      id,
      consultation_id,
      name,
      dose,
      route,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    consultationId,
    name,
    dose || null,
    route || null,
    notes || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findMedicationAdministeredById = async (medicationAdministeredId) => {
  const query = `
    SELECT
      id,
      consultation_id,
      name,
      dose,
      route,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM medications_administered
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [medicationAdministeredId]);
  return result.rows[0] || null;
};

const getAllMedicationsAdministered = async () => {
  const query = `
    SELECT
      id,
      consultation_id,
      name,
      dose,
      route,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM medications_administered
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateMedicationAdministeredById = async (
  medicationAdministeredId,
  data,
  updatedBy
) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(data.name);
  }

  if (data.dose !== undefined) {
    fields.push(`dose = $${index++}`);
    values.push(data.dose);
  }

  if (data.route !== undefined) {
    fields.push(`route = $${index++}`);
    values.push(data.route);
  }

  if (data.notes !== undefined) {
    fields.push(`notes = $${index++}`);
    values.push(data.notes);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(medicationAdministeredId);

  const query = `
    UPDATE medications_administered
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      consultation_id,
      name,
      dose,
      route,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteMedicationAdministeredById = async (medicationAdministeredId) => {
  const query = `
    DELETE FROM medications_administered
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      name,
      dose,
      route,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [medicationAdministeredId]);
  return result.rows[0] || null;
};

module.exports = {
  createMedicationAdministered,
  findMedicationAdministeredById,
  getAllMedicationsAdministered,
  updateMedicationAdministeredById,
  deleteMedicationAdministeredById,
};