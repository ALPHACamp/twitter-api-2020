const Joi = require('joi')
const { User, Sequelize } = require('../models')
const { Op } = Sequelize
const ApiError = require('./customError')
// Joi schema for validating user info format
const userInfoSchema = Joi.object({
  account: Joi.string().trim().pattern(/^\w+$/).min(1).max(50).messages({
    'string.base': 'Data type of account must be a string',
    'string.pattern.base':
      'The account should only include number, letter and underline',
    'string.empty': 'The account cannot be blank',
    'string.max': 'The account should not exceed 50 words'
  }),
  name: Joi.string().trim().min(1).max(50).messages({
    'string.base': 'Data type of name must be a string',
    'string.empty': 'The name cannot be blank',
    'string.max': 'The name should not exceed 50 words'
  }),
  email: Joi.string().trim().email().messages({
    'string.base': 'Data type of email must be a string',
    'string.email': 'Email must be a valid email',
    'string.empty': 'The email cannot be blank'
  }),
  password: Joi.string().trim().min(4).max(50).messages({
    'string.base': 'Data type of password must be a string',
    'string.empty': 'The password cannot be blank',
    'string.max': 'The password should not exceed 50 words',
    'string.min':
      'Your password needs to be at least 4 characters. Please enter a longer one'
  }),
  checkPassword: Joi.ref('password'),
  introduction: Joi.string().trim().max(160).allow('').messages({
    'string.base': 'Data type of introduction must be a string',
    'string.max': 'The introduction should not exceed 160 words'
  })
})

// Joi schema for validating tweet format
const tweetSchema = Joi.object({
  description: Joi.string().trim().max(140).messages({
    'string.base': 'Data type of description must be a string',
    'string.empty': 'The description cannot be blank',
    'string.max': 'The description should not exceed 140 words'
  })
})

// Joi schema for validating reply format
const replySchema = Joi.object({
  comment: Joi.string().trim().max(140).messages({
    'string.base': 'Data type of comment must be a string',
    'string.empty': 'The comment cannot be blank',
    'string.max': 'The comment should not exceed 140 words'
  })
})

// Joi schema for validating message format
const messageSchema = Joi.object({
  UserId: Joi.required().messages({
    'any.required': 'The UserId cannot be blank'
  }),
  RoomId: Joi.required().messages({
    'any.required': 'The RoomId cannot be blank'
  }),
  content: Joi.string().trim().max(140).messages({
    'string.base': 'Data type of content must be a string',
    'string.max': 'The content should not exceed 140 words'
  })
})

// Joi schema for validating message format
const memberSchema = Joi.object({
  currentUserId: Joi.required().messages({
    'any.required': 'The currentUserId cannot be blank'
  }),
  targetUserId: Joi.required().messages({
    'any.required': 'The targetUserId cannot be blank'
  }),
  RoomId: Joi.required().messages({
    'any.required': 'The RoomId cannot be blank'
  }),
  isRead: Joi.required().messages({
    'any.required': 'The isRead cannot be blank'
  })
})

const roomSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.base': 'Data type of name must be a string',
    'any.required': 'The currentUserId cannot be blank'
  })
})

// Filter Joi error details to a single array
const joiMessageHandler = (errors) => {
  const messages = []
  errors.forEach((error) => {
    if (error.message === '"checkPassword" must be [ref:password]') {
      error.message = 'Password value is not equal to checkPassword'
    }
    messages.push(error.message)
  })
  return messages.join('|')
}

const checkUserInfoUniqueness = async (body, id) => {
  const { account, name, email } = body

  // Check if user is exists by account
  if (account) {
    const checkAccount = await User.findOne({
      where: {
        id: { [Op.not]: id },
        account: Sequelize.where(
          Sequelize.literal(`BINARY account`),
          `${account}`
        )
      }
    })
    if (checkAccount) {
      throw new ApiError('AccountExistsError', 401, 'Account already exists')
    }
  }

  // Check if user is exists by email
  if (email) {
    const checkEmail = await User.findOne({
      where: {
        id: { [Op.not]: id },
        email: Sequelize.where(Sequelize.literal(`BINARY email`), `${email}`)
      }
    })
    if (checkEmail) {
      throw new ApiError('EmailExistsError', 401, 'Email already exists')
    }
  }

  // Check if user is exists by name
  if (name) {
    const checkName = await User.findOne({
      where: {
        id: { [Op.not]: id },
        name: Sequelize.where(Sequelize.literal(`BINARY name`), `${name}`)
      }
    })
    if (checkName) {
      throw new ApiError('NameExistsError', 401, 'Name already exists')
    }
  }
}

module.exports = {
  joiMessageHandler,
  userInfoSchema,
  tweetSchema,
  replySchema,
  messageSchema,
  memberSchema,
  roomSchema,
  checkUserInfoUniqueness
}
