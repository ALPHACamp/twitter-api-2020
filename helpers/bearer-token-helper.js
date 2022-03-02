const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
/**
 * 
 * @param {*} req 
 * @returns {Boolean} [是否過期]
 */

function identifyJWT(req) {

  const bearerToken = (req.headers['authorization'].split(' '))[1]
  const decode = jwt.verify(bearerToken, process.env.JWT_SECRET)
  return dayjs(decode.iat).isSame(decode.exp)
}

exports = module.exports = {
  identifyJWT
}