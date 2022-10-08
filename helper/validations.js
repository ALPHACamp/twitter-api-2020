const joi = require('joi')

const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().max(50).required(),
    account: joi.string().required(),
    introduction: joi.string().max(150),
    password: joi.string().required(),
    email: joi.string().email().required()
  })
  return schema.validate(data)
}

module.exports = {
  userValidation
}
