const pool = require('../db/db');

const createEmailOutbox = async ({
  toEmail,
  template,
  payload,
  status,
  lastError,
  scheduledFor,
  sentAt,
  createdBy,
}) => {
  const query = `
    INSERT INTO email_outbox (
      to_email,
      template,
      payload,
      status,
      last_error,
      scheduled_for,
      sent_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $8, NOW(), NOW())
    RETURNING
      id,
      to_email,
      template,
      payload,
      status,
      last_error,
      scheduled_for,
      sent_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    toEmail,
    template,
    JSON.stringify(payload),
    status || 'QUEUED',
    lastError || null,
    scheduledFor || null,
    sentAt || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findEmailOutboxById = async (emailOutboxId) => {
  const query = `
    SELECT
      id,
      to_email,
      template,
      payload,
      status,
      last_error,
      scheduled_for,
      sent_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM email_outbox
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [emailOutboxId]);
  return result.rows[0] || null;
};

const getAllEmailOutbox = async () => {
  const query = `
    SELECT
      id,
      to_email,
      template,
      payload,
      status,
      last_error,
      scheduled_for,
      sent_at,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM email_outbox
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateEmailOutboxById = async (emailOutboxId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.toEmail !== undefined) {
    fields.push(`to_email = $${index++}`);
    values.push(data.toEmail);
  }

  if (data.template !== undefined) {
    fields.push(`template = $${index++}`);
    values.push(data.template);
  }

  if (data.payload !== undefined) {
    fields.push(`payload = $${index++}::jsonb`);
    values.push(JSON.stringify(data.payload));
  }

  if (data.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(data.status);
  }

  if (data.lastError !== undefined) {
    fields.push(`last_error = $${index++}`);
    values.push(data.lastError);
  }

  if (data.scheduledFor !== undefined) {
    fields.push(`scheduled_for = $${index++}`);
    values.push(data.scheduledFor);
  }

  if (data.sentAt !== undefined) {
    fields.push(`sent_at = $${index++}`);
    values.push(data.sentAt);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(emailOutboxId);

  const query = `
    UPDATE email_outbox
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      to_email,
      template,
      payload,
      status,
      last_error,
      scheduled_for,
      sent_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteEmailOutboxById = async (emailOutboxId) => {
  const query = `
    DELETE FROM email_outbox
    WHERE id = $1
    RETURNING
      id,
      to_email,
      template,
      payload,
      status,
      last_error,
      scheduled_for,
      sent_at,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [emailOutboxId]);
  return result.rows[0] || null;
};

module.exports = {
  createEmailOutbox,
  findEmailOutboxById,
  getAllEmailOutbox,
  updateEmailOutboxById,
  deleteEmailOutboxById,
};