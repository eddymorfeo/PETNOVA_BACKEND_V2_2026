const pool = require('../db/db');

const createReminder = async ({
  clientId,
  petId,
  type,
  title,
  message,
  dueAt,
  sentAt,
  status,
  createdBy,
}) => {
  const query = `
    INSERT INTO reminders (
      client_id,
      pet_id,
      type,
      title,
      message,
      due_at,
      sent_at,
      status,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, NOW(), NOW())
    RETURNING
      id,
      client_id,
      pet_id,
      type,
      title,
      message,
      due_at,
      sent_at,
      status,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    clientId,
    petId,
    type,
    title,
    message || null,
    dueAt,
    sentAt || null,
    status || 'PENDING',
    createdBy,
  ]);

  return result.rows[0];
};

const findReminderById = async (reminderId) => {
  const query = `
    SELECT
      r.id,
      r.client_id,
      r.pet_id,
      r.type,
      r.title,
      r.message,
      r.due_at,
      r.sent_at,
      r.status,
      r.created_by,
      r.updated_by,
      r.created_at,
      r.updated_at,
      c.full_name AS client_name,
      p.name AS pet_name
    FROM reminders r
    INNER JOIN clients c ON c.id = r.client_id
    INNER JOIN pets p ON p.id = r.pet_id
    WHERE r.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [reminderId]);
  return result.rows[0] || null;
};

const getAllReminders = async () => {
  const query = `
    SELECT
      r.id,
      r.client_id,
      r.pet_id,
      r.type,
      r.title,
      r.message,
      r.due_at,
      r.sent_at,
      r.status,
      r.created_by,
      r.updated_by,
      r.created_at,
      r.updated_at,
      c.full_name AS client_name,
      p.name AS pet_name
    FROM reminders r
    INNER JOIN clients c ON c.id = r.client_id
    INNER JOIN pets p ON p.id = r.pet_id
    ORDER BY r.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateReminderById = async (reminderId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.type !== undefined) {
    fields.push(`type = $${index++}`);
    values.push(data.type);
  }

  if (data.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(data.title);
  }

  if (data.message !== undefined) {
    fields.push(`message = $${index++}`);
    values.push(data.message);
  }

  if (data.dueAt !== undefined) {
    fields.push(`due_at = $${index++}`);
    values.push(data.dueAt);
  }

  if (data.sentAt !== undefined) {
    fields.push(`sent_at = $${index++}`);
    values.push(data.sentAt);
  }

  if (data.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(data.status);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(reminderId);

  const query = `
    UPDATE reminders
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      client_id,
      pet_id,
      type,
      title,
      message,
      due_at,
      sent_at,
      status,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteReminderById = async (reminderId) => {
  const query = `
    DELETE FROM reminders
    WHERE id = $1
    RETURNING
      id,
      client_id,
      pet_id,
      type,
      title,
      message,
      due_at,
      sent_at,
      status,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [reminderId]);
  return result.rows[0] || null;
};

module.exports = {
  createReminder,
  findReminderById,
  getAllReminders,
  updateReminderById,
  deleteReminderById,
};