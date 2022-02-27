const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { getUser } = require('../_helpers')
const { User, Tweet } = require('../models')

const adminServices = {
  userLogin: (req, cb) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      attributes: ['id', 'account', 'name', 'cover', 'avatar',
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Tweets WHERE Tweets.UserId = User.id)'),
          'tweetAmount'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.followingId = User.id)'),
          'follower'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.followerId = User.id)'),
          'following'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.UserId = User.id)'), 'likeAmount']
      ],
      order: [[sequelize.col('tweetAmount'), 'DESC'], ['createdAt']],
      raw: true,
      nest: true
    })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    return Tweet.findAll({
      attributes: ['id', 'description', 'createdAt',
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeAmount'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.TweetId = Tweet.id)'),
          'replyAmount']
      ],
      include: { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          id: t.id,
          userData: {
            id: t.User.id,
            account: t.User.account,
            name: t.User.name,
            avatar: t.User.avatar
          },
          description: t.description,
          replyAmount: t.replyAmount,
          likeAmount: t.likeAmount,
          createdAt: t.createdAt
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    return Tweet.destroy({
      where: { id: req.params.tweetId },
      raw: true,
      nest: true
    })
      .then(tweet => {
        if (!tweet) throw new Error('此貼文不存在，可能是 Parameters 的資料錯誤或已經被刪除')
        return cb(null, {
          status: 'success',
          message: '操作成功'
        })
      })
      .catch(err => cb(err))
  }
}
module.exports = adminServices
