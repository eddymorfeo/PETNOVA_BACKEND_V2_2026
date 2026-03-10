const pool = require('../db/db');

const createAppointmentCheckin = async ({
  appointmentId,
  checkedInBy,
  notes,
  createdBy,
}) => {
  const query = `
    INSERT INTO appointment_checkins (
      appointment_id,
      checked_in_at,
      checked_in_by,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, NOW(), $2, $3, $4, $4, NOW(), NOW())
    RETURNING
      id,
      appointment_id,
      checked_in_at,
      checked_in_by,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [appointmentId, checkedInBy, notes || null, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findAppointmentCheckinById = async (checkinId) => {
  const query = `
    SELECT
      ac.id,
      ac.appointment_id,
      ac.checked_in_at,
      ac.checked_in_by,
      ac.notes,
      ac.created_by,
      ac.updated_by,
      ac.created_at,
      ac.updated_at,
      a.status AS appointment_status
    FROM appointment_checkins ac
    INNER JOIN appointments a ON a.id = ac.appointment_id
    WHERE ac.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [checkinId]);
  return result.rows[0] || null;
};

const findAppointmentCheckinByAppointmentId = async (appointmentId) => {
  const query = `
    SELECT
      id,
      appointment_id,
      checked_in_at,
      checked_in_by,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM appointment_checkins
    WHERE appointment_id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [appointmentId]);
  return result.rows[0] || null;
};

const getAllAppointmentCheckins = async () => {
  const query = `
    SELECT
      ac.id,
      ac.appointment_id,
      ac.checked_in_at,
      ac.checked_in_by,
      ac.notes,
      ac.created_by,
      ac.updated_by,
      ac.created_at,
      ac.updated_at,
      a.status AS appointment_status,
      c.full_name AS client_name,
      p.name AS pet_name
    FROM appointment_checkins ac
    INNER JOIN appointments a ON a.id = ac.appointment_id
    LEFT JOIN clients c ON c.id = a.client_id
    LEFT JOIN pets p ON p.id = a.pet_id
    ORDER BY ac.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateAppointmentCheckinById = async (checkinId, notes, updatedBy) => {
  const query = `
    UPDATE appointment_checkins
    SET
      notes = $2,
      updated_by = $3,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      appointment_id,
      checked_in_at,
      checked_in_by,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [checkinId, notes, updatedBy]);
  return result.rows[0] || null;
};

const deleteAppointmentCheckinById = async (checkinId) => {
  const query = `
    DELETE FROM appointment_checkins
    WHERE id = $1
    RETURNING
      id,
      appointment_id,
      checked_in_at,
      checked_in_by,
      notes,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [checkinId]);
  return result.rows[0] || null;
};

module.exports = {
  createAppointmentCheckin,
  findAppointmentCheckinById,
  findAppointmentCheckinByAppointmentId,
  getAllAppointmentCheckins,
  updateAppointmentCheckinById,
  deleteAppointmentCheckinById,
};