const jwt = require('jsonwebtoken')
const fs = require('fs')
const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports = (user) => {
  const id = user.id
  const expiresIn = 12 * 60 * 60 //以秒計算
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signToken = jwt.sign(payload, PRIVATE_KEY)

  return { token: signToken }
}