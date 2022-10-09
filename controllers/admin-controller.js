const { User, Tweet, Like } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const adminController = {
  signin: (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      // sign a token (payload + key)
      if (user?.role === 'user') throw new Error('此帳號不存在')
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      delete user.password
      res.json({
        status: 'success',
        data: { token, user }
      })
    } catch (error) {
      next(error)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: Tweet },
        { model: Like },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        const userData = users.map(user => ({
          id: user.id,
          name: user.name,
          account: user.account,
          image: user.image,
          backgroundImage: user.backgroundImage,
          followingNum: user.Followings.length,
          followerNum: user.Followers.length,
          tweetNum: user.Tweets.length,
          likeNum: user.Likes.length
        }))
        userData.sort((a, b) => b.tweetNum - a.tweetNum)
        return res.status(200).json(userData)
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
