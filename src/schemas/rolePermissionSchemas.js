const validateCreateRolePermission = (body) => {
  const { roleId, permissionId } = body;

  if (!roleId || !permissionId) {
    return {
      success: false,
      message: 'roleId y permissionId son obligatorios.',
    };
  }

  if (typeof roleId !== 'string' || typeof permissionId !== 'string') {
    return {
      success: false,
      message: 'roleId y permissionId deben ser texto.',
    };
  }

  return { success: true };
};

const validateDeleteRolePermission = (body) => {
  const { roleId, permissionId } = body;

  if (!roleId || !permissionId) {
    return {
      success: false,
      message: 'roleId y permissionId son obligatorios.',
    };
  }

  if (typeof roleId !== 'string' || typeof permissionId !== 'string') {
    return {
      success: false,
      message: 'roleId y permissionId deben ser texto.',
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateRolePermission,
  validateDeleteRolePermission,
};