const pool = require('../db/db');

const createAppointmentEvent = async ({
  appointmentId,
  fromStatus,
  toStatus,
  changedByType,
  changedById,
  note,
  createdBy,
}) => {
  const query = `
    INSERT INTO appointment_events (
      appointment_id,
      from_status,
      to_status,
      changed_by_type,
      changed_by_id,
      note,
      created_by,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING
      id,
      appointment_id,
      from_status,
      to_status,
      changed_by_type,
      changed_by_id,
      note,
      created_by,
      created_at
  `;

  const result = await pool.query(query, [
    appointmentId,
    fromStatus || null,
    toStatus,
    changedByType || null,
    changedById || null,
    note || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findAppointmentEventById = async (appointmentEventId) => {
  const query = `
    SELECT
      id,
      appointment_id,
      from_status,
      to_status,
      changed_by_type,
      changed_by_id,
      note,
      created_by,
      created_at
    FROM appointment_events
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [appointmentEventId]);
  return result.rows[0] || null;
};

const getAllAppointmentEvents = async () => {
  const query = `
    SELECT
      ae.id,
      ae.appointment_id,
      ae.from_status,
      ae.to_status,
      ae.changed_by_type,
      ae.changed_by_id,
      ae.note,
      ae.created_by,
      ae.created_at
    FROM appointment_events ae
    ORDER BY ae.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateAppointmentEventById = async (appointmentEventId, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.fromStatus !== undefined) {
    fields.push(`from_status = $${index++}`);
    values.push(data.fromStatus);
  }

  if (data.toStatus !== undefined) {
    fields.push(`to_status = $${index++}`);
    values.push(data.toStatus);
  }

  if (data.changedByType !== undefined) {
    fields.push(`changed_by_type = $${index++}`);
    values.push(data.changedByType);
  }

  if (data.changedById !== undefined) {
    fields.push(`changed_by_id = $${index++}`);
    values.push(data.changedById);
  }

  if (data.note !== undefined) {
    fields.push(`note = $${index++}`);
    values.push(data.note);
  }

  values.push(appointmentEventId);

  const query = `
    UPDATE appointment_events
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      appointment_id,
      from_status,
      to_status,
      changed_by_type,
      changed_by_id,
      note,
      created_by,
      created_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteAppointmentEventById = async (appointmentEventId) => {
  const query = `
    DELETE FROM appointment_events
    WHERE id = $1
    RETURNING
      id,
      appointment_id,
      from_status,
      to_status,
      changed_by_type,
      changed_by_id,
      note,
      created_by,
      created_at
  `;

  const result = await pool.query(query, [appointmentEventId]);
  return result.rows[0] || null;
};

module.exports = {
  createAppointmentEvent,
  findAppointmentEventById,
  getAllAppointmentEvents,
  updateAppointmentEventById,
  deleteAppointmentEventById,
};