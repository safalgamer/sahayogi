const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    User.findById(decoded.id).then(user => {
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or deactivated' });
      }
      req.user = user;
      next();
    }).catch(next);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    User.findById(decoded.id).then(user => {
      req.user = user || null;
      next();
    }).catch(() => { req.user = null; next(); });
  } catch (err) {
    req.user = null;
    next();
  }
}

module.exports = { authenticate, authorize, optionalAuth };
