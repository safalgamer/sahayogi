const jwt = require('jsonwebtoken');

const getSecret = () => process.env.JWT_SECRET || 'sahayogi_dev_secret_key_change_in_production';
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';
const getRefreshExpiresIn = () => process.env.JWT_REFRESH_EXPIRES_IN || '30d';

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    getSecret(),
    { expiresIn: getExpiresIn() }
  );
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { id: user._id },
    getSecret() + '_refresh',
    { expiresIn: getRefreshExpiresIn() }
  );
  return refreshToken;
}

function verifyAccessToken(token) {
  return jwt.verify(token, getSecret());
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getSecret() + '_refresh');
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
