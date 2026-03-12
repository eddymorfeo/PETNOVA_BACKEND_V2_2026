const pool = require("../db/db");

const createPasswordResetToken = async ({
  subjectType,
  subjectId,
  tokenHash,
  expiresAt,
  usedAt,
  createdBy,
}) => {
  const query = `
    INSERT INTO password_reset_tokens (
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $6, NOW(), NOW())
    RETURNING
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    subjectType,
    subjectId,
    tokenHash,
    expiresAt,
    usedAt || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findPasswordResetTokenById = async (passwordResetTokenId) => {
  const query = `
    SELECT
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM password_reset_tokens
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [passwordResetTokenId]);
  return result.rows[0] || null;
};

const getAllPasswordResetTokens = async () => {
  const query = `
    SELECT
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM password_reset_tokens
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updatePasswordResetTokenById = async (
  passwordResetTokenId,
  data,
  updatedBy,
) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.tokenHash !== undefined) {
    fields.push(`token_hash = $${index++}`);
    values.push(data.tokenHash);
  }

  if (data.expiresAt !== undefined) {
    fields.push(`expires_at = $${index++}`);
    values.push(data.expiresAt);
  }

  if (data.usedAt !== undefined) {
    fields.push(`used_at = $${index++}`);
    values.push(data.usedAt);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(passwordResetTokenId);

  const query = `
    UPDATE password_reset_tokens
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deletePasswordResetTokenById = async (passwordResetTokenId) => {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE id = $1
    RETURNING
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [passwordResetTokenId]);
  return result.rows[0] || null;
};

const findValidPasswordResetTokenByHash = async ({
  subjectType,
  tokenHash,
}) => {
  const query = `
    SELECT
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM password_reset_tokens
    WHERE subject_type = $1
      AND token_hash = $2
      AND used_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [subjectType, tokenHash]);
  return result.rows[0] || null;
};

const markPasswordResetTokenAsUsed = async (
  passwordResetTokenId,
  updatedBy,
) => {
  const query = `
    UPDATE password_reset_tokens
    SET
      used_at = NOW(),
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [passwordResetTokenId, updatedBy]);
  return result.rows[0] || null;
};

const invalidatePasswordResetTokensBySubject = async ({
  subjectType,
  subjectId,
  updatedBy,
}) => {
  const query = `
    UPDATE password_reset_tokens
    SET
      used_at = COALESCE(used_at, NOW()),
      updated_by = $3,
      updated_at = NOW()
    WHERE subject_type = $1
      AND subject_id = $2
      AND used_at IS NULL
    RETURNING
      id,
      subject_type,
      subject_id,
      token_hash,
      expires_at,
      used_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [subjectType, subjectId, updatedBy]);
  return result.rows;
};

module.exports = {
  createPasswordResetToken,
  findPasswordResetTokenById,
  getAllPasswordResetTokens,
  updatePasswordResetTokenById,
  deletePasswordResetTokenById,
  findValidPasswordResetTokenByHash,
  markPasswordResetTokenAsUsed,
  invalidatePasswordResetTokensBySubject,
};
