const pool = require('../db/db');

const createSpecies = async ({ code, name, createdBy }) => {
  const query = `
    INSERT INTO species (
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, true, $3, $3, NOW(), NOW())
    RETURNING
      id,
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [code, name, createdBy]);
  return result.rows[0];
};

const findSpeciesById = async (speciesId) => {
  const query = `
    SELECT
      id,
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM species
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [speciesId]);
  return result.rows[0] || null;
};

const findSpeciesByCode = async (code) => {
  const query = `
    SELECT
      id,
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM species
    WHERE code = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
};

const getAllSpecies = async () => {
  const query = `
    SELECT
      id,
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM species
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateSpeciesById = async (speciesId, data, updatedBy) => {
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

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(speciesId);

  const query = `
    UPDATE species
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteSpeciesById = async (speciesId, updatedBy) => {
  const query = `
    UPDATE species
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      code,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [speciesId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createSpecies,
  findSpeciesById,
  findSpeciesByCode,
  getAllSpecies,
  updateSpeciesById,
  softDeleteSpeciesById,
};