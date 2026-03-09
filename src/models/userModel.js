const pool = require('../db/db');

const findUserByUsername = async (username) => {
  const query = `
    SELECT
      id,
      username,
      email,
      password_hash,
      full_name,
      phone,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE username = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

const findRolesByUserId = async (userId) => {
  const query = `
    SELECT
      r.id,
      r.code,
      r.name,
      r.description
    FROM user_roles ur
    INNER JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    ORDER BY r.name ASC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const findUserById = async (userId) => {
  const query = `
    SELECT
      id,
      username,
      email,
      full_name,
      phone,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

module.exports = {
  findUserByUsername,
  findRolesByUserId,
  findUserById
};