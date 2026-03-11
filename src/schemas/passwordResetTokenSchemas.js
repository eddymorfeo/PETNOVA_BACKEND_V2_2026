const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreatePasswordResetToken = (body) => {
  const { subjectType, subjectId, tokenHash, expiresAt, usedAt } = body;

  if (!subjectType || !subjectId || !tokenHash || !expiresAt) {
    return {
      success: false,
      message: 'subjectType, subjectId, tokenHash y expiresAt son obligatorios.',
    };
  }

  if (typeof subjectType !== 'string') {
    return {
      success: false,
      message: 'subjectType debe ser texto.',
    };
  }

  if (typeof subjectId !== 'string') {
    return {
      success: false,
      message: 'subjectId debe ser texto.',
    };
  }

  if (typeof tokenHash !== 'string') {
    return {
      success: false,
      message: 'tokenHash debe ser texto.',
    };
  }

  if (!isValidDateTimeString(expiresAt)) {
    return {
      success: false,
      message: 'expiresAt debe ser una fecha válida.',
    };
  }

  if (usedAt !== undefined && !isValidDateTimeString(usedAt)) {
    return {
      success: false,
      message: 'usedAt debe ser una fecha válida.',
    };
  }

  return { success: true };
};

const validateUpdatePasswordResetToken = (body) => {
  const { tokenHash, expiresAt, usedAt } = body;

  if (
    tokenHash === undefined &&
    expiresAt === undefined &&
    usedAt === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (tokenHash !== undefined && typeof tokenHash !== 'string') {
    return {
      success: false,
      message: 'tokenHash debe ser texto.',
    };
  }

  if (expiresAt !== undefined && !isValidDateTimeString(expiresAt)) {
    return {
      success: false,
      message: 'expiresAt debe ser una fecha válida.',
    };
  }

  if (usedAt !== undefined && !isValidDateTimeString(usedAt)) {
    return {
      success: false,
      message: 'usedAt debe ser una fecha válida.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreatePasswordResetToken,
  validateUpdatePasswordResetToken,
};