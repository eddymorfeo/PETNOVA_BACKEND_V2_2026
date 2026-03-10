const pool = require('../db/db');

const createAttachment = async ({
  consultationId,
  fileName,
  mimeType,
  storageKey,
  createdBy,
}) => {
  const query = `
    INSERT INTO attachments (
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $5, NOW(), NOW())
    RETURNING
      id,
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    consultationId,
    fileName,
    mimeType || null,
    storageKey,
    createdBy,
  ]);

  return result.rows[0];
};

const findAttachmentById = async (attachmentId) => {
  const query = `
    SELECT
      id,
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM attachments
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [attachmentId]);
  return result.rows[0] || null;
};

const getAllAttachments = async () => {
  const query = `
    SELECT
      id,
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM attachments
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateAttachmentById = async (attachmentId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.fileName !== undefined) {
    fields.push(`file_name = $${index++}`);
    values.push(data.fileName);
  }

  if (data.mimeType !== undefined) {
    fields.push(`mime_type = $${index++}`);
    values.push(data.mimeType);
  }

  if (data.storageKey !== undefined) {
    fields.push(`storage_key = $${index++}`);
    values.push(data.storageKey);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(attachmentId);

  const query = `
    UPDATE attachments
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteAttachmentById = async (attachmentId) => {
  const query = `
    DELETE FROM attachments
    WHERE id = $1
    RETURNING
      id,
      consultation_id,
      file_name,
      mime_type,
      storage_key,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [attachmentId]);
  return result.rows[0] || null;
};

module.exports = {
  createAttachment,
  findAttachmentById,
  getAllAttachments,
  updateAttachmentById,
  deleteAttachmentById,
};