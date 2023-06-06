const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    try {
      // 製作token給使用者
      const userData = req.user
      delete userData.password
      const tokenData = { ...userData }
      delete tokenData.Tweets

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
