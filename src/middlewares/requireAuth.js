const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado.',
      });
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
};

module.exports = requireAuth;