const pool = require('../db/db');

const createClientAuthSession = async ({
  clientId,
  refreshTokenHash,
  expiresAt,
  createdBy,
}) => {
  const query = `
    INSERT INTO client_auth_sessions (
      client_id,
      refresh_token_hash,
      expires_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $4, NOW(), NOW())
    RETURNING
      id,
      client_id,
      refresh_token_hash,
      expires_at,
      revoked_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    clientId,
    refreshTokenHash,
    expiresAt,
    createdBy,
  ]);

  return result.rows[0];
};

const findClientAuthSessionById = async (sessionId) => {
  const query = `
    SELECT
      id,
      client_id,
      refresh_token_hash,
      expires_at,
      revoked_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM client_auth_sessions
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [sessionId]);
  return result.rows[0] || null;
};

const getAllClientAuthSessions = async () => {
  const query = `
    SELECT
      cas.id,
      cas.client_id,
      cas.refresh_token_hash,
      cas.expires_at,
      cas.revoked_at,
      cas.created_by,
      cas.updated_by,
      cas.created_at,
      cas.updated_at,
      c.full_name AS client_name,
      c.email AS client_email
    FROM client_auth_sessions cas
    INNER JOIN clients c ON c.id = cas.client_id
    ORDER BY cas.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateClientAuthSessionById = async (sessionId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.refreshTokenHash !== undefined) {
    fields.push(`refresh_token_hash = $${index++}`);
    values.push(data.refreshTokenHash);
  }

  if (data.expiresAt !== undefined) {
    fields.push(`expires_at = $${index++}`);
    values.push(data.expiresAt);
  }

  if (data.revokedAt !== undefined) {
    fields.push(`revoked_at = $${index++}`);
    values.push(data.revokedAt);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(sessionId);

  const query = `
    UPDATE client_auth_sessions
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      client_id,
      refresh_token_hash,
      expires_at,
      revoked_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const revokeClientAuthSessionById = async (sessionId, updatedBy) => {
  const query = `
    UPDATE client_auth_sessions
    SET
      revoked_at = NOW(),
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      client_id,
      refresh_token_hash,
      expires_at,
      revoked_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [sessionId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createClientAuthSession,
  findClientAuthSessionById,
  getAllClientAuthSessions,
  updateClientAuthSessionById,
  revokeClientAuthSessionById,
};