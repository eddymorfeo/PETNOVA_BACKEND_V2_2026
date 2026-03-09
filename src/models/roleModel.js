const pool = require('../db/db');

const createRole = async ({ code, name, description, createdBy }) => {
  const query = `
    INSERT INTO roles (
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

  const result = await pool.query(query, [code, name, description || null, createdBy]);
  return result.rows[0];
};

const findRoleById = async (roleId) => {
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
    FROM roles
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [roleId]);
  return result.rows[0] || null;
};

const findRoleByCode = async (code) => {
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
    FROM roles
    WHERE code = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
};

const getAllRoles = async () => {
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
    FROM roles
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateRoleById = async (roleId, data, updatedBy) => {
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

  values.push(roleId);

  const query = `
    UPDATE roles
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

const softDeleteRoleById = async (roleId, updatedBy) => {
  const query = `
    UPDATE roles
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

  const result = await pool.query(query, [roleId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createRole,
  findRoleById,
  findRoleByCode,
  getAllRoles,
  updateRoleById,
  softDeleteRoleById,
};