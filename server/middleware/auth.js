const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Extracts and verifies Bearer token from Authorization header.
 * Attaches decoded user payload to req.user on success.
 */
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    req.user = decoded; // { id, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please login again' });
    }
    return res.status(401).json({ message: 'Token is invalid' });
  }
};
