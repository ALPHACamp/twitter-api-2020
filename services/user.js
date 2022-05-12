const jwt = require('jsonwebtoken')
const userServices = {
  token: async (userData) => {
    try {
      return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '10d' })
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = userServices
