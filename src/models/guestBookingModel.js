const pool = require('../db/db');

const createGuestBooking = async ({
  appointmentId,
  contactEmail,
  contactName,
  contactPhone,
  invitationSentAt,
  convertedClientId,
  createdBy,
}) => {
  const query = `
    INSERT INTO guest_bookings (
      appointment_id,
      contact_email,
      contact_name,
      contact_phone,
      invitation_sent_at,
      converted_client_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7, NOW(), NOW())
    RETURNING
      id,
      appointment_id,
      contact_email,
      contact_name,
      contact_phone,
      invitation_sent_at,
      converted_client_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    appointmentId,
    contactEmail,
    contactName,
    contactPhone || null,
    invitationSentAt || null,
    convertedClientId || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findGuestBookingById = async (guestBookingId) => {
  const query = `
    SELECT
      gb.id,
      gb.appointment_id,
      gb.contact_email,
      gb.contact_name,
      gb.contact_phone,
      gb.invitation_sent_at,
      gb.converted_client_id,
      gb.created_by,
      gb.updated_by,
      gb.created_at,
      gb.updated_at
    FROM guest_bookings gb
    WHERE gb.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [guestBookingId]);
  return result.rows[0] || null;
};

const getAllGuestBookings = async () => {
  const query = `
    SELECT
      gb.id,
      gb.appointment_id,
      gb.contact_email,
      gb.contact_name,
      gb.contact_phone,
      gb.invitation_sent_at,
      gb.converted_client_id,
      gb.created_by,
      gb.updated_by,
      gb.created_at,
      gb.updated_at
    FROM guest_bookings gb
    ORDER BY gb.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateGuestBookingById = async (guestBookingId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.contactEmail !== undefined) {
    fields.push(`contact_email = $${index++}`);
    values.push(data.contactEmail);
  }

  if (data.contactName !== undefined) {
    fields.push(`contact_name = $${index++}`);
    values.push(data.contactName);
  }

  if (data.contactPhone !== undefined) {
    fields.push(`contact_phone = $${index++}`);
    values.push(data.contactPhone);
  }

  if (data.invitationSentAt !== undefined) {
    fields.push(`invitation_sent_at = $${index++}`);
    values.push(data.invitationSentAt);
  }

  if (data.convertedClientId !== undefined) {
    fields.push(`converted_client_id = $${index++}`);
    values.push(data.convertedClientId);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(guestBookingId);

  const query = `
    UPDATE guest_bookings
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      appointment_id,
      contact_email,
      contact_name,
      contact_phone,
      invitation_sent_at,
      converted_client_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deleteGuestBookingById = async (guestBookingId) => {
  const query = `
    DELETE FROM guest_bookings
    WHERE id = $1
    RETURNING
      id,
      appointment_id,
      contact_email,
      contact_name,
      contact_phone,
      invitation_sent_at,
      converted_client_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [guestBookingId]);
  return result.rows[0] || null;
};

module.exports = {
  createGuestBooking,
  findGuestBookingById,
  getAllGuestBookings,
  updateGuestBookingById,
  deleteGuestBookingById,
};