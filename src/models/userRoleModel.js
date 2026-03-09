const pool = require('../db/db');

const createUserRole = async ({ userId, roleId, createdBy }) => {
  const query = `
    INSERT INTO user_roles (
      user_id,
      role_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $3, NOW(), NOW())
    RETURNING
      user_id,
      role_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [userId, roleId, createdBy]);
  return result.rows[0];
};

const findUserRole = async (userId, roleId) => {
  const query = `
    SELECT
      user_id,
      role_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM user_roles
    WHERE user_id = $1 AND role_id = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [userId, roleId]);
  return result.rows[0] || null;
};

const getAllUserRoles = async () => {
  const query = `
    SELECT
      ur.user_id,
      ur.role_id,
      ur.created_by,
      ur.updated_by,
      ur.created_at,
      ur.updated_at,
      u.username,
      u.email,
      u.full_name,
      r.code AS role_code,
      r.name AS role_name,
      r.description AS role_description
    FROM user_roles ur
    INNER JOIN users u ON u.id = ur.user_id
    INNER JOIN roles r ON r.id = ur.role_id
    ORDER BY ur.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getRolesByUserId = async (userId) => {
  const query = `
    SELECT
      ur.user_id,
      ur.role_id,
      ur.created_by,
      ur.updated_by,
      ur.created_at,
      ur.updated_at,
      r.code AS role_code,
      r.name AS role_name,
      r.description AS role_description
    FROM user_roles ur
    INNER JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    ORDER BY r.name ASC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const deleteUserRole = async (userId, roleId) => {
  const query = `
    DELETE FROM user_roles
    WHERE user_id = $1 AND role_id = $2
    RETURNING
      user_id,
      role_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [userId, roleId]);
  return result.rows[0] || null;
};

module.exports = {
  createUserRole,
  findUserRole,
  getAllUserRoles,
  getRolesByUserId,
  deleteUserRole,
};