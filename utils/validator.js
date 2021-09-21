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
      'string.empty': 'The account cannot be blank',
      'string.max': 'The account should not exceed 50 words'

  }),
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .messages({
      'string.base':'Data type of name must be a string',
      'string.empty': 'The name cannot be blank',
      'string.max': 'The name should not exceed 50 words'
    }),
  email: Joi.string()
    .trim()
    .email()
    .messages({
      'string.base':'Data type of email must be a string',
      'string.email': 'Email must be a valid email',
      'string.empty': 'The email cannot be blank'
    }),
  password: Joi.string()
    .trim()
    .min(4)
    .max(50)
    .messages({
      'string.base':'Data type of password must be a string',
      'string.empty': 'The password cannot be blank',
      'string.max': 'The password should not exceed 50 words',
      'string.min': 'Your password needs to be at least 4 characters. Please enter a longer one'
    }),
  checkPassword: Joi.ref('password'),
  introduction: Joi.string()
    .trim()
    .max(160)
    .allow('')
    .messages({
      'string.base':'Data type of introduction must be a string',
      'string.max': 'The introduction should not exceed 160 words'
    }),
  avatar: Joi.string().trim().allow(''),
  cover: Joi.string().trim().allow('')
})

// Joi schema for validating tweet format
const tweetSchema = Joi.object({
  description: Joi.string()
    .trim()
    .max(140)
    .messages({
      'string.base':'Data type of description must be a string',
      'string.empty': 'The description cannot be blank',
      'string.max': 'The description should not exceed 140 words'
    })
})

// Joi schema for validating reply format
const replySchema = Joi.object({
  comment: Joi.string()
    .trim()
    .max(140)
    .messages({
      'string.base':'Data type of comment must be a string',
      'string.empty': 'The comment cannot be blank',
      'string.max': 'The comment should not exceed 140 words'
    })
})

// Filter Joi error details to a single array
const joiMessageHandler = (errors) => {
    const messages = []
    errors.forEach(error => {
      if (error.message === '"checkPassword" must be [ref:password]') {
        error.message = 'Password value is not equal to checkPassword'
      }
        messages.push(error.message)
    })
    return messages.join('|')
}

module.exports = {
  joiMessageHandler,
  userInfoSchema,
  tweetSchema,
  replySchema
}
