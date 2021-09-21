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
  additionalProperties: false
}

const signUp = ajvInstance.compile(signUpSchema)
module.exports = { signUp }