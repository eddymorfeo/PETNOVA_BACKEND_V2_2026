const isValidDateString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreatePublicGuestAppointment = (body) => {
  const { contactName, contactEmail, contactPhone, pet, appointment } = body;

  if (!contactName || !contactEmail || !pet || !appointment) {
    return {
      success: false,
      message: 'contactName, contactEmail, pet y appointment son obligatorios.',
    };
  }

  if (typeof contactName !== 'string' || typeof contactEmail !== 'string') {
    return {
      success: false,
      message: 'Los datos de contacto deben ser texto.',
    };
  }

  if (
    contactPhone !== undefined &&
    contactPhone !== null &&
    typeof contactPhone !== 'string'
  ) {
    return {
      success: false,
      message: 'contactPhone debe ser texto cuando se informa.',
    };
  }

  if (
    !pet.name ||
    !pet.species ||
    typeof pet.name !== 'string' ||
    typeof pet.species !== 'string'
  ) {
    return {
      success: false,
      message: 'pet.name y pet.species son obligatorios.',
    };
  }

  if (pet.breed !== undefined && pet.breed !== null && typeof pet.breed !== 'string') {
    return {
      success: false,
      message: 'pet.breed debe ser texto cuando se informa.',
    };
  }

  if (
    !appointment.appointmentTypeId ||
    !appointment.veterinarianId ||
    !appointment.appointmentDate ||
    !appointment.appointmentTime
  ) {
    return {
      success: false,
      message:
        'appointmentTypeId, veterinarianId, appointmentDate y appointmentTime son obligatorios.',
    };
  }

  if (
    typeof appointment.appointmentTypeId !== 'string' ||
    typeof appointment.veterinarianId !== 'string' ||
    typeof appointment.appointmentDate !== 'string' ||
    typeof appointment.appointmentTime !== 'string'
  ) {
    return {
      success: false,
      message: 'Los datos principales de appointment deben ser texto.',
    };
  }

  if (
    appointment.reason !== undefined &&
    appointment.reason !== null &&
    typeof appointment.reason !== 'string'
  ) {
    return {
      success: false,
      message: 'appointment.reason debe ser texto cuando se informa.',
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
