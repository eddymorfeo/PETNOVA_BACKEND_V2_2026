const isValidDateTimeString = (value) => {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const validateCreatePetVaccination = (body) => {
  const {
    petId,
    vaccineId,
    appliedAt,
    nextDueAt,
    consultationId,
  } = body;

  if (!petId || !vaccineId || !appliedAt) {
    return {
      success: false,
      message: 'petId, vaccineId y appliedAt son obligatorios.',
    };
  }

  if (typeof petId !== 'string') {
    return {
      success: false,
      message: 'petId debe ser texto.',
    };
  }

  if (typeof vaccineId !== 'string') {
    return {
      success: false,
      message: 'vaccineId debe ser texto.',
    };
  }

  if (!isValidDateTimeString(appliedAt)) {
    return {
      success: false,
      message: 'appliedAt debe ser una fecha válida.',
    };
  }

  if (nextDueAt !== undefined && !isValidDateTimeString(nextDueAt)) {
    return {
      success: false,
      message: 'nextDueAt debe ser una fecha válida.',
    };
  }

  if (consultationId !== undefined && typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdatePetVaccination = (body) => {
  const {
    vaccineId,
    appliedAt,
    nextDueAt,
    consultationId,
  } = body;

  if (
    vaccineId === undefined &&
    appliedAt === undefined &&
    nextDueAt === undefined &&
    consultationId === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (vaccineId !== undefined && typeof vaccineId !== 'string') {
    return {
      success: false,
      message: 'vaccineId debe ser texto.',
    };
  }

  if (appliedAt !== undefined && !isValidDateTimeString(appliedAt)) {
    return {
      success: false,
      message: 'appliedAt debe ser una fecha válida.',
    };
  }

  if (nextDueAt !== undefined && !isValidDateTimeString(nextDueAt)) {
    return {
      success: false,
      message: 'nextDueAt debe ser una fecha válida.',
    };
  }

  if (consultationId !== undefined && typeof consultationId !== 'string') {
    return {
      success: false,
      message: 'consultationId debe ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreatePetVaccination,
  validateUpdatePetVaccination,
};