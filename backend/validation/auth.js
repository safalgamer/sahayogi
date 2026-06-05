const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.min': 'Name must be at least 2 characters', 'string.max': 'Name cannot exceed 100 characters' }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({ 'string.email': 'Please provide a valid email address' }),
  password: Joi.string().min(8).max(128).required()
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[^a-zA-Z0-9]/, 'special character')
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.name': 'Password must contain at least one {#name}',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required().messages({ 'any.required': 'Password is required' }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).max(128).required()
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[^a-zA-Z0-9]/, 'special character'),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required()
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[^a-zA-Z0-9]/, 'special character'),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
