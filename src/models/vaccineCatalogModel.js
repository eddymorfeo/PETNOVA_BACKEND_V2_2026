const pool = require('../db/db');

const createVaccineCatalog = async ({
  code,
  name,
  description,
  speciesId,
  createdBy,
}) => {
  const query = `
    INSERT INTO vaccines_catalog (
      code,
      name,
      description,
      species_id,
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
      species_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [code, name, description || null, speciesId, createdBy]);
  return result.rows[0];
};

const findVaccineCatalogById = async (vaccineCatalogId) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      species_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM vaccines_catalog
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [vaccineCatalogId]);
  return result.rows[0] || null;
};

const findVaccineCatalogByCode = async (code) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      species_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM vaccines_catalog
    WHERE code = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
};

const findVaccineCatalogByNameAndSpeciesId = async (name, speciesId) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      species_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM vaccines_catalog
    WHERE name = $1 AND species_id = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [name, speciesId]);
  return result.rows[0] || null;
};

const getAllVaccinesCatalog = async () => {
  const query = `
    SELECT
      vc.id,
      vc.code,
      vc.name,
      vc.description,
      vc.species_id,
      vc.is_active,
      vc.created_by,
      vc.updated_by,
      vc.created_at,
      vc.updated_at,
      s.name AS species_name
    FROM vaccines_catalog vc
    INNER JOIN species s ON s.id = vc.species_id
    ORDER BY vc.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateVaccineCatalogById = async (vaccineCatalogId, data, updatedBy) => {
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

  if (data.speciesId !== undefined) {
    fields.push(`species_id = $${index++}`);
    values.push(data.speciesId);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(vaccineCatalogId);

  const query = `
    UPDATE vaccines_catalog
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      code,
      name,
      description,
      species_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteVaccineCatalogById = async (vaccineCatalogId, updatedBy) => {
  const query = `
    UPDATE vaccines_catalog
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
      species_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [vaccineCatalogId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createVaccineCatalog,
  findVaccineCatalogById,
  findVaccineCatalogByCode,
  findVaccineCatalogByNameAndSpeciesId,
  getAllVaccinesCatalog,
  updateVaccineCatalogById,
  softDeleteVaccineCatalogById,
};