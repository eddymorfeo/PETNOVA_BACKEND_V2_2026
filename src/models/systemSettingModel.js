const pool = require('../db/db');

const getAllSystemSettings = async () => {
  const query = `
    SELECT
      id,
      appointment_slot_minutes,
      client_cancel_hours_limit,
      client_reschedule_hours_limit,
      send_reminders_enabled,
      reminder_hours_before,
      clinic_name,
      contact_email,
      contact_phone,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM system_settings
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const findSystemSettingById = async (systemSettingId) => {
  const query = `
    SELECT
      id,
      appointment_slot_minutes,
      client_cancel_hours_limit,
      client_reschedule_hours_limit,
      send_reminders_enabled,
      reminder_hours_before,
      clinic_name,
      contact_email,
      contact_phone,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM system_settings
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [systemSettingId]);
  return result.rows[0] || null;
};

const updateSystemSettingById = async (systemSettingId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.appointmentSlotMinutes !== undefined) {
    fields.push(`appointment_slot_minutes = $${index++}`);
    values.push(data.appointmentSlotMinutes);
  }

  if (data.clientCancelHoursLimit !== undefined) {
    fields.push(`client_cancel_hours_limit = $${index++}`);
    values.push(data.clientCancelHoursLimit);
  }

  if (data.clientRescheduleHoursLimit !== undefined) {
    fields.push(`client_reschedule_hours_limit = $${index++}`);
    values.push(data.clientRescheduleHoursLimit);
  }

  if (data.sendRemindersEnabled !== undefined) {
    fields.push(`send_reminders_enabled = $${index++}`);
    values.push(data.sendRemindersEnabled);
  }

  if (data.reminderHoursBefore !== undefined) {
    fields.push(`reminder_hours_before = $${index++}`);
    values.push(data.reminderHoursBefore);
  }

  if (data.clinicName !== undefined) {
    fields.push(`clinic_name = $${index++}`);
    values.push(data.clinicName);
  }

  if (data.contactEmail !== undefined) {
    fields.push(`contact_email = $${index++}`);
    values.push(data.contactEmail);
  }

  if (data.contactPhone !== undefined) {
    fields.push(`contact_phone = $${index++}`);
    values.push(data.contactPhone);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(systemSettingId);

  const query = `
    UPDATE system_settings
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      appointment_slot_minutes,
      client_cancel_hours_limit,
      client_reschedule_hours_limit,
      send_reminders_enabled,
      reminder_hours_before,
      clinic_name,
      contact_email,
      contact_phone,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

module.exports = {
  getAllSystemSettings,
  findSystemSettingById,
  updateSystemSettingById,
};