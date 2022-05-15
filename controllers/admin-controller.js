const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const adminController = {

  adminSignIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('號和密碼為必填！')
    try {
      const userData = getUser(req)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
        token,
        userData
      })
    } catch (err) {
      next(err)
    }
  }

}

module.exports = adminController
