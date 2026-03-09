const pool = require('../db/db');

const createSpecialty = async ({ code, name, description, createdBy }) => {
  const query = `
    INSERT INTO specialties (
      code,
      name,
      description,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, true, $4, $4, NOW(), NOW())
    RETURNING
      id,
      code,
      name,
      description,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [code, name, description || null, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findSpecialtyById = async (specialtyId) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM specialties
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [specialtyId]);
  return result.rows[0] || null;
};

const findSpecialtyByCode = async (code) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM specialties
    WHERE code = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
};

const getAllSpecialties = async () => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM specialties
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateSpecialtyById = async (specialtyId, data, updatedBy) => {
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

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(specialtyId);

  const query = `
    UPDATE specialties
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      code,
      name,
      description,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteSpecialtyById = async (specialtyId, updatedBy) => {
  const query = `
    UPDATE specialties
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
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [specialtyId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createSpecialty,
  findSpecialtyById,
  findSpecialtyByCode,
  getAllSpecialties,
  updateSpecialtyById,
  softDeleteSpecialtyById,
};