const pool = require('../db/db');

const createClient = async ({
  fullName,
  email,
  phone,
  documentId,
  address,
  createdBy,
}) => {
  const query = `
    INSERT INTO clients (
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, true, $6, $6, NOW(), NOW())
    RETURNING
      id,
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [email, fullName, phone || null, documentId || null, address || null, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findClientByEmail = async (email) => {
  const query = `
    SELECT
      id,
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM clients
    WHERE email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

const findClientById = async (clientId) => {
  const query = `
    SELECT
      id,
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM clients
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [clientId]);
  return result.rows[0] || null;
};

const getAllClients = async () => {
  const query = `
    SELECT
      id,
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM clients
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateClientById = async (clientId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.fullName !== undefined) {
    fields.push(`full_name = $${index++}`);
    values.push(data.fullName);
  }

  if (data.email !== undefined) {
    fields.push(`email = $${index++}`);
    values.push(data.email);
  }

  if (data.phone !== undefined) {
    fields.push(`phone = $${index++}`);
    values.push(data.phone);
  }

  if (data.documentId !== undefined) {
    fields.push(`document_id = $${index++}`);
    values.push(data.documentId);
  }

  if (data.address !== undefined) {
    fields.push(`address = $${index++}`);
    values.push(data.address);
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(data.isActive);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(clientId);

  const query = `
    UPDATE clients
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const softDeleteClientById = async (clientId, updatedBy) => {
  const query = `
    UPDATE clients
    SET
      is_active = false,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      email,
      full_name,
      phone,
      document_id,
      address,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [clientId, updatedBy]);
  return result.rows[0] || null;
};

module.exports = {
  createClient,
  findClientByEmail,
  findClientById,
  getAllClients,
  updateClientById,
  softDeleteClientById,
};