const validateUpdateSystemSetting = (body) => {
  const {
    appointmentSlotMinutes,
    clientCancelHoursLimit,
    clientRescheduleHoursLimit,
    sendRemindersEnabled,
    reminderHoursBefore,
    clinicName,
    contactEmail,
    contactPhone,
  } = body;

  if (
    appointmentSlotMinutes === undefined &&
    clientCancelHoursLimit === undefined &&
    clientRescheduleHoursLimit === undefined &&
    sendRemindersEnabled === undefined &&
    reminderHoursBefore === undefined &&
    clinicName === undefined &&
    contactEmail === undefined &&
    contactPhone === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (
    appointmentSlotMinutes !== undefined &&
    typeof appointmentSlotMinutes !== 'number'
  ) {
    return {
      success: false,
      message: 'appointmentSlotMinutes debe ser numérico.',
    };
  }

  if (
    clientCancelHoursLimit !== undefined &&
    typeof clientCancelHoursLimit !== 'number'
  ) {
    return {
      success: false,
      message: 'clientCancelHoursLimit debe ser numérico.',
    };
  }

  if (
    clientRescheduleHoursLimit !== undefined &&
    typeof clientRescheduleHoursLimit !== 'number'
  ) {
    return {
      success: false,
      message: 'clientRescheduleHoursLimit debe ser numérico.',
    };
  }

  if (
    sendRemindersEnabled !== undefined &&
    typeof sendRemindersEnabled !== 'boolean'
  ) {
    return {
      success: false,
      message: 'sendRemindersEnabled debe ser boolean.',
    };
  }

  if (
    reminderHoursBefore !== undefined &&
    typeof reminderHoursBefore !== 'number'
  ) {
    return {
      success: false,
      message: 'reminderHoursBefore debe ser numérico.',
    };
  }

  if (clinicName !== undefined && typeof clinicName !== 'string') {
    return {
      success: false,
      message: 'clinicName debe ser texto.',
    };
  }

  if (contactEmail !== undefined && typeof contactEmail !== 'string') {
    return {
      success: false,
      message: 'contactEmail debe ser texto.',
    };
  }

  if (contactPhone !== undefined && typeof contactPhone !== 'string') {
    return {
      success: false,
      message: 'contactPhone debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateUpdateSystemSetting,
};