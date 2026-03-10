const validateCreateConsultation = (body) => {
  const {
    appointmentId,
    petId,
    clientId,
    veterinarianId,
    chiefComplaint,
    anamnesis,
    physicalExam,
    assessment,
    plan,
    weightKg,
    temperatureC,
    diagnosis,
    summary,
  } = body;

  if (!appointmentId || !petId || !clientId || !veterinarianId) {
    return {
      success: false,
      message: 'appointmentId, petId, clientId y veterinarianId son obligatorios.',
    };
  }

  if (
    typeof appointmentId !== 'string' ||
    typeof petId !== 'string' ||
    typeof clientId !== 'string' ||
    typeof veterinarianId !== 'string'
  ) {
    return {
      success: false,
      message: 'Los identificadores deben ser texto.',
    };
  }

  const textFields = {
    chiefComplaint,
    anamnesis,
    physicalExam,
    assessment,
    plan,
    diagnosis,
    summary,
  };

  for (const [key, value] of Object.entries(textFields)) {
    if (value !== undefined && typeof value !== 'string') {
      return {
        success: false,
        message: `${key} debe ser texto.`,
      };
    }
  }

  if (weightKg !== undefined && typeof weightKg !== 'number') {
    return {
      success: false,
      message: 'weightKg debe ser numérico.',
    };
  }

  if (temperatureC !== undefined && typeof temperatureC !== 'number') {
    return {
      success: false,
      message: 'temperatureC debe ser numérico.',
    };
  }

  return { success: true };
};

const validateUpdateConsultation = (body) => {
  const {
    appointmentId,
    petId,
    clientId,
    veterinarianId,
    chiefComplaint,
    anamnesis,
    physicalExam,
    assessment,
    plan,
    weightKg,
    temperatureC,
    diagnosis,
    summary,
  } = body;

  if (
    appointmentId === undefined &&
    petId === undefined &&
    clientId === undefined &&
    veterinarianId === undefined &&
    chiefComplaint === undefined &&
    anamnesis === undefined &&
    physicalExam === undefined &&
    assessment === undefined &&
    plan === undefined &&
    weightKg === undefined &&
    temperatureC === undefined &&
    diagnosis === undefined &&
    summary === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  const idFields = { appointmentId, petId, clientId, veterinarianId };

  for (const [key, value] of Object.entries(idFields)) {
    if (value !== undefined && typeof value !== 'string') {
      return {
        success: false,
        message: `${key} debe ser texto.`,
      };
    }
  }

  const textFields = {
    chiefComplaint,
    anamnesis,
    physicalExam,
    assessment,
    plan,
    diagnosis,
    summary,
  };

  for (const [key, value] of Object.entries(textFields)) {
    if (value !== undefined && typeof value !== 'string') {
      return {
        success: false,
        message: `${key} debe ser texto.`,
      };
    }
  }

  if (weightKg !== undefined && typeof weightKg !== 'number') {
    return {
      success: false,
      message: 'weightKg debe ser numérico.',
    };
  }

  if (temperatureC !== undefined && typeof temperatureC !== 'number') {
    return {
      success: false,
      message: 'temperatureC debe ser numérico.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateConsultation,
  validateUpdateConsultation,
};