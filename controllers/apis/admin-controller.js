const { User, Tweet } = require('../../models')

const adminController = {
  adminLogin: async (req, res, next) => {
    try {
      const { account } = req.body
      const user = await User.findOne({
        where: { account },
        raw: true
      })
      if (!user) return res.json({ status: 'failed', data: 'You are not admin' })
      if (user.role !== 'admin') return res.json({ status: 'failed', data: 'You are not admin' })
      return res.json({ status: 'success', data: 'You are admin' })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = User.findAll({
        raw: true,
        nest: true
      })
      return res.json({ status: 'success', data: users })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = Tweet.findAll({
        raw: true,
        nest: true
      })
      return res.json({ status: 'success', data: tweets })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
