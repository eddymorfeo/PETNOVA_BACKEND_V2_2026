const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreateReminder = (body) => {
  const {
    clientId,
    petId,
    type,
    title,
    message,
    dueAt,
    sentAt,
    status,
  } = body;

  if (!clientId || !petId || !type || !title || !dueAt) {
    return {
      success: false,
      message: 'clientId, petId, type, title y dueAt son obligatorios.',
    };
  }

  if (typeof clientId !== 'string') {
    return {
      success: false,
      message: 'clientId debe ser texto.',
    };
  }

  if (typeof petId !== 'string') {
    return {
      success: false,
      message: 'petId debe ser texto.',
    };
  }

  if (typeof type !== 'string') {
    return {
      success: false,
      message: 'type debe ser texto.',
    };
  }

  if (typeof title !== 'string') {
    return {
      success: false,
      message: 'title debe ser texto.',
    };
  }

  if (message !== undefined && typeof message !== 'string') {
    return {
      success: false,
      message: 'message debe ser texto.',
    };
  }

  if (!isValidDateTimeString(dueAt)) {
    return {
      success: false,
      message: 'dueAt debe ser una fecha válida.',
    };
  }

  if (sentAt !== undefined && !isValidDateTimeString(sentAt)) {
    return {
      success: false,
      message: 'sentAt debe ser una fecha válida.',
    };
  }

  if (status !== undefined && typeof status !== 'string') {
    return {
      success: false,
      message: 'status debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateReminder = (body) => {
  const {
    type,
    title,
    message,
    dueAt,
    sentAt,
    status,
  } = body;

  if (
    type === undefined &&
    title === undefined &&
    message === undefined &&
    dueAt === undefined &&
    sentAt === undefined &&
    status === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (type !== undefined && typeof type !== 'string') {
    return {
      success: false,
      message: 'type debe ser texto.',
    };
  }

  if (title !== undefined && typeof title !== 'string') {
    return {
      success: false,
      message: 'title debe ser texto.',
    };
  }

  if (message !== undefined && typeof message !== 'string') {
    return {
      success: false,
      message: 'message debe ser texto.',
    };
  }

  if (dueAt !== undefined && !isValidDateTimeString(dueAt)) {
    return {
      success: false,
      message: 'dueAt debe ser una fecha válida.',
    };
  }

  if (sentAt !== undefined && !isValidDateTimeString(sentAt)) {
    return {
      success: false,
      message: 'sentAt debe ser una fecha válida.',
    };
  }

  if (status !== undefined && typeof status !== 'string') {
    return {
      success: false,
      message: 'status debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateReminder,
  validateUpdateReminder,
};