const pool = require("../db/db");

const createPet = async ({
  clientId,
  name,
  speciesId,
  breedId,
  sex,
  birthDate,
  color,
  microchip,
  isSterilized,
  allergies,
  notes,
  createdBy,
}) => {
  const query = `
    INSERT INTO pets (
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, $12, $12, NOW(), NOW()
    )
    RETURNING
      id,
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [
    clientId,
    name,
    speciesId,
    breedId || null,
    sex || null,
    birthDate || null,
    color || null,
    microchip || null,
    isSterilized ?? null,
    allergies || null,
    notes || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findPetById = async (petId) => {
  const query = `
    SELECT
      id,
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM pets
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [petId]);
  return result.rows[0] || null;
};

const getAllPets = async () => {
  const query = `
    SELECT
      id,
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM pets
    WHERE is_active = 'true'
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updatePetById = async (petId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.clientId !== undefined) {
    fields.push(`client_id = $${index++}`);
    values.push(data.clientId);
  }

  if (data.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(data.name);
  }

  if (data.speciesId !== undefined) {
    fields.push(`species_id = $${index++}`);
    values.push(data.speciesId);
  }

  if (data.breedId !== undefined) {
    fields.push(`breed_id = $${index++}`);
    values.push(data.breedId);
  }

  if (data.sex !== undefined) {
    fields.push(`sex = $${index++}`);
    values.push(data.sex);
  }

  if (data.birthDate !== undefined) {
    fields.push(`birth_date = $${index++}`);
    values.push(data.birthDate);
  }

  if (data.color !== undefined) {
    fields.push(`color = $${index++}`);
    values.push(data.color);
  }

  if (data.microchip !== undefined) {
    fields.push(`microchip = $${index++}`);
    values.push(data.microchip);
  }

  if (data.isSterilized !== undefined) {
    fields.push(`is_sterilized = $${index++}`);
    values.push(data.isSterilized);
  }

  if (data.allergies !== undefined) {
    fields.push(`allergies = $${index++}`);
    values.push(data.allergies);
  }

  if (data.notes !== undefined) {
    fields.push(`notes = $${index++}`);
    values.push(data.notes);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(petId);

  const query = `
    UPDATE pets
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING
      id,
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeletePetById = async (petId, updatedBy) => {
  const query = `
    UPDATE pets
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [petId, updatedBy]);
  return result.rows[0] || null;
};

const getPetsByClientId = async (clientId) => {
  const query = `
    SELECT
      id,
      client_id,
      name,
      species_id,
      breed_id,
      sex,
      birth_date,
      color,
      microchip,
      is_sterilized,
      allergies,
      notes,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM pets
    WHERE client_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [clientId]);
  return result.rows;
};

module.exports = {
  createPet,
  findPetById,
  getAllPets,
  updatePetById,
  softDeletePetById,
  getPetsByClientId,
};
