const pool = require('../db/db');

const createTreatment = async ({
  consultationId,
  description,
  createdBy,
}) => {
  const query = `
    INSERT INTO treatments (
      consultation_id,
      description,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $3, NOW(), NOW())
    RETURNING
      id,
      consultation_id,
      description,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [consultationId, description, createdBy]);
  return result.rows[0];
};

const findTreatmentById = async (treatmentId) => {
  const query = `
    SELECT
      id,
      consultation_id,
      description,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM treatments
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [treatmentId]);
  return result.rows[0] || null;
};

const getAllTreatments = async () => {
  const query = `
    SELECT
      t.id,
      t.consultation_id,
      t.description,
      t.created_by,
      t.updated_by,
      t.created_at,
      t.updated_at
    FROM treatments t
    ORDER BY t.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateTreatmentById = async (treatmentId, description, updatedBy) => {
  const query = `
    UPDATE treatments
    SET
      description = $2,
      updated_by = $3,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      description,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [treatmentId, description, updatedBy]);
  return result.rows[0] || null;
};

const deleteTreatmentById = async (treatmentId) => {
  const query = `
    DELETE FROM treatments
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      description,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [treatmentId]);
  return result.rows[0] || null;
};

module.exports = {
  createTreatment,
  findTreatmentById,
  getAllTreatments,
  updateTreatmentById,
  deleteTreatmentById,
};