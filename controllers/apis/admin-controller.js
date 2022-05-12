const { User, Tweet, Identity } = require('../../models')

const userController = {
  getUsers: async (req, res, next) => {
    const users = await User.findAll({
      include: Identity,
      raw: true,
      nest: true
    })
    res.json({
      status: 'success',
      data: users
    })
  },

  deleteTweet: async (req, res, next) => {
    await Tweet.findByPk(req.params.id)
  }
}

module.exports = userController
