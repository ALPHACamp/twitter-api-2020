const Joi = require('joi')

// Joi schema for validating user info format
const userInfoSchema = Joi.object({
  account: Joi.string()
    .trim()
    .pattern(/^\w+$/)
    .min(1)
    .max(50)
    .messages({
      'string.base':'Data type of account must be a string',
      'string.pattern.base':'The account should only include number, letter and underline',
      'string.empty': 'Required fields did not exist',
      'string.max': 'The account should not exceed 50 words'

  }),
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .messages({
      'string.base':'Data type of name must be a string',
      'string.empty': 'Required fields did not exist',
      'string.max': 'The name should not exceed 50 words'
    }),
  email: Joi.string()
    .trim()
    .email()
    .messages({
      'string.base':'Data type of email must be a string',
      'string.email': 'Email must be a valid email',
      'string.empty': 'Required fields did not exist'
    }),
  password: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .messages({
      'string.base':'Data type of password must be a string',
      'string.empty': 'Required fields did not exist',
      'string.max': 'The password should not exceed 50 words'
    }),
  checkPassword: Joi.ref('password'),
  introduction: Joi.string()
    .trim()
    .max(160)
    .messages({
      'string.base':'Data type of introduction must be a string',
      'string.empty': 'Required fields did not exist',
      'string.max': 'The introduction should not exceed 160 words'
    }),
  avatar: Joi.string().trim(),
  cover: Joi.string().trim()
})

// Filter joi error details to a single array
const joiMessageHandler = (errors) => {
    const messages = []
    errors.forEach(error => messages.push(error.message))
    return messages
}

module.exports = joiMessageHandler, userInfoSchema
