const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like, Reply } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required')

    return User.findOne({ where: { account, role: 'admin' }, raw: true })
      .then(user => {
        if (!user) {
          throw new Error('帳號不存在!')
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
          throw new Error('密碼錯誤!')
        }
        const UserId = { id: user.id }
        const token = jwt.sign(UserId, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        delete user.password
        return res.status(200).json({ success: true, token, user })
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: Tweet, attributes: [] }],
      attributes: [
        'id', 'account', 'name', 'avatar', 'cover',
        [
          sequelize.fn('COUNT', sequelize.col('Tweets.user_id')), 'tweetCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.tweet_id WHERE Tweets.user_id = User.id)'), 'likeCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships AS followerCount WHERE follower_id = User.id)'), 'followerCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships AS followingCount WHERE following_id = User.id)'), 'followingCount'
        ]
      ],
      order: [[sequelize.literal('tweetCount'), 'DESC']],
      group: ['User.id']
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.destroy({ where: { TweetId } }), // 刪除tweet一併去資料庫刪除like跟reply的資料
      Reply.destroy({ where: { TweetId } })
    ])
      .then(([tweet, likes, replies]) => {
        if (!tweet) throw new Error('tweet not found')
        return tweet.destroy()
      })
      .then(() => res.status(200).json({ success: true, message: 'tweet has been deleted' }))
      .catch(err => next(err))
  }
}

module.exports = adminController
