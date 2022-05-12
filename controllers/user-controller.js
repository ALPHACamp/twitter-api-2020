const userServices = require('../services/user')

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      if (userData.role !== 'user') {
        return res.status(403).json({ status: 'error', message: '非使用者' })
      }
      const token = await userServices.token(userData)
      res.json({
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
