const ajvInstance = require('./ajv-instance')

const userSchema = {
  type: 'object',
  properties: {
    account: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    checkPassword: { type: 'string' }
  },
  required: ['account', 'name', 'email', 'password', 'checkPassword'],
  additionalProperties: false
}

module.exports = ajvInstance.compile(userSchema)