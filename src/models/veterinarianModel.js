const pool = require('../db/db');

const createVeterinarian = async ({
  userId,
  licenseNumber,
  specialtyId,
  createdBy,
}) => {
  const query = `
    INSERT INTO veterinarians (
      user_id,
      license_number,
      specialty_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, true, $4, $4, NOW(), NOW())
    RETURNING
      id,
      user_id,
      license_number,
      specialty_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [
    userId,
    licenseNumber || null,
    specialtyId || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findVeterinarianById = async (veterinarianId) => {
  const query = `
    SELECT
      v.id,
      v.user_id,
      v.license_number,
      v.specialty_id,
      v.is_active,
      v.created_by,
      v.updated_by,
      v.created_at,
      v.updated_at,
      u.username,
      u.email,
      u.full_name,
      u.phone,
      s.code AS specialty_code,
      s.name AS specialty_name,
      s.description AS specialty_description
    FROM veterinarians v
    INNER JOIN users u ON u.id = v.user_id
    LEFT JOIN specialties s ON s.id = v.specialty_id
    WHERE v.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [veterinarianId]);
  return result.rows[0] || null;
};

const findVeterinarianByUserId = async (userId) => {
  const query = `
    SELECT
      id,
      user_id,
      license_number,
      specialty_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM veterinarians
    WHERE user_id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

const getAllVeterinarians = async () => {
  const query = `
    SELECT
      v.id,
      v.user_id,
      v.license_number,
      v.specialty_id,
      v.is_active,
      v.created_by,
      v.updated_by,
      v.created_at,
      v.updated_at,
      u.username,
      u.email,
      u.full_name,
      u.phone,
      s.code AS specialty_code,
      s.name AS specialty_name,
      s.description AS specialty_description
    FROM veterinarians v
    INNER JOIN users u ON u.id = v.user_id
    LEFT JOIN specialties s ON s.id = v.specialty_id
    ORDER BY v.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateVeterinarianById = async (veterinarianId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.userId !== undefined) {
    fields.push(`user_id = $${index++}`);
    values.push(data.userId);
  }

  if (data.licenseNumber !== undefined) {
    fields.push(`license_number = $${index++}`);
    values.push(data.licenseNumber);
  }

  if (data.specialtyId !== undefined) {
    fields.push(`specialty_id = $${index++}`);
    values.push(data.specialtyId);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(veterinarianId);

  const query = `
    UPDATE veterinarians
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      user_id,
      license_number,
      specialty_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteVeterinarianById = async (veterinarianId, updatedBy) => {
  const query = `
    UPDATE veterinarians
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      user_id,
      license_number,
      specialty_id,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [veterinarianId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createVeterinarian,
  findVeterinarianById,
  findVeterinarianByUserId,
  getAllVeterinarians,
  updateVeterinarianById,
  softDeleteVeterinarianById,
};