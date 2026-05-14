const bcrypt = require('bcryptjs');

const comparePassword = async (plainPassword, hashedPassword) => {
  if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
    return false;
  }

  return bcrypt.compare(plainPassword, hashedPassword);
};

const hashPassword = async (plainPassword) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  return bcrypt.hash(plainPassword, saltRounds);
};

module.exports = {
  comparePassword,
  hashPassword,
};
