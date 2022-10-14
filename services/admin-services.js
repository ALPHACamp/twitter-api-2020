const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const { User, Tweet, Like, Reply, sequelize } = require('../models')

const adminServices = {
  signIn: (req, cb) => {
    try {
      const userData = getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('admin permission denied')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id )'), 'TweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id )'), 'FollowersCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id )'), 'FollowingsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.user_id = User.id )'), 'LikedCount']
        ]
      },
      order: [[sequelize.literal('TweetsCount'), 'DESC'], ['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(users => cb(null, users))
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    return Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          id: t.id,
          description: t.description.substring(0, 50),
          createdAt: t.createdAt,
          userData: {
            id: t.User.id,
            account: t.User.account,
            name: t.User.name,
            avatar: t.User.avatar
          }
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    const id = req.params.id
    return Promise.all([
      Tweet.destroy({ where: { id } }),
      Like.destroy({ where: { TweetId: id } }),
      Reply.destroy({ where: { TweetId: id } })
    ])
      .then(deleteTweet => {
        if (!deleteTweet) throw new Error("Tweet didn't exist!")
        return cb(null, {
          status: 'success',
          message: '操作成功'
        })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
