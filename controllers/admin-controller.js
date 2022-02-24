const { User } = require('../models')

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        order: [['totalTweets', 'DESC']],
        raw: true,
        nest: true
      })

      return res.status(200).json(users)

    } catch (err) { next(err) }
  }
}