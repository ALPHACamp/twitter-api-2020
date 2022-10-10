const joi = require('joi')

const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().max(50).required(),
    account: joi.string(),
    introduction: joi.string().max(150),
    password: joi.string(),
    email: joi.string().email()
  })
  return schema.validate(data)
}

const tweetValidation = (data) => {
  const schema = joi.object({
    description: joi.string().max(140)
  })
  return schema.validate(data)
}

module.exports = {
  userValidation,
  tweetValidation
}
