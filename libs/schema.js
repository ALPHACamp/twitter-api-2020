const ajvInstance = require('./ajv-instance')

const signUpSchema = {
  type: 'object',
  properties: {
    account: { type: 'string', maxLength: 50, minLength: 1 },
    name: { type: 'string', maxLength: 50, minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
    checkPassword: { type: 'string', minLength: 1 },
  },
  required: ['account', 'name', 'email', 'password', 'checkPassword'],
  additionalProperties: false,
}

const signInSchema = {
  type: 'object',
  properties: {
    account: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 1 },
  },
  required: ['account', 'password'],
  additionalProperties: false
}

const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 50, minLength: 1 },
    introduction: { type: 'string', maxLength: 160 }
  },
  additionalProperties: false
}

const userSettingsSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 50, minLength: 1 },
    account: { type: 'string', maxLength: 50, minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
    checkPassword: { type: 'string', minLength: 1 }
  },
  required: ['name', 'account', 'email'],
  additionalProperties: false
}

const adminSignInSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 }
  },
  required: ['email', 'password'],
  additionalProperties: false
}

const signUp = ajvInstance.compile(signUpSchema)
const signIn = ajvInstance.compile(signInSchema)
const user = ajvInstance.compile(userSchema)
const userSettings = ajvInstance.compile(userSettingsSchema)
const adminSignIn = ajvInstance.compile(adminSignInSchema)
module.exports = { signUp, signIn, user, userSettings, adminSignIn }