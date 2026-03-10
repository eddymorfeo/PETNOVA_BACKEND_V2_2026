const pool = require('../db/db');

const createAppointmentType = async ({
  code,
  name,
  description,
  defaultDurationMinutes,
  createdBy,
}) => {
  const query = `
    INSERT INTO appointment_types (
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, true, $5, $5, NOW(), NOW())
    RETURNING
      id,
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [code, name, description || null, defaultDurationMinutes, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findAppointmentTypeById = async (appointmentTypeId) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM appointment_types
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [appointmentTypeId]);
  return result.rows[0] || null;
};

const findAppointmentTypeByCode = async (code) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM appointment_types
    WHERE code = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
};

const getAllAppointmentTypes = async () => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM appointment_types
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateAppointmentTypeById = async (appointmentTypeId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.code !== undefined) {
    fields.push(`code = $${index++}`);
    values.push(data.code);
  }

  if (data.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(data.name);
  }

  if (data.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(data.description);
  }

  if (data.defaultDurationMinutes !== undefined) {
    fields.push(`default_duration_minutes = $${index++}`);
    values.push(data.defaultDurationMinutes);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(appointmentTypeId);

  const query = `
    UPDATE appointment_types
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteAppointmentTypeById = async (appointmentTypeId, updatedBy) => {
  const query = `
    UPDATE appointment_types
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      code,
      name,
      description,
      default_duration_minutes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [appointmentTypeId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createAppointmentType,
  findAppointmentTypeById,
  findAppointmentTypeByCode,
  getAllAppointmentTypes,
  updateAppointmentTypeById,
  softDeleteAppointmentTypeById,
};