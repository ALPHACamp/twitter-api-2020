const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = 'rexrubyarmokaiyu'
module.exports = (user) => {
  const id = user.id
  const expiresIn = 12 * 60 * 60 //以秒計算
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signToken = jwt.sign(payload, privateKey)

  return { token: signToken }
}