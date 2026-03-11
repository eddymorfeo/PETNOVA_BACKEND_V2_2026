const pool = require('../db/db');

const createAuditLog = async ({
  actorType,
  actorId,
  action,
  entity,
  entityId,
  meta,
  createdBy,
}) => {
  const query = `
    INSERT INTO audit_logs (
      actor_type,
      actor_id,
      action,
      entity,
      entity_id,
      meta,
      created_by,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, NOW())
    RETURNING
      id,
      actor_type,
      actor_id,
      action,
      entity,
      entity_id,
      meta,
      created_by,
      created_at
  `;

  const result = await pool.query(query, [
    actorType,
    actorId || null,
    action,
    entity,
    entityId || null,
    meta ? JSON.stringify(meta) : JSON.stringify({}),
    createdBy,
  ]);

  return result.rows[0];
};

const findAuditLogById = async (auditLogId) => {
  const query = `
    SELECT
      id,
      actor_type,
      actor_id,
      action,
      entity,
      entity_id,
      meta,
      created_by,
      created_at
    FROM audit_logs
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [auditLogId]);
  return result.rows[0] || null;
};

const getAllAuditLogs = async () => {
  const query = `
    SELECT
      id,
      actor_type,
      actor_id,
      action,
      entity,
      entity_id,
      meta,
      created_by,
      created_at
    FROM audit_logs
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createAuditLog,
  findAuditLogById,
  getAllAuditLogs,
};