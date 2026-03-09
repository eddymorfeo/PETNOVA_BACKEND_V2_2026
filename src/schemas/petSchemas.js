const validateCreatePet = (body) => {
  const {
    clientId,
    name,
    speciesId,
    breedId,
    sex,
    birthDate,
    color,
    microchip,
    isSterilized,
    allergies,
    notes,
  } = body;

  if (!clientId || !name || !speciesId) {
    return {
      success: false,
      message: 'clientId, name y speciesId son obligatorios.',
    };
  }

  if (typeof clientId !== 'string') {
    return {
      success: false,
      message: 'clientId debe ser texto.',
    };
  }

  if (typeof name !== 'string') {
    return {
      success: false,
      message: 'name debe ser texto.',
    };
  }

  if (typeof speciesId !== 'string') {
    return {
      success: false,
      message: 'speciesId debe ser texto.',
    };
  }

  if (breedId !== undefined && typeof breedId !== 'string') {
    return {
      success: false,
      message: 'breedId debe ser texto.',
    };
  }

  if (sex !== undefined && typeof sex !== 'string') {
    return {
      success: false,
      message: 'sex debe ser texto.',
    };
  }

  if (birthDate !== undefined && typeof birthDate !== 'string') {
    return {
      success: false,
      message: 'birthDate debe ser texto.',
    };
  }

  if (color !== undefined && typeof color !== 'string') {
    return {
      success: false,
      message: 'color debe ser texto.',
    };
  }

  if (microchip !== undefined && typeof microchip !== 'string') {
    return {
      success: false,
      message: 'microchip debe ser texto.',
    };
  }

  if (isSterilized !== undefined && typeof isSterilized !== 'boolean') {
    return {
      success: false,
      message: 'isSterilized debe ser boolean.',
    };
  }

  if (allergies !== undefined && typeof allergies !== 'string') {
    return {
      success: false,
      message: 'allergies debe ser texto.',
    };
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return {
      success: false,
      message: 'notes debe ser texto.',
    };
  }

  return { success: true };
};

const validateUpdatePet = (body) => {
  const {
    clientId,
    name,
    speciesId,
    breedId,
    sex,
    birthDate,
    color,
    microchip,
    isSterilized,
    allergies,
    notes,
    isActive,
  } = body;

  if (
    clientId === undefined &&
    name === undefined &&
    speciesId === undefined &&
    breedId === undefined &&
    sex === undefined &&
    birthDate === undefined &&
    color === undefined &&
    microchip === undefined &&
    isSterilized === undefined &&
    allergies === undefined &&
    notes === undefined &&
    isActive === undefined
  ) {
    return {
      success: false,
      message: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  if (clientId !== undefined && typeof clientId !== 'string') {
    return { success: false, message: 'clientId debe ser texto.' };
  }

  if (name !== undefined && typeof name !== 'string') {
    return { success: false, message: 'name debe ser texto.' };
  }

  if (speciesId !== undefined && typeof speciesId !== 'string') {
    return { success: false, message: 'speciesId debe ser texto.' };
  }

  if (breedId !== undefined && typeof breedId !== 'string') {
    return { success: false, message: 'breedId debe ser texto.' };
  }

  if (sex !== undefined && typeof sex !== 'string') {
    return { success: false, message: 'sex debe ser texto.' };
  }

  if (birthDate !== undefined && typeof birthDate !== 'string') {
    return { success: false, message: 'birthDate debe ser texto.' };
  }

  if (color !== undefined && typeof color !== 'string') {
    return { success: false, message: 'color debe ser texto.' };
  }

  if (microchip !== undefined && typeof microchip !== 'string') {
    return { success: false, message: 'microchip debe ser texto.' };
  }

  if (isSterilized !== undefined && typeof isSterilized !== 'boolean') {
    return { success: false, message: 'isSterilized debe ser boolean.' };
  }

  if (allergies !== undefined && typeof allergies !== 'string') {
    return { success: false, message: 'allergies debe ser texto.' };
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return { success: false, message: 'notes debe ser texto.' };
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return { success: false, message: 'isActive debe ser boolean.' };
  }

  return { success: true };
};

module.exports = {
  validateCreatePet,
  validateUpdatePet,
};