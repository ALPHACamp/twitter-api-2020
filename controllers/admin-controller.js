const createToken = require('../function/token')

const adminController = {
  login: async (req, res) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') return res.status(403).json({ status: 'error', message: '非管理者' })
      const token = await createToken(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
