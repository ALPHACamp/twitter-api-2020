const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({
      where: { account }
    })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role !== 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.status(200).json({
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },
  getAdminUsers: (req, res, next) => {
    return User.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  getAdminTweets: (req, res, next) => {
    return Tweet.findAll({
      attributes: ['id', 'description', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: { model: User, attributes: ['id', 'name', 'account'] }
    })
      .then(tweets => {
        const result = tweets
          .map(t => ({
            ...t.toJSON()
          }))

        result.forEach(r => {
          r.tweetId = r.id
          r.description = r.description.toString(0, 50)
          r.User.userId = r.User.id
          delete r.id
          delete r.User.id
        })

        res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  deleteAdminTweet: (req, res, next) => {
    const getTweetId = Number(req.params.id)
    return Tweet.destroy({
      where: { id: getTweetId }
    })
      .then(deletedTweet => {
        if (!deletedTweet) throw new Error('Tweet not exist!')
        return res.status(200).json({ message: 'Tweet deleted!' })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController