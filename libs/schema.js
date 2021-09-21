const ajvInstance = require('./ajv-instance')

const signUpSchema = {
  type: 'object',
  properties: {
    account: { type: 'string', maxLength: 50 },
    name: { type: 'string', maxLength: 50 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    checkPassword: { type: 'string' }
  },
  required: ['account', 'name', 'email', 'password', 'checkPassword'],
  additionalProperties: false,
}

const signInSchema = {
  type: 'object',
  properties: {
    account: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['account', 'password']
}

const signUp = ajvInstance.compile(signUpSchema)
const signIn = ajvInstance.compile(signInSchema)
module.exports = { signUp, signIn }