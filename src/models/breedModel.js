const pool = require('../db/db');

const createBreed = async ({ speciesId, name, createdBy }) => {
  const query = `
    INSERT INTO breeds (
      species_id,
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
      species_id,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [speciesId, name, createdBy]);
  return result.rows[0];
};

const findBreedById = async (breedId) => {
  const query = `
    SELECT
      id,
      species_id,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM breeds
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [breedId]);
  return result.rows[0] || null;
};

const findBreedBySpeciesIdAndName = async (speciesId, name) => {
  const query = `
    SELECT
      id,
      species_id,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM breeds
    WHERE species_id = $1 AND name = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [speciesId, name]);
  return result.rows[0] || null;
};

const getAllBreeds = async () => {
  const query = `
    SELECT
      id,
      species_id,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM breeds
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateBreedById = async (breedId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.speciesId !== undefined) {
    fields.push(`species_id = $${index++}`);
    values.push(data.speciesId);
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

  values.push(breedId);

  const query = `
    UPDATE breeds
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      species_id,
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

const softDeleteBreedById = async (breedId, updatedBy) => {
  const query = `
    UPDATE breeds
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      species_id,
      name,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [breedId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createBreed,
  findBreedById,
  findBreedBySpeciesIdAndName,
  getAllBreeds,
  updateBreedById,
  softDeleteBreedById,
};