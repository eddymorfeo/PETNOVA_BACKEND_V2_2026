const pool = require('../db/db');

const createAppointment = async ({
  veterinarianId,
  appointmentTypeId,
  clientId,
  petId,
  startsAt,
  endsAt,
  status,
  reason,
  bookedSource,
  bookedByUserId,
  createdBy,
}) => {
  const query = `
    INSERT INTO appointments (
      veterinarian_id,
      appointment_type_id,
      client_id,
      pet_id,
      starts_at,
      ends_at,
      status,
      reason,
      booked_source,
      booked_by_user_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, NOW(), NOW())
    RETURNING
      id,
      veterinarian_id,
      appointment_type_id,
      client_id,
      pet_id,
      starts_at,
      ends_at,
      status,
      reason,
      booked_source,
      booked_by_user_id,
      cancel_reason,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const values = [
    veterinarianId,
    appointmentTypeId,
    clientId,
    petId,
    startsAt,
    endsAt,
    status,
    reason || null,
    bookedSource,
    bookedByUserId || null,
    createdBy,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findAppointmentById = async (appointmentId) => {
  const query = `
    SELECT
      a.id,
      a.veterinarian_id,
      a.appointment_type_id,
      a.client_id,
      a.pet_id,
      a.starts_at,
      a.ends_at,
      a.status,
      a.reason,
      a.booked_source,
      a.booked_by_user_id,
      a.cancel_reason,
      a.created_by,
      a.updated_by,
      a.created_at,
      a.updated_at,
      u.full_name AS veterinarian_name,
      c.full_name AS client_name,
      p.name AS pet_name,
      at.name AS appointment_type_name
    FROM appointments a
    INNER JOIN veterinarians v ON v.id = a.veterinarian_id
    INNER JOIN users u ON u.id = v.user_id
    LEFT JOIN clients c ON c.id = a.client_id
    LEFT JOIN pets p ON p.id = a.pet_id
    LEFT JOIN appointment_types at ON at.id = a.appointment_type_id
    WHERE a.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [appointmentId]);
  return result.rows[0] || null;
};

const getAllAppointments = async () => {
  const query = `
    SELECT
      a.id,
      a.veterinarian_id,
      a.appointment_type_id,
      a.client_id,
      a.pet_id,
      a.starts_at,
      a.ends_at,
      a.status,
      a.reason,
      a.booked_source,
      a.booked_by_user_id,
      a.cancel_reason,
      a.created_by,
      a.updated_by,
      a.created_at,
      a.updated_at,
      u.full_name AS veterinarian_name,
      c.full_name AS client_name,
      p.name AS pet_name,
      at.name AS appointment_type_name
    FROM appointments a
    INNER JOIN veterinarians v ON v.id = a.veterinarian_id
    INNER JOIN users u ON u.id = v.user_id
    LEFT JOIN clients c ON c.id = a.client_id
    LEFT JOIN pets p ON p.id = a.pet_id
    LEFT JOIN appointment_types at ON at.id = a.appointment_type_id
    ORDER BY a.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateAppointmentById = async (appointmentId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.veterinarianId !== undefined) {
    fields.push(`veterinarian_id = $${index++}`);
    values.push(data.veterinarianId);
  }

  if (data.appointmentTypeId !== undefined) {
    fields.push(`appointment_type_id = $${index++}`);
    values.push(data.appointmentTypeId);
  }

  if (data.clientId !== undefined) {
    fields.push(`client_id = $${index++}`);
    values.push(data.clientId);
  }

  if (data.petId !== undefined) {
    fields.push(`pet_id = $${index++}`);
    values.push(data.petId);
  }

  if (data.startsAt !== undefined) {
    fields.push(`starts_at = $${index++}`);
    values.push(data.startsAt);
  }

  if (data.endsAt !== undefined) {
    fields.push(`ends_at = $${index++}`);
    values.push(data.endsAt);
  }

  if (data.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(data.status);
  }

  if (data.reason !== undefined) {
    fields.push(`reason = $${index++}`);
    values.push(data.reason);
  }

  if (data.bookedSource !== undefined) {
    fields.push(`booked_source = $${index++}`);
    values.push(data.bookedSource);
  }

  if (data.cancelReason !== undefined) {
    fields.push(`cancel_reason = $${index++}`);
    values.push(data.cancelReason);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(appointmentId);

  const query = `
    UPDATE appointments
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      veterinarian_id,
      appointment_type_id,
      client_id,
      pet_id,
      starts_at,
      ends_at,
      status,
      reason,
      booked_source,
      booked_by_user_id,
      cancel_reason,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const cancelAppointmentById = async (appointmentId, cancelReason, updatedBy) => {
  const query = `
    UPDATE appointments
    SET
      status = 'CANCELLED',
      cancel_reason = $2,
      updated_by = $3,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      veterinarian_id,
      appointment_type_id,
      client_id,
      pet_id,
      starts_at,
      ends_at,
      status,
      reason,
      booked_source,
      booked_by_user_id,
      cancel_reason,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [appointmentId, cancelReason || null, updatedBy]);
  return result.rows[0] || null;
};

const getAppointmentsByVeterinarianAndDate = async (veterinarianId, appointmentDate) => {
  const query = `
    SELECT
      id,
      veterinarian_id,
      starts_at,
      ends_at,
      status
    FROM appointments
    WHERE veterinarian_id = $1
      AND DATE(starts_at) = $2
      AND status <> 'CANCELLED'
    ORDER BY starts_at
  `;

  const result = await pool.query(query, [veterinarianId, appointmentDate]);
  return result.rows;
};

module.exports = {
  createAppointment,
  findAppointmentById,
  getAllAppointments,
  updateAppointmentById,
  cancelAppointmentById,
  getAppointmentsByVeterinarianAndDate,
};