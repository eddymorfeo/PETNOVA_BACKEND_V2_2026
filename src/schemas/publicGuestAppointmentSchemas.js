const isValidDateString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreatePublicGuestAppointment = (body) => {
  const {
    contactName,
    contactEmail,
    contactPhone,
    pet,
    appointment,
  } = body;

  if (!contactName || !contactEmail || !contactPhone || !pet || !appointment) {
    return {
      success: false,
      message: 'contactName, contactEmail, contactPhone, pet y appointment son obligatorios.',
    };
  }

  if (typeof contactName !== 'string' || typeof contactEmail !== 'string' || typeof contactPhone !== 'string') {
    return {
      success: false,
      message: 'Los datos de contacto deben ser texto.',
    };
  }

  if (
    !pet.name ||
    !pet.species ||
    !pet.breed ||
    typeof pet.name !== 'string' ||
    typeof pet.species !== 'string' ||
    typeof pet.breed !== 'string'
  ) {
    return {
      success: false,
      message: 'pet.name, pet.species y pet.breed son obligatorios.',
    };
  }

  if (
    !appointment.appointmentTypeId ||
    !appointment.veterinarianId ||
    !appointment.appointmentDate ||
    !appointment.appointmentTime ||
    !appointment.reason
  ) {
    return {
      success: false,
      message: 'appointmentTypeId, veterinarianId, appointmentDate, appointmentTime y reason son obligatorios.',
    };
  }

  if (
    typeof appointment.appointmentTypeId !== 'string' ||
    typeof appointment.veterinarianId !== 'string' ||
    typeof appointment.appointmentDate !== 'string' ||
    typeof appointment.appointmentTime !== 'string' ||
    typeof appointment.reason !== 'string'
  ) {
    return {
      success: false,
      message: 'Los datos de appointment deben ser texto.',
    };
  }

  if (!isValidDateString(appointment.appointmentDate)) {
    return {
      success: false,
      message: 'appointmentDate debe ser una fecha válida.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreatePublicGuestAppointment,
};