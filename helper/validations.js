const joi = require('joi')

const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().trim().max(50).required(),
    account: joi.string().trim(),
    introduction: joi.string().trim().max(160),
    password: joi.string().trim(),
    email: joi.string().trim().email()
  })
  return schema.validate(data)
}

const tweetValidation = (data) => {
  const schema = joi.object({
    description: joi.string().trim().max(140)
  })
  return schema.validate(data)
}

module.exports = {
  userValidation,
  tweetValidation
}
