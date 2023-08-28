const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Tweet, Like } = db
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const options = {
        raw: true,
        attributes: [
          'id',
          'name',
          'account',
          'introduction',
          'avatar',
          'cover',
          [
            sequelize.literal(
              '(SELECT COUNT(DISTINCT id) FROM Tweets WHERE Tweets.user_id = User.id)'
            ),
            'tweetCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = User.id)'
            ),
            'followerCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.follower_id = User.id)'
            ),
            'followingCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.user_id = User.id)'
            ),
            'likeCount'
          ]
        ],
        order: [[sequelize.col('tweetCount'), 'DESC'], ['createdAt']]
      }
      const users = await User.findAll(options)
      // console.log("usersbeforeforeach", users);
      users.forEach(user => {
        if (user.introduction) {
          user.introduction = user.introduction.substring(0, 50)
        }
      })

      // console.log(users);
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const options = {
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar'],
            as: 'author'
          }
        ]
      }
      const tweets = await Tweet.findAll(options)
      tweets.forEach(tweet => {
        tweet.description = tweet.description.substring(0, 50)
      })
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const [tweet] = await Promise.all([
        Tweet.destroy({
          where: { id: req.params.id },
          raw: true,
          nest: true
        }),
        Like.destroy({
          where: { TweetId: req.params.id },
          raw: true,
          nest: true
        })
      ])

      if (!tweet) {
        throw new Error(
          '此貼文不存在，可能是 Parameters 的資料錯誤或已經被刪除'
        )
      }

      return res.status(200).json({
        status: 'success',
        message: 'Successfully delete tweet.'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) {
        throw new Error('Please enter account and password')
      }

      const user = await User.findOne({ where: { account } })

      if (!user) throw new Error('User does not exist')
      if (user.role === 'user') throw new Error('user permission denied')
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect password')
      }

      const payload = {
        id: user.id,
        account: user.account,
        role: user.role
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
