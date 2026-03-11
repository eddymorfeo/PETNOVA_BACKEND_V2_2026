const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreateEmailOutbox = (body) => {
  const {
    toEmail,
    template,
    payload,
    status,
    lastError,
    scheduledFor,
    sentAt,
  } = body;

  if (!toEmail || !template || payload === undefined) {
    return {
      success: false,
      message: 'toEmail, template y payload son obligatorios.',
    };
  }

  if (typeof toEmail !== 'string') {
    return {
      success: false,
      message: 'toEmail debe ser texto.',
    };
  }

  if (typeof template !== 'string') {
    return {
      success: false,
      message: 'template debe ser texto.',
    };
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return {
      success: false,
      message: 'payload debe ser un objeto JSON.',
    };
  }

  if (status !== undefined && typeof status !== 'string') {
    return {
      success: false,
      message: 'status debe ser texto.',
    };
  }

  if (lastError !== undefined && typeof lastError !== 'string') {
    return {
      success: false,
      message: 'lastError debe ser texto.',
    };
  }

  if (scheduledFor !== undefined && !isValidDateTimeString(scheduledFor)) {
    return {
      success: false,
      message: 'scheduledFor debe ser una fecha válida.',
    };
  }

  if (sentAt !== undefined && !isValidDateTimeString(sentAt)) {
    return {
      success: false,
      message: 'sentAt debe ser una fecha válida.',
    };
  }

  return { success: true };
};

const validateUpdateEmailOutbox = (body) => {
  const {
    toEmail,
    template,
    payload,
    status,
    lastError,
    scheduledFor,
    sentAt,
  } = body;

  if (
    toEmail === undefined &&
    template === undefined &&
    payload === undefined &&
    status === undefined &&
    lastError === undefined &&
    scheduledFor === undefined &&
    sentAt === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (toEmail !== undefined && typeof toEmail !== 'string') {
    return {
      success: false,
      message: 'toEmail debe ser texto.',
    };
  }

  if (template !== undefined && typeof template !== 'string') {
    return {
      success: false,
      message: 'template debe ser texto.',
    };
  }

  if (
    payload !== undefined &&
    (typeof payload !== 'object' || payload === null || Array.isArray(payload))
  ) {
    return {
      success: false,
      message: 'payload debe ser un objeto JSON.',
    };
  }

  if (status !== undefined && typeof status !== 'string') {
    return {
      success: false,
      message: 'status debe ser texto.',
    };
  }

  if (lastError !== undefined && typeof lastError !== 'string') {
    return {
      success: false,
      message: 'lastError debe ser texto.',
    };
  }

  if (scheduledFor !== undefined && !isValidDateTimeString(scheduledFor)) {
    return {
      success: false,
      message: 'scheduledFor debe ser una fecha válida.',
    };
  }

  if (sentAt !== undefined && !isValidDateTimeString(sentAt)) {
    return {
      success: false,
      message: 'sentAt debe ser una fecha válida.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateEmailOutbox,
  validateUpdateEmailOutbox,
};