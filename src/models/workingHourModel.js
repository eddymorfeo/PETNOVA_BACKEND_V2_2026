const pool = require('../db/db');

const createWorkingHour = async ({
  veterinarianId,
  weekday,
  startTime,
  endTime,
  slotMinutes,
  createdBy,
}) => {
  const query = `
    INSERT INTO working_hours (
      veterinarian_id,
      weekday,
      start_time,
      end_time,
      slot_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, true, $6, $6, NOW(), NOW())
    RETURNING
      id,
      veterinarian_id,
      weekday,
      start_time,
      end_time,
      slot_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [
    veterinarianId,
    weekday,
    startTime,
    endTime,
    slotMinutes,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findWorkingHourById = async (workingHourId) => {
  const query = `
    SELECT
      id,
      veterinarian_id,
      weekday,
      start_time,
      end_time,
      slot_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM working_hours
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [workingHourId]);
  return result.rows[0] || null;
};

const getAllWorkingHours = async () => {
  const query = `
    SELECT
      wh.id,
      wh.veterinarian_id,
      wh.weekday,
      wh.start_time,
      wh.end_time,
      wh.slot_minutes,
      wh.is_active,
      wh.created_by,
      wh.updated_by,
      wh.created_at,
      wh.updated_at,
      u.username,
      u.email,
      u.full_name
    FROM working_hours wh
    INNER JOIN veterinarians v ON v.id = wh.veterinarian_id
    INNER JOIN users u ON u.id = v.user_id
    ORDER BY wh.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateWorkingHourById = async (workingHourId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.veterinarianId !== undefined) {
    fields.push(`veterinarian_id = $${index++}`);
    values.push(data.veterinarianId);
  }

  if (data.weekday !== undefined) {
    fields.push(`weekday = $${index++}`);
    values.push(data.weekday);
  }

  if (data.startTime !== undefined) {
    fields.push(`start_time = $${index++}`);
    values.push(data.startTime);
  }

  if (data.endTime !== undefined) {
    fields.push(`end_time = $${index++}`);
    values.push(data.endTime);
  }

  if (data.slotMinutes !== undefined) {
    fields.push(`slot_minutes = $${index++}`);
    values.push(data.slotMinutes);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(workingHourId);

  const query = `
    UPDATE working_hours
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      veterinarian_id,
      weekday,
      start_time,
      end_time,
      slot_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteWorkingHourById = async (workingHourId, updatedBy) => {
  const query = `
    UPDATE working_hours
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      veterinarian_id,
      weekday,
      start_time,
      end_time,
      slot_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [workingHourId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createWorkingHour,
  findWorkingHourById,
  getAllWorkingHours,
  updateWorkingHourById,
  softDeleteWorkingHourById,
};