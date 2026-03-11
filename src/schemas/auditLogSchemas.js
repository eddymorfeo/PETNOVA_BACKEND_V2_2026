const validateCreateAuditLog = (body) => {
  const {
    actorType,
    actorId,
    action,
    entity,
    entityId,
    meta,
  } = body;

  if (!actorType || !action || !entity) {
    return {
      success: false,
      message: 'actorType, action y entity son obligatorios.',
    };
  }

  if (typeof actorType !== 'string') {
    return {
      success: false,
      message: 'actorType debe ser texto.',
    };
  }

  if (actorId !== undefined && typeof actorId !== 'string') {
    return {
      success: false,
      message: 'actorId debe ser texto.',
    };
  }

  if (typeof action !== 'string') {
    return {
      success: false,
      message: 'action debe ser texto.',
    };
  }

  if (typeof entity !== 'string') {
    return {
      success: false,
      message: 'entity debe ser texto.',
    };
  }

  if (entityId !== undefined && typeof entityId !== 'string') {
    return {
      success: false,
      message: 'entityId debe ser texto.',
    };
  }

  if (
    meta !== undefined &&
    (typeof meta !== 'object' || meta === null || Array.isArray(meta))
  ) {
    return {
      success: false,
      message: 'meta debe ser un objeto JSON.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateAuditLog,
};