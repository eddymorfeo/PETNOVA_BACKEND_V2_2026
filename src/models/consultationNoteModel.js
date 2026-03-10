const pool = require('../db/db');

const createConsultationNote = async ({
  consultationId,
  note,
  createdBy,
}) => {
  const query = `
    INSERT INTO consultation_notes (
      consultation_id,
      note,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $3, NOW(), NOW())
    RETURNING
      id,
      consultation_id,
      note,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [consultationId, note, createdBy]);
  return result.rows[0];
};

const findConsultationNoteById = async (consultationNoteId) => {
  const query = `
    SELECT
      id,
      consultation_id,
      note,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM consultation_notes
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [consultationNoteId]);
  return result.rows[0] || null;
};

const getAllConsultationNotes = async () => {
  const query = `
    SELECT
      cn.id,
      cn.consultation_id,
      cn.note,
      cn.created_by,
      cn.updated_by,
      cn.created_at,
      cn.updated_at
    FROM consultation_notes cn
    ORDER BY cn.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateConsultationNoteById = async (consultationNoteId, note, updatedBy) => {
  const query = `
    UPDATE consultation_notes
    SET
      note = $2,
      updated_by = $3,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      note,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [consultationNoteId, note, updatedBy]);
  return result.rows[0] || null;
};

const deleteConsultationNoteById = async (consultationNoteId) => {
  const query = `
    DELETE FROM consultation_notes
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      note,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [consultationNoteId]);
  return result.rows[0] || null;
};

module.exports = {
  createConsultationNote,
  findConsultationNoteById,
  getAllConsultationNotes,
  updateConsultationNoteById,
  deleteConsultationNoteById,
};