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

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      id,
      username,
      email,
      password_hash,
      full_name,
      phone,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
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
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [userId]);
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

const createUser = async ({
  username,
  email,
  passwordHash,
  fullName,
  phone,
  createdBy,
}) => {
  const query = `
    INSERT INTO users (
      username,
      email,
      password_hash,
      full_name,
      phone,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, true, $6, $6, NOW(), NOW())
    RETURNING
      id,
      username,
      email,
      full_name,
      phone,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [username, email, passwordHash, fullName, phone || null, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllUsers = async () => {
  const query = `
    SELECT
      id,
      username,
      email,
      full_name,
      phone,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateUserById = async (userId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.username !== undefined) {
    fields.push(`username = $${index++}`);
    values.push(data.username);
  }

  if (data.email !== undefined) {
    fields.push(`email = $${index++}`);
    values.push(data.email);
  }

  if (data.passwordHash !== undefined) {
    fields.push(`password_hash = $${index++}`);
    values.push(data.passwordHash);
  }

  if (data.fullName !== undefined) {
    fields.push(`full_name = $${index++}`);
    values.push(data.fullName);
  }

  if (data.phone !== undefined) {
    fields.push(`phone = $${index++}`);
    values.push(data.phone);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(userId);

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      username,
      email,
      full_name,
      phone,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteUserById = async (userId, updatedBy) => {
  const query = `
    UPDATE users
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      username,
      email,
      full_name,
      phone,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [userId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  findRolesByUserId,
  createUser,
  getAllUsers,
  updateUserById,
  softDeleteUserById,
};