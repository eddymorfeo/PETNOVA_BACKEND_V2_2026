const validateCreateAttachment = (body) => {
  const { consultationId, fileName, mimeType, storageKey } = body;

  if (!consultationId || !fileName || !storageKey) {
    return {
      success: false,
      message: 'consultationId, fileName y storageKey son obligatorios.',
    };
  }

  if (typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  if (typeof fileName !== 'string') {
    return {
      success: false,
      message: 'fileName debe ser texto.',
    };
  }

  if (storageKey !== undefined && typeof storageKey !== 'string') {
    return {
      success: false,
      message: 'storageKey debe ser texto.',
    };
  }

  if (mimeType !== undefined && typeof mimeType !== 'string') {
    return {
      success: false,
      message: 'mimeType debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdateAttachment = (body) => {
  const { fileName, mimeType, storageKey } = body;

  if (
    fileName === undefined &&
    mimeType === undefined &&
    storageKey === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (fileName !== undefined && typeof fileName !== 'string') {
    return {
      success: false,
      message: 'fileName debe ser texto.',
    };
  }

  if (mimeType !== undefined && typeof mimeType !== 'string') {
    return {
      success: false,
      message: 'mimeType debe ser texto.',
    };
  }

  if (storageKey !== undefined && typeof storageKey !== 'string') {
    return {
      success: false,
      message: 'storageKey debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateAttachment,
  validateUpdateAttachment,
};