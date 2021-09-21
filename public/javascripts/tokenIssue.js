const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = process.env.tokenKey || fs.readFileSync(__dirname + '/../../rsaPrivateKey.pem', 'utf8')
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