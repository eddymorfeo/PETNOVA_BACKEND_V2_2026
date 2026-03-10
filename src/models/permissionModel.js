const pool = require('../db/db');

const createPermission = async ({ code, name, description, module, createdBy }) => {
  const query = `
    INSERT INTO permissions (
      code,
      name,
      description,
      module,
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
      module,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    code,
    name,
    description || null,
    module,
    createdBy,
  ]);

  return result.rows[0];
};

const findPermissionById = async (permissionId) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      module,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM permissions
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [permissionId]);
  return result.rows[0] || null;
};

const findPermissionByCode = async (code) => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      module,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM permissions
    WHERE code = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
};

const getAllPermissions = async () => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      module,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM permissions
    ORDER BY module ASC, created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updatePermissionById = async (permissionId, data, updatedBy) => {
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

  if (data.module !== undefined) {
    fields.push(`module = $${index++}`);
    values.push(data.module);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(permissionId);

  const query = `
    UPDATE permissions
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      code,
      name,
      description,
      module,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeletePermissionById = async (permissionId, updatedBy) => {
  const query = `
    UPDATE permissions
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
      module,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [permissionId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createPermission,
  findPermissionById,
  findPermissionByCode,
  getAllPermissions,
  updatePermissionById,
  softDeletePermissionById,
};