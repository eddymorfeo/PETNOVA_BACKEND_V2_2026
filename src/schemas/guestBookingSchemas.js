const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreateGuestBooking = (body) => {
  const {
    appointmentId,
    contactEmail,
    contactName,
    contactPhone,
    invitationSentAt,
    convertedClientId,
  } = body;

  if (!appointmentId || !contactEmail || !contactName) {
    return {
      success: false,
      message: 'appointmentId, contactEmail y contactName son obligatorios.',
    };
  }

  if (typeof appointmentId !== 'string') {
    return {
      success: false,
      message: 'appointmentId debe ser texto.',
    };
  }

  if (typeof contactEmail !== 'string') {
    return {
      success: false,
      message: 'contactEmail debe ser texto.',
    };
  }

  if (typeof contactName !== 'string') {
    return {
      success: false,
      message: 'contactName debe ser texto.',
    };
  }

  if (contactPhone !== undefined && typeof contactPhone !== 'string') {
    return {
      success: false,
      message: 'contactPhone debe ser texto.',
    };
  }

  if (invitationSentAt !== undefined && !isValidDateTimeString(invitationSentAt)) {
    return {
      success: false,
      message: 'invitationSentAt debe ser una fecha válida.',
    };
  }

  if (convertedClientId !== undefined && typeof convertedClientId !== 'string') {
    return {
      success: false,
      message: 'convertedClientId debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateGuestBooking = (body) => {
  const {
    contactEmail,
    contactName,
    contactPhone,
    invitationSentAt,
    convertedClientId,
  } = body;

  if (
    contactEmail === undefined &&
    contactName === undefined &&
    contactPhone === undefined &&
    invitationSentAt === undefined &&
    convertedClientId === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (contactEmail !== undefined && typeof contactEmail !== 'string') {
    return {
      success: false,
      message: 'contactEmail debe ser texto.',
    };
  }

  if (contactName !== undefined && typeof contactName !== 'string') {
    return {
      success: false,
      message: 'contactName debe ser texto.',
    };
  }

  if (contactPhone !== undefined && typeof contactPhone !== 'string') {
    return {
      success: false,
      message: 'contactPhone debe ser texto.',
    };
  }

  if (invitationSentAt !== undefined && !isValidDateTimeString(invitationSentAt)) {
    return {
      success: false,
      message: 'invitationSentAt debe ser una fecha válida.',
    };
  }

  if (convertedClientId !== undefined && typeof convertedClientId !== 'string') {
    return {
      success: false,
      message: 'convertedClientId debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateGuestBooking,
  validateUpdateGuestBooking,
};