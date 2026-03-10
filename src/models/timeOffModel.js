const pool = require('../db/db');

const createTimeOff = async ({
  veterinarianId,
  startsAt,
  endsAt,
  reason,
  createdBy,
}) => {
  const query = `
    INSERT INTO time_off (
      veterinarian_id,
      starts_at,
      ends_at,
      reason,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $5, NOW(), NOW())
    RETURNING
      id,
      veterinarian_id,
      starts_at,
      ends_at,
      reason,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [
    veterinarianId,
    startsAt,
    endsAt,
    reason || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findTimeOffById = async (timeOffId) => {
  const query = `
    SELECT
      id,
      veterinarian_id,
      starts_at,
      ends_at,
      reason,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM time_off
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [timeOffId]);
  return result.rows[0] || null;
};

const getAllTimeOff = async () => {
  const query = `
    SELECT
      t.id,
      t.veterinarian_id,
      t.starts_at,
      t.ends_at,
      t.reason,
      t.created_by,
      t.updated_by,
      t.created_at,
      t.updated_at,
      u.username,
      u.email,
      u.full_name
    FROM time_off t
    INNER JOIN veterinarians v ON v.id = t.veterinarian_id
    INNER JOIN users u ON u.id = v.user_id
    ORDER BY t.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateTimeOffById = async (timeOffId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.veterinarianId !== undefined) {
    fields.push(`veterinarian_id = $${index++}`);
    values.push(data.veterinarianId);
  }

  if (data.startsAt !== undefined) {
    fields.push(`starts_at = $${index++}`);
    values.push(data.startsAt);
  }

  if (data.endsAt !== undefined) {
    fields.push(`ends_at = $${index++}`);
    values.push(data.endsAt);
  }

  if (data.reason !== undefined) {
    fields.push(`reason = $${index++}`);
    values.push(data.reason);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(timeOffId);

  const query = `
    UPDATE time_off
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      veterinarian_id,
      starts_at,
      ends_at,
      reason,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteTimeOffById = async (timeOffId) => {
  const query = `
    DELETE FROM time_off
    WHERE id = $1
    RETURNING
      id,
      veterinarian_id,
      starts_at,
      ends_at,
      reason,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [timeOffId]);
  return result.rows[0] || null;
};

module.exports = {
  createTimeOff,
  findTimeOffById,
  getAllTimeOff,
  updateTimeOffById,
  deleteTimeOffById,
};