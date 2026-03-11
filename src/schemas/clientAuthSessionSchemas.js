const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreateClientAuthSession = (body) => {
  const { clientId, refreshTokenHash, expiresAt } = body;

  if (!clientId || !refreshTokenHash || !expiresAt) {
    return {
      success: false,
      message: 'clientId, refreshTokenHash y expiresAt son obligatorios.',
    };
  }

  if (typeof clientId !== 'string') {
    return {
      success: false,
      message: 'clientId debe ser texto.',
    };
  }

  if (typeof refreshTokenHash !== 'string') {
    return {
      success: false,
      message: 'refreshTokenHash debe ser texto.',
    };
  }

  if (!isValidDateTimeString(expiresAt)) {
    return {
      success: false,
      message: 'expiresAt debe ser una fecha válida.',
    };
  }

  return { success: true };
};

const validateUpdateClientAuthSession = (body) => {
  const { refreshTokenHash, expiresAt, revokedAt } = body;

  if (
    refreshTokenHash === undefined &&
    expiresAt === undefined &&
    revokedAt === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (refreshTokenHash !== undefined && typeof refreshTokenHash !== 'string') {
    return {
      success: false,
      message: 'refreshTokenHash debe ser texto.',
    };
  }

  if (expiresAt !== undefined && !isValidDateTimeString(expiresAt)) {
    return {
      success: false,
      message: 'expiresAt debe ser una fecha válida.',
    };
  }

  if (revokedAt !== undefined && !isValidDateTimeString(revokedAt)) {
    return {
      success: false,
      message: 'revokedAt debe ser una fecha válida.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateClientAuthSession,
  validateUpdateClientAuthSession,
};