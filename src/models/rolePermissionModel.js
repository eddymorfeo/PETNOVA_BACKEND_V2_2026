const pool = require('../db/db');

const createRolePermission = async ({ roleId, permissionId, createdBy }) => {
  const query = `
    INSERT INTO role_permissions (
      role_id,
      permission_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $3, NOW(), NOW())
    RETURNING
      role_id,
      permission_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [roleId, permissionId, createdBy]);
  return result.rows[0];
};

const findRolePermission = async (roleId, permissionId) => {
  const query = `
    SELECT
      role_id,
      permission_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM role_permissions
    WHERE role_id = $1 AND permission_id = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [roleId, permissionId]);
  return result.rows[0] || null;
};

const getAllRolePermissions = async () => {
  const query = `
    SELECT
      rp.role_id,
      rp.permission_id,
      rp.created_by,
      rp.updated_by,
      rp.created_at,
      rp.updated_at,
      r.code AS role_code,
      r.name AS role_name,
      p.code AS permission_code,
      p.name AS permission_name,
      p.module AS permission_module
    FROM role_permissions rp
    INNER JOIN roles r ON r.id = rp.role_id
    INNER JOIN permissions p ON p.id = rp.permission_id
    ORDER BY rp.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getPermissionsByRoleId = async (roleId) => {
  const query = `
    SELECT
      rp.role_id,
      rp.permission_id,
      rp.created_by,
      rp.updated_by,
      rp.created_at,
      rp.updated_at,
      p.code AS permission_code,
      p.name AS permission_name,
      p.description AS permission_description,
      p.module AS permission_module
    FROM role_permissions rp
    INNER JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.role_id = $1
    ORDER BY p.module ASC, p.name ASC
  `;

  const result = await pool.query(query, [roleId]);
  return result.rows;
};

const deleteRolePermission = async (roleId, permissionId) => {
  const query = `
    DELETE FROM role_permissions
    WHERE role_id = $1 AND permission_id = $2
    RETURNING
      role_id,
      permission_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [roleId, permissionId]);
  return result.rows[0] || null;
};

module.exports = {
  createRolePermission,
  findRolePermission,
  getAllRolePermissions,
  getPermissionsByRoleId,
  deleteRolePermission,
};