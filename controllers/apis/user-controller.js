const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Tweet, Reply } = db

const userController = {
  signUp: (req, res) => {
    // 待完成
    bcrypt
      .hash(req.body.password, 10)
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        res.redirect('api/users/signin')
      })
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('This user does not exist')

      const userData = user.toJSON()

      res.status(200).json(userData)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, as: 'userreply', attributes: { exclude: ['password'] } },
          {
            model: Tweet,
            as: 'usertweets',
            include: [{ model: User, as: 'author', attributes: ['account'] }]
          }
        ],
        order: [['createdAt', 'DESC']],
        nest: true
      })

      const userRepliesResult = replies.map(reply => reply.toJSON())
      res.status(200).json(userRepliesResult)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
