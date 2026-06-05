const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { isConnected } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } = require('../validation/auth');

function requireDB(req, res, next) {
  if (!isConnected()) {
    return res.status(503).json({ message: 'Database not connected. Auth requires MongoDB.' });
  }
  next();
}

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const clearTokenCookies = (res) => {
  res.clearCookie('access_token', { ...COOKIE_OPTS });
  res.clearCookie('refresh_token', { ...COOKIE_OPTS });
};

const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');

router.post('/register', requireDB, validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }
    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    setTokenCookies(res, accessToken, refreshToken);
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post('/login', requireDB, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    setTokenCookies(res, accessToken, refreshToken);
    res.json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    clearTokenCookies(res);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token || req.body.refreshToken;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      clearTokenCookies(res);
      throw new AppError('Invalid refresh token', 401);
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();
    setTokenCookies(res, newAccessToken, newRefreshToken);
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', requireDB, validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();
    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password/:token', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = null;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
});

router.put('/change-password', authenticate, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }
    user.password = req.body.newPassword;
    user.refreshToken = null;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
